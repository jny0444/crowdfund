import { Metadata } from "next";

import "@/styles/globals.css";
import "@/styles/font.css";

import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "CrowdFund",
  description: "The crowdfunding platform on chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:text-white selection:bg-purple-800">
        {/* <Navbar /> */}
        <Providers>{children}</Providers>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
