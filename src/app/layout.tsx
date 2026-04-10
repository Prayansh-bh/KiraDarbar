import type { Metadata } from "next";
import { syne, dmSans, jetbrainsMono, notoDevanagari } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "KiraDarbar — India's First Tenant-Side Legal Protection",
  description: "Your landlord has a lawyer. Now you do too. India's first B2C SaaS platform for tenant rights, legal notices, and agreement reviews.",
  keywords: ["tenant rights India", "legal notice for deposit recovery", "rental agreement review", "landlord tenant dispute India", "Mumbai rent control", "Bangalore house rent laws"],
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${notoDevanagari.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
