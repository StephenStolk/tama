import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./(main)/header/page";
import BottomBar from "./(main)/bottombar/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "A Reddit clone built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} no-scrollbar`}>
      <ToastContainer />
        <Header />
        <main className="container mx-auto px-4">{children}</main>
        <BottomBar />
      </body>
    </html>
  );
}
