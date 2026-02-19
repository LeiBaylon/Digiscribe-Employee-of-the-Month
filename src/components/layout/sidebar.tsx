"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Trophy,
  BarChart3,
  Award,
  Send,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/nominations", label: "Nominate", icon: Send },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/hall-of-fame", label: "Hall of Fame", icon: Award },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const initials = getInitials(displayName);

  return (
    <>
      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-sm"
            >
              <div className="bg-layer-1 border border-white/10 rounded-sm p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Sign Out
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      Are you sure you want to sign out?
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 h-9 rounded-sm text-sm font-medium bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setShowLogoutConfirm(false);
                    }}
                    className="flex-1 h-9 rounded-sm text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
      className="fixed left-0 top-0 h-screen bg-layer-1/80 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
    >
      {/* Logo + Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onToggle}
              className="w-9 h-9 flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              title="Expand sidebar"
            >
              <Image
                src="/logo-icon.png"
                alt="Digiscribe"
                width={36}
                height={36}
                className="object-contain"
                unoptimized
              />
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between flex-1"
            >
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Digiscribe"
                  width={160}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </Link>
              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-sm flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-white/10 text-foreground"
                  : "text-foreground-muted hover:text-foreground hover:bg-white/5",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-sm bg-white/10 border border-white/10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <Icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0 relative z-10",
                  isActive && "text-accent-cyan",
                )}
                strokeWidth={1.5}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-xs text-white font-medium shrink-0">
            {initials}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap flex-1 min-w-0"
              >
                <p className="text-xs font-medium text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-foreground-muted truncate">
                  {userEmail}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogoutConfirm(true)}
                className="text-foreground-muted hover:text-red-400 transition-colors cursor-pointer shrink-0"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

    </motion.aside>
    </>
  );
}
