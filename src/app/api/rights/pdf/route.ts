import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getRightsForStateAndIssue, ISSUES_MAP } from "@/lib/rightsData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const issuesParam = searchParams.get("issues");

    if (!state || !issuesParam) {
      return new NextResponse("Missing state or issues", { status: 400 });
    }

    const issues = issuesParam.split(",");
    
    // Create PDF
    const doc = new jsPDF() as any;

    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("KiraDarbar", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(232, 96, 42); 
    doc.text("TENANT RIGHTS REPORT", 20, 30);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Tenant Rights in ${state}`, 20, 55);

    let currentY = 70;

    issues.forEach((issueId, idx) => {
      const right = getRightsForStateAndIssue(state, issueId);
      const issueName = ISSUES_MAP[issueId] || issueId;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(232, 96, 42);
      doc.text(`${idx + 1}. ${issueName}`, 20, currentY);
      currentY += 8;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const titleLines = doc.splitTextToSize(`Right: ${right.title}`, 170);
      doc.text(titleLines, 20, currentY);
      currentY += titleLines.length * 6 + 2;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const contentLines = doc.splitTextToSize(right.content, 170);
      doc.text(contentLines, 20, currentY);
      currentY += contentLines.length * 5 + 4;

      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      const refLines = doc.splitTextToSize(`Legal Ref: ${right.legal_reference}`, 170);
      doc.text(refLines, 20, currentY);
      currentY += refLines.length * 5 + 4;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const actionLines = doc.splitTextToSize(`Recommended Action: ${right.action}`, 170);
      doc.text(actionLines, 20, currentY);
      currentY += actionLines.length * 5 + 10;

      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
    });

    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="KiraDarbar_Report_${state.replace(/\s+/g, '_')}.pdf"`,
      },
    });

  } catch (err) {
    console.error("PDF Generation Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
