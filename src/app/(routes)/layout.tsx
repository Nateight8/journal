import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import AppNavbar from "@/components/nav/appnavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="md:px-1.5">
          <div className="flex bg-muted/50 border flex-1 flex-col gap-4 lg:gap-6 pb-4 lg:pb-6 ">
            {/* Page intro */}
            <div className="px-4 md:px-6 lg:px-8">
              <AppNavbar />
            </div>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
