import type { Metadata } from "next";
import { Noto_Sans_Thai, Oswald, Anton, Bebas_Neue, Inter, Roboto } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Freejob - Freelance Marketplace",
  description: "Connect Clients with Freelancers. Direct deals, no payment gateway.",
  icons: {
    icon: '/logofreejob.png',
    apple: '/logofreejob.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSansThai.variable} ${oswald.variable} ${anton.variable} ${bebasNeue.variable} ${inter.variable} ${roboto.variable}`} suppressHydrationWarning>
      <body className={`${notoSansThai.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
