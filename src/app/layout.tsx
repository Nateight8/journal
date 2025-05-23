import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/components/providers/apollo-wraper";
import { AuthProvider } from "@/contexts/auth-context";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scheme-only-dark">
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <ApolloWrapper>
          <AuthProvider>{children}</AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
