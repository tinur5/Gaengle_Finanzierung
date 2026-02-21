import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gängle Finanzierung",
  description: "Visualisierung der Finanzierung für 3-Parteien-Stockwerkeigentum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
