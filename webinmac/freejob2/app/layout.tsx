import type { Metadata } from "next";
import { Noto_Sans_Thai, Oswald, Anton, Bebas_Neue, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { MockDataInitializer } from "@/components/mock-data-initializer";
import { FontSizeProvider } from "@/context/font-size-context";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import { SearchProvider } from "@/context/search-context";
import { FreelancerProvider } from "@/context/freelancer-context";
import { GlobalToastContainer } from "@/components/ui/global-toast-container";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-thai",
  display: "swap",
  preload: true, // Main font - preload it
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
  preload: false, // Secondary font - don't preload
});

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
  preload: false, // Secondary font - don't preload
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
  preload: false, // Secondary font - don't preload
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: false, // Secondary font - don't preload
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  preload: false, // Secondary font - don't preload
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
        <MockDataInitializer />
        {/* Context Providers - Order matters for dependencies */}
        <FontSizeProvider>
          <AuthProvider>
            <ToastProvider>
              <SearchProvider>
                <FreelancerProvider>
                  {children}
                  <GlobalToastContainer />
                </FreelancerProvider>
              </SearchProvider>
            </ToastProvider>
          </AuthProvider>
        </FontSizeProvider>
      </body>
    </html>
  );
}
