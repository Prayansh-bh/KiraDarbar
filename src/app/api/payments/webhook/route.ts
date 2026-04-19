import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { z } from "zod";
import { Resend } from "resend";
import { CaseFiledEmail, ShieldWelcomeEmail } from "@/lib/email/templates";

// Zod Schema for the callback payload
const CallbackSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
});

// Lazily initialize Resend so a missing key doesn't crash the module at load time
const getResend = () => process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await request.json();
    const validation = CallbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Malformed payload validation failed" }, { status: 400 });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = validation.data;

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!secret) {
       console.warn("RAZORPAY_KEY_SECRET is missing! Bypassing signature verification (DEVELOPMENT ONLY).");
       // LOCAL DEVELOPMENT BYPASS: If no secret, we assume success to let the UI finish
       return NextResponse.json({ success: true, bypass: true }, { status: 200 });
    } else {
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        console.error(`Signature mismatch! Expected ${generated_signature}, got ${razorpay_signature}`);
        // LOCAL DEVELOPMENT BYPASS: If signature mismatches but bypass is active, return success
        if (process.env.NEXT_PUBLIC_PAYMENT_BYPASS_LOCAL === "true") {
           return NextResponse.json({ success: true, bypass: true }, { status: 200 });
        }
        return NextResponse.json({ error: "Tampering detected. Signature mismatch." }, { status: 400 });
      }
    }

    // 2. Idempotency Check & Fetch Payment Data
    const { data: paymentRecord, error: fetchErr } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (paymentRecord && paymentRecord.user_id) {
      const { data: userData } = await supabaseAdmin.from("users").select("full_name, email").eq("id", paymentRecord.user_id).single();
      paymentRecord.users = userData || null;
    }

    if (fetchErr || !paymentRecord) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (paymentRecord.status === "paid") {
      return NextResponse.json({ success: true, message: "Already processed" }, { status: 200 });
    }

    // 3. Mark Payment as Paid
    await supabaseAdmin
      .from("payments")
      .update({ status: "paid", razorpay_payment_id })
      .eq("razorpay_order_id", razorpay_order_id);

    const product = paymentRecord.product;
    const userId = paymentRecord.user_id;
    let finalCaseId = paymentRecord.case_id;

    // 4. State Mutations based on Product
    if (product.startsWith("shield")) {
      const isAnnual = product === "shield_annual";
      const expiration = new Date();
      if (isAnnual) expiration.setFullYear(expiration.getFullYear() + 1);
      else expiration.setMonth(expiration.getMonth() + 1);

      const { error: upgradeError } = await supabaseAdmin.from("users").upsert({
        id: userId,
        full_name: paymentRecord.users?.full_name || null,
        plan: "shield",
        plan_started_at: new Date().toISOString(),
        plan_expires_at: expiration.toISOString()
      });

      if (upgradeError) {
        console.error("Database Upsert Error (Plan Upgrade):", upgradeError);
        return NextResponse.json({ error: "Failed to create or update user plan" }, { status: 500 });
      }

      try {
        const resend = getResend();
        if (resend) {
          await resend.emails.send({
             from: 'KiraDarbar <onboarding@resend.dev>',
             replyTo: 'hello@kiradarbar.in',
             to: paymentRecord.users?.email || 'tenant@kiradarbar.in',
             subject: "You're now protected — Shield activated ✓",
             react: ShieldWelcomeEmail({ name: paymentRecord.users?.full_name || 'Tenant', expiration: expiration.toISOString() }) as any
          });
        } else {
          console.warn("RESEND_API_KEY not set — skipping Shield welcome email.");
        }
      } catch (emailErr) {
        console.warn("Email sending failed:", emailErr);
      }

    } else if (product === "legal_notice" || product === "agreement_review") {
      if (finalCaseId) {
        await supabaseAdmin.from("cases").update({ status: "under_review" }).eq("id", finalCaseId);
      } else {
        const { data: newCase } = await supabaseAdmin.from("cases").insert({
           user_id: userId,
           case_type: product,
           status: "under_review",
           title: `${product.replace('_', ' ').toUpperCase()} Checkout`
        }).select().single();
        if (newCase) finalCaseId = newCase.id;
      }

      const caseIdPrefix = finalCaseId ? finalCaseId.split('-')[0].toUpperCase() : 'UNKNOWN';
      try {
        const resend = getResend();
        if (resend) {
          await resend.emails.send({
             from: 'KiraDarbar Support <onboarding@resend.dev>',
             replyTo: 'hello@kiradarbar.in',
             to: paymentRecord.users?.email || 'tenant@kiradarbar.in',
             subject: `Your case has been filed — KD-${caseIdPrefix}`,
             react: CaseFiledEmail({ caseId: finalCaseId || '', pType: product }) as any
          });
        } else {
          console.warn("RESEND_API_KEY not set — skipping case filed email.");
        }
      } catch (emailErr) {
        console.warn("Case email sending failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true, case_id: finalCaseId }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook Handler Error:", error?.message || error);
    return NextResponse.json({ error: "Internal Server Error", details: error?.message }, { status: 500 });
  }
}
