import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata = {
  title: "Premium Fitness Coaching",
  description: "Build the strongest version of you with personalized fitness coaching.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/logo-compressed.webp" as="image" />
        <link rel="preload" href="/dumbbell-frames/ezgif-frame-001.png" as="image" />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <div style={{ width: "100%", position: "relative" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
