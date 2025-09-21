import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CozyCorner OS",
  description: "A cute retro OS with infinite canvas desktop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
