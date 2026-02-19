"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("rounded-sm skeleton-shimmer", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-sm bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/5">
      <Skeleton className="w-6 h-6 rounded-full" />
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/6" />
      </div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
  );
}
