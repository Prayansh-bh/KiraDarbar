import { NextResponse } from "next/server";
import { Resend } from "resend";
import { RightsReportEmail } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function POST(request: Request) {
  try {
    const { email, state, issues } = await request.json();

    if (!email || !state || !issues) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: 'KiraDarbar <onboarding@resend.dev>',
        to: email,
        subject: `Your Tenant Rights Report — ${state}`,
        react: RightsReportEmail({ state, issues }) as any,
      });

      if (error) {
        console.error("Resend Error:", error);
        if (process.env.NEXT_PUBLIC_DEVELOPMENT_BYPASS_AUTH === "true") return NextResponse.json({ success: true, bypass: true });
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, id: data?.id });
    } catch (resendError: any) {
      console.error("Resend Send Exception:", resendError);
      if (process.env.NEXT_PUBLIC_DEVELOPMENT_BYPASS_AUTH === "true") return NextResponse.json({ success: true, bypass: true });
      throw resendError;
    }
  } catch (err: any) {
    console.error("Exception in rights email route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
