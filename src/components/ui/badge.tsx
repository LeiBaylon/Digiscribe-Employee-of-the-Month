"use client";

import { cn } from "@/lib/utils";
import {
  NominationCategory,
  NominationStatus,
  CATEGORY_LABELS,
  STATUS_LABELS,
} from "@/lib/types";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "gold";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-xs font-medium",
        variant === "default" &&
          "bg-white/5 text-foreground-muted border border-white/10",
        variant === "success" &&
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        variant === "warning" &&
          "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        variant === "danger" &&
          "bg-red-500/10 text-red-400 border border-red-500/20",
        variant === "gold" &&
          "gold-shimmer text-white border border-amber-400/30",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CategoryBadge({ category }: { category: NominationCategory }) {
  const colors: Record<NominationCategory, string> = {
    innovation: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    leadership: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    teamwork: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "customer-excellence":
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "above-and-beyond": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-xs font-medium border",
        colors[category],
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

export function StatusBadge({ status }: { status: NominationStatus }) {
  const variants: Record<NominationStatus, BadgeProps["variant"]> = {
    pending: "warning",
    approved: "success",
    awarded: "gold",
    declined: "danger",
  };

  return <Badge variant={variants[status]}>{STATUS_LABELS[status]}</Badge>;
}
