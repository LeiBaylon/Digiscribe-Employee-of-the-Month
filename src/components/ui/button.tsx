"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-200 focus-ring cursor-pointer whitespace-nowrap",
          variant === "primary" &&
            "bg-linear-to-r from-accent-cyan via-accent-indigo to-accent-purple text-white shadow-lg hover:shadow-xl hover:brightness-110 active:brightness-95",
          variant === "secondary" &&
            "bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20",
          variant === "ghost" &&
            "text-foreground-muted hover:text-foreground hover:bg-white/5",
          variant === "danger" &&
            "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          "disabled:opacity-50 disabled:pointer-events-none",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
