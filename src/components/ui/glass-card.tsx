"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive";
  glow?: "none" | "cyan" | "indigo" | "purple" | "gradient";
  noPadding?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = "none", noPadding = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[4px] border border-white/10 noise-overlay overflow-hidden",
          variant === "default" && "bg-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
          variant === "elevated" && "bg-slate-800/50 backdrop-blur-xl shadow-[0_16px_48px_0_rgba(0,0,0,0.4)]",
          variant === "interactive" && "bg-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-slate-800/50 hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.4)] hover:border-white/20",
          glow === "cyan" && "glow-cyan",
          glow === "indigo" && "glow-indigo",
          glow === "purple" && "glow-purple",
          glow === "gradient" && "glow-gradient",
          !noPadding && "p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
