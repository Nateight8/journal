import AppNavbar from "@/components/nav/app-navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="md:px-1.5  bg-muted/50"> */}
      {/* <div className="flex bg-muted/50 border flex-1 flex-col gap-4 lg:gap-6 pb-4 lg:pb-6 "> */}
      {/* Page intro */}

      <AppNavbar />

      <div className="flex-1">{children}</div>
      {/* </div> */}
      {/* </SidebarInset>
      </SidebarProvider> */}
    </>
  );
}
