import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnimeAssistant from "./lib/components/AnimeAssistant";
import NavBar from "@/app/lib/components/NavBar";
import Footer from "@/app/lib/components/Footer";
import { AuthProvider } from "@/app/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aniverse",
  description: "Discover the best anime airing now",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0d0d1a] text-white`}>
        <AuthProvider>
          <NavBar />
          <main className="min-h-screen">
            {children}
            <AnimeAssistant />
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}