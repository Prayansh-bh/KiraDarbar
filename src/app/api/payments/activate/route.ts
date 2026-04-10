import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Verify the user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, product } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseAdminKey);

    // 2. Verify signature if secret is available
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret) {
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        console.error("Signature mismatch — payment tampering detected");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    // 3. Mark payment as paid
    const { error: paymentErr } = await supabaseAdmin
      .from("payments")
      .update({ status: "paid", razorpay_payment_id })
      .eq("razorpay_order_id", razorpay_order_id);

    if (paymentErr) {
      console.error("Failed to update payment:", paymentErr);
      // Non-fatal — still proceed to upgrade the plan
    }

    // 4. Upgrade user plan directly (authenticated user's own account)
    if (!product || product.startsWith("shield")) {
      const isAnnual = product === "shield_annual";
      const expiration = new Date();
      if (isAnnual) expiration.setFullYear(expiration.getFullYear() + 1);
      else expiration.setMonth(expiration.getMonth() + 1);

      const { error: upgradeError } = await supabaseAdmin
        .from("users")
        .upsert({
          id: user.id,
          plan: "shield",
          plan_started_at: new Date().toISOString(),
          plan_expires_at: expiration.toISOString(),
        });

      if (upgradeError) {
        console.error("Plan upgrade failed:", upgradeError);
        return NextResponse.json({ error: "Plan upgrade failed: " + upgradeError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Internal error: " + error.message }, { status: 500 });
  }
}
