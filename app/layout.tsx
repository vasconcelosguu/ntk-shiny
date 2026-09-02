import "./globals.css";
import Image from "next/image";

import Header from "./components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#030603] text-white antialiased">
        <Header />

        <main>{children}</main>
      </body>
    </html>
  );
}