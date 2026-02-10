import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Factuurr - Belgische Factuur & Offerte Generator",
  description: "Eenvoudig en snel professionele facturen en offertes maken voor de Belgische markt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        {children}
      </body>
    </html>
  );
}
