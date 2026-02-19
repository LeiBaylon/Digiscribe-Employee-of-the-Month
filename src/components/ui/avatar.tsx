"use client";

import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showRing?: boolean;
  ringColor?: "gradient" | "gold" | "none";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const colors = [
  "from-cyan-500 to-blue-500",
  "from-indigo-500 to-purple-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
  showRing = false,
  ringColor = "none",
}: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getColorFromName(name);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full font-medium bg-linear-to-br shrink-0",
        colorClass,
        sizeClasses[size],
        showRing &&
          ringColor === "gradient" &&
          "ring-2 ring-offset-2 ring-offset-layer-0 ring-accent-indigo",
        showRing &&
          ringColor === "gold" &&
          "ring-2 ring-offset-2 ring-offset-layer-0 ring-amber-400",
        className,
      )}
    >
      {src ?
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      : <span className="text-white">{initials}</span>}
    </div>
  );
}
