import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import UserDropdown from "../user-dropdown";

export default function AppNavbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ms-4" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </div>
      <div className="flex gap-3 ml-auto">
        <UserDropdown />
      </div>
    </header>
  );
}
