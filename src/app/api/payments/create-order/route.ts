import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import Razorpay from "razorpay";
import { z } from "zod";

const productPrices: Record<string, number> = {
  legal_notice: 79900,
  agreement_review: 49900,
  deposit_recovery: 79900,
  rights_check: 29900,
  shield_monthly: 19900,
  shield_annual: 149900,
};

const OrderSchema = z.object({
  product: z.enum(["legal_notice", "agreement_review", "deposit_recovery", "rights_check", "shield_monthly", "shield_annual"]),
  case_id: z.string().uuid().optional(),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = OrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload", details: validation.error.format() }, { status: 400 });
    }

    const { product, case_id } = validation.data;
    const amount = productPrices[product];

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: "Razorpay credentials are not configured in environment variables." }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: user.id,
        caseId: case_id || "",
        product: product,
      },
    };

    const order = await razorpay.orders.create(options);

    // Insert pending row into Supabase using admin client to bypass RLS for internal tracking
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseAdminKey);

    const { error: dbError } = await supabaseAdmin.from("payments").insert({
      user_id: user.id,
      case_id: case_id || null,
      razorpay_order_id: order.id,
      amount: amount, 
      product: product,
      status: "pending",
    });

    if (dbError) {
      console.error("Database Insert Error (payments):", dbError);
      return NextResponse.json({ error: "Failed to log pending transaction" }, { status: 500 });
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: key_id,
    }, { status: 200 });

  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
