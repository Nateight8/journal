"use client";
import * as React from "react";

import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  RiDashboardLine,
  RiBookOpenLine,
  RiLineChartLine,
  RiBankLine,
  RiCalendarLine,
  RiShieldCheckLine,
  RiStockLine,
  RiMapPinLine,
  RiTrophyLine,
  RiSettings3Line,
  RiQuestionLine,
} from "react-icons/ri";
import { RiLogoutBoxLine } from "@remixicon/react";
import { usePathname } from "next/navigation";

const navlinks = [
  {
    title: "Trading",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: RiDashboardLine,
      },
      {
        title: "Journal",
        url: "/journal",
        icon: RiBookOpenLine,
        isActive: true,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: RiLineChartLine,
      },
      {
        title: "Account Manager",
        url: "/accounts",
        icon: RiBankLine,
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: RiCalendarLine,
      },
      {
        title: "Risk Manager",
        url: "/risk",
        icon: RiShieldCheckLine,
      },
    ],
  },
  {
    title: "Tools",
    url: "#",
    items: [
      {
        title: "Market Watch",
        url: "/market",
        icon: RiStockLine,
      },
      {
        title: "Trade Planner",
        url: "/planner",
        icon: RiMapPinLine,
      },
      {
        title: "Performance",
        url: "/performance",
        icon: RiTrophyLine,
      },
    ],
  },
  {
    title: "Account",
    url: "#",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: RiSettings3Line,
      },
      {
        title: "Billing",
        url: "/billing",
        icon: RiBankLine,
      },
      {
        title: "Help Center",
        url: "/help",
        icon: RiQuestionLine,
      },
    ],
  },
];

export default navlinks;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const checkActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Logo />
        <hr className="border-t border-border mx-2 -mt-px" />
      </SidebarHeader>
      <SidebarContent>
        {navlinks.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                      isActive={checkActive(item.url)}
                    >
                      <a href={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto">
              <RiLogoutBoxLine
                className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                size={22}
                aria-hidden="true"
              />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
