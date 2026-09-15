import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auraxhero X — Machine-Era Capability Network",
  description:
    "Discover useful capabilities, tools, agents, and opportunities built for the machine era.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
