import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Editorial serif accent — used sparingly for display headlines.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "Fomi Studio — Image Workspace",
  description:
    "Fomi Studio is a warm, focused workspace for generating professional-quality AI images and video.",
  applicationName: "Fomi Studio",
  authors: [{ name: "Fomi" }],
  keywords: ["AI", "image generation", "creative workspace", "Fomi"],
};

export const viewport = {
  themeColor: "#f1e7de",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
