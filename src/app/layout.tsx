import { Inter } from "next/font/google";

import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import AppNavbar from "@/components/nav/appnavbar";

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
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="overflow-hidden md:px-1.5">
            <div className="flex bg-muted/50 border flex-1 flex-col gap-4 lg:gap-6 pb-4 lg:pb-6 px-0 md:px-6 lg:px-8">
              {/* Page intro */}
              <div className="px-4 md:px-0">
                <AppNavbar />
              </div>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
