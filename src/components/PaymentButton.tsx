"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, IndianRupee, AlertCircle, CheckCircle2 } from "lucide-react";

interface PaymentButtonProps {
  amount: number;
  caseId?: string;
  productType: "legal_notice" | "shield";
  buttonText: string;
}

export default function PaymentButton({ amount, caseId, productType, buttonText }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await loadRazorpay();

      if (!res) {
        setStatusMsg({type: 'error', text: 'Razorpay SDK failed to load. Are you online?'});
        return;
      }

      // 1. Create order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          product: productType, 
          case_id: caseId 
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: "INR",
        name: "KiraDarbar",
        description: `Payment for ${productType.replace("_", " ")}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // You could also verify on the client and redirect, 
          // but we rely on the backend webhook for the source of truth.
          setStatusMsg({type: 'success', text: 'Payment Successful! Your case is now in review.'});
          window.location.reload();
        },
        prefill: {
          name: "", // We could prefill from user profile
          email: "",
          contact: "",
        },
        theme: {
          color: "#E27D60", // Brand Saffron
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error("Payment error:", error);
      setStatusMsg({type: 'error', text: error.message || 'Something went wrong during payment initialization.'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handlePayment} 
        disabled={loading}
        className="w-full bg-primary text-secondary font-black italic tracking-tighter uppercase h-10 text-xs gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <IndianRupee className="w-4 h-4" />
        )}
        {buttonText}
      </Button>
      {statusMsg && (
        <div className={`flex items-center gap-2 p-2 rounded-lg text-xs font-bold ${statusMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {statusMsg.text}
        </div>
      )}
    </div>
  );
}
