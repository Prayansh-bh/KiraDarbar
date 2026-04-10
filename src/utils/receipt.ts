import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReceiptData {
  id: string;
  created_at: string;
  product: string;
  amount: number;
  status: string;
  user_name: string;
  user_email: string;
  razorpay_payment_id: string;
}

export const generateReceipt = (data: ReceiptData) => {
  try {
    const doc = new jsPDF() as any;

    // Header Colors & Logo Placeholder
    doc.setFillColor(15, 15, 15); // Black
    doc.rect(0, 0, 210, 40, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("KiraDarbar", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(212, 160, 23); // Saffron/Gold
    doc.text("INDIA'S FIRST TENANT PROTECTION SERVICE", 20, 30);

    // Receipt Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("TAX INVOICE / RECEIPT", 20, 60);

    const receiptId = data.id ? data.id.split('-')[0].toUpperCase() : 'N/A';
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt ID: ${receiptId}`, 20, 70);
    doc.text(`Date of Issue: ${new Date(data.created_at).toLocaleDateString('en-IN')}`, 20, 75);
    doc.text(`Payment Status: ${data.status.toUpperCase()}`, 20, 80);

    // Billing Details
    doc.setFont("helvetica", "bold");
    doc.text("BILLED TO:", 140, 60);
    doc.setFont("helvetica", "normal");
    doc.text(data.user_name || "Valued Tenant", 140, 65);
    doc.text(data.user_email || "", 140, 70);

    // Table
    autoTable(doc, {
      startY: 95,
      head: [["DESCRIPTION", "QTY", "UNIT PRICE", "TOTAL"]],
      body: [
        [
          (data.product || "PRODUCT").replace("_", " ").toUpperCase(),
          "1",
          `INR ${(data.amount / 100).toLocaleString('en-IN')}.00`,
          `INR ${(data.amount / 100).toLocaleString('en-IN')}.00`,
        ],
      ],
      headStyles: { fillColor: [15, 15, 15], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Total Summary
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 140, finalY);
    doc.text(`INR ${(data.amount / 100).toLocaleString('en-IN')}.00`, 180, finalY, { align: "right" });

    // Transaction ID
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`Razorpay Payment ID: ${data.razorpay_payment_id || "N/A"}`, 20, finalY + 10);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const footerText = "Thank you for choosing KiraDarbar. This is a computer-generated document and does not require a physical signature.";
    const lines = doc.splitTextToSize(footerText, 170);
    doc.text(lines, 20, 280);

    // Download
    doc.save(`KiraDarbar_Receipt_${receiptId}.pdf`);
  } catch (error) {
    console.error("Receipt Generation Error:", error);
    alert("FAILED TO GENERATE PDF. Please try again or contact support.");
  }
};
