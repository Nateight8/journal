"use client";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { MenuSheet } from "@/components/nav/menu-button";
import UserDropdown from "@/components/user-dropdown";

const navItems = [
  { name: "Dashboard", href: "/dash", current: true },
  { name: "Trades", href: "/trades" },
  { name: "Analytics", href: "/analytics" },
  { name: "Calendar", href: "/calendar" },
  { name: "Journal", href: "/journal" },
  { name: "Settings", href: "/settings" },
];

export default function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" px-4 sm:px-6 w-full lg:px-8">
        <div className="flex h-20 w-full items-center justify-between">
          {/* Logo and mobile menu button */}
          <MenuSheet />

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* User Profile */}
            <div className="flex gap-3 ml-auto ">
              <UserDropdown />
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.current
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2">
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                onClick={() => setIsOpen(false)}
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
