import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import Razorpay from "razorpay";
import { z } from "zod";

const productPrices: Record<string, number> = {
  legal_notice: 79900,
  agreement_review: 49900,
  shield_monthly: 19900,
  shield_annual: 149900,
};

const OrderSchema = z.object({
  product: z.enum(["legal_notice", "agreement_review", "shield_monthly", "shield_annual"]),
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

    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_SagLmXuPg4OLJz';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'Z4sxemmncrzwtDiZ1wwF83g5';

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jabdlrcvcuopdwlagusr.supabase.co';
    const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYmRscmN2Y3VvcGR3bGFndXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTUwMzE2MCwiZXhwIjoyMDkxMDc5MTYwfQ.2-fPBy99s1Hms1FjRkCofzus-l-x7GFihUVRXVO0v7c';
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
