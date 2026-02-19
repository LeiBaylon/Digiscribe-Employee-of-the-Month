"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full h-10 px-3 rounded-[4px] bg-white/5 border border-white/10 text-foreground text-sm",
            "placeholder:text-foreground-muted/50 transition-all duration-200",
            "focus:outline-none focus:border-accent-indigo/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(129,140,248,0.1)]",
            error && "border-red-500/50 focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-2.5 rounded-[4px] bg-white/5 border border-white/10 text-foreground text-sm resize-none",
            "placeholder:text-foreground-muted/50 transition-all duration-200",
            "focus:outline-none focus:border-accent-indigo/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(129,140,248,0.1)]",
            error && "border-red-500/50 focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
