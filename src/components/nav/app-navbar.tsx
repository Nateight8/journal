"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Journal", href: "/journal", badge: "14" },
  { name: "Notes", href: "/notes" },
  { name: "Analytics", href: "/analytics" },
  { name: "Account Manager", href: "/accounts", isHidden: true },
  { name: "Calendar", href: "/calendar" },
];

// Mock user data - replace with real user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "Premium User",
};

export default function AppNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    // For the home page
    if (href === "/" && pathname === "/") return true;
    // For other pages, check if the current path starts with the href
    return href !== "/" && pathname?.startsWith(href);
  };

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav className="sticky w-full top-0 z-40 backdrop-blur-3xl border-b">
        <div className="flex h-fit lg:h-[72px] w-full items-center px-4 lg:px-8">
          {/* Mobile Menu Button - Left */}
          <div className="lg:hidden flex items-center h-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              <div className="grid grid-cols-2 gap-1 w-5 h-5">
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
              </div>
            </Button>
          </div>

          {/* Logo Section - Left side on desktop */}
          <div className="hidden lg:flex items-center h-full">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl tracking-tight">TRADZ</span>
            </Link>
          </div>

          {/* Language Selector - Next to logo on desktop */}
          <div className="hidden lg:flex h-full items-center border-r border-l px-6 ml-6">
            <span className="text-sm font-medium">EN</span>
          </div>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden lg:flex h-full items-center justify-center flex-1">
            <div className="flex h-full items-center">
              {navItems
                .filter((item) => !item.isHidden)
                .map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`h-full flex items-center px-6 text-sm font-medium tracking-wide transition-colors relative group ${
                        active
                          ? "text-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="uppercase">{item.name}</span>
                      {item.badge && (
                        <span className="ml-1 text-[10px] text-muted-foreground font-normal align-super">
                          {item.badge}
                        </span>
                      )}
                      {active && (
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground"
                          layoutId="navbar-indicator"
                        />
                      )}
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-foreground/50"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      />
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center h-full ml-auto">
            {/* Desktop Menu Button */}
            <div className="hidden lg:flex h-full items-center border-r px-6">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-muted"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">MENU</span>
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-foreground rounded-full"
                    />
                  ))}
                </div>
              </Button>
            </div>

            {/* Profile Button */}
            <div className="h-full flex items-center relative" ref={profileRef}>
              <Button
                variant="ghost"
                className="h-full flex items-center -mr-4 px-4 lg:px-6 text-sm font-medium tracking-wide hover:bg-muted transition-colors rounded-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {/* Profile text hidden on mobile */}
                <span className="hidden lg:inline mr-2">PROFILE</span>
                {/* User icon shown on mobile */}
                <div className="lg:hidden w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                {/* Chevron down hidden on mobile */}
              </Button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    className="absolute top-full right-0 w-80 bg-background border border-border shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* User Info Section */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{userData.name}</p>
                          {/* <p className="text-xs text-muted-foreground">
                            {userData.email}
                          </p> */}
                          <p className="text-xs text-muted-foreground">
                            {userData.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        View Profile
                      </Link> */}
                      {/* <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link> */}
                      {/* <div className="border-t border-border my-2"></div> */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="w-4 hidden lg:inline-block border-l h-full" />
        </div>
      </nav>

      {/* Full Screen Navigation Menu - Available on both mobile and desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background z-50 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-8 border-b">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <span className="font-bold text-xl tracking-tight">TRADZ</span>
              </Link>
              <div className="flex items-center space-x-6">
                <span className="text-sm font-medium">EN</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 flex flex-col justify-center px-8 max-w-2xl mx-auto w-full">
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
                className="space-y-8"
              >
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.name}
                      variants={{
                        open: {
                          x: 0,
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 24,
                          },
                        },
                        closed: {
                          x: -50,
                          opacity: 0,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 24,
                          },
                        },
                      }}
                      className="relative group"
                    >
                      <Link
                        href={item.href}
                        className={`block text-4xl md:text-5xl lg:text-6xl font-light tracking-tight transition-colors ${
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className="flex items-center relative"
                          whileHover={{ x: 10 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          {item.name}
                          {item.badge && (
                            <span className="ml-3 text-lg text-muted-foreground font-normal align-super">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      </Link>
                      {/* Hover effect for full-screen menu items */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-foreground/30"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </motion.div>
                  );
                })}

                {/* Join The Hub */}
                <motion.div
                  variants={{
                    open: {
                      x: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                        delay: 0.6,
                      },
                    },
                    closed: {
                      x: -50,
                      opacity: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      },
                    },
                  }}
                  className="pt-8 mt-8 border-t relative group"
                >
                  <Link
                    href="/hub"
                    className="flex items-center text-2xl md:text-3xl font-light text-foreground hover:text-muted-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <span>Join The Hub</span>
                      <ExternalLink className="ml-4 h-6 w-6" />
                    </motion.div>
                  </Link>
                  {/* Hover effect for Join The Hub */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-foreground/30"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              className="p-8 border-t"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-xs text-neutral-500">
                &copy; {new Date().getFullYear()} Mongo, Inc. All rights
                reserved.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
