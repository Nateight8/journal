import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/components/providers/apollo-wraper";
import { AuthProvider } from "@/contexts/auth-context";
import { Metadata } from "next";

// Optimize font loading with display swap and preload
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Mongo Inc. - Authentication",
  description: "Sign in to your Mongo Inc. account",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#000000",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "msapplication-TileColor": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scheme-only-dark" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <ApolloWrapper>
          <AuthProvider>{children}</AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
