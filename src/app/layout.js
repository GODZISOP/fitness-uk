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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/logo-compressed.webp" as="image" />
        <link rel="preload" href="/dumbbell-frames/ezgif-frame-001.png" as="image" />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
