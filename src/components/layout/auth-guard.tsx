"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading, roleLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isFullyLoaded = !loading && !roleLoading;

  useEffect(() => {
    if (!isFullyLoaded) return;

    // Not authenticated -> redirect to login
    if (!user && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    // Authenticated on login page -> redirect based on role
    if (user && pathname === "/login") {
      if (appUser?.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
      return;
    }

    // Employee trying to access admin routes -> redirect to employee dashboard
    if (user && appUser?.role === "employee" && pathname.startsWith("/admin")) {
      router.replace("/");
      return;
    }
  }, [user, appUser, isFullyLoaded, pathname, router]);

  // Loading state
  if (!isFullyLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-layer-0">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-linear-to-br from-accent-cyan via-accent-indigo to-accent-purple flex items-center justify-center animate-pulse">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 13.125 10.875h-2.25A3.375 3.375 0 0 0 7.5 14.25v4.5"
              />
            </svg>
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  // Login page doesn't need sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Authenticated - show full layout
  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
      >
        {children}
      </main>
    </>
  );
}
