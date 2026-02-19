"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { seedFirestore, createUserDoc } from "@/lib/firestore";
import { useAuth } from "@/providers/auth-provider";
import {
  Database,
  Check,
  Loader2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

export default function SeedPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const [adminStatus, setAdminStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [adminError, setAdminError] = useState("");

  const handleSeed = async () => {
    setStatus("loading");
    setError("");
    try {
      await seedFirestore();
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed");
      setStatus("error");
    }
  };

  const handleCreateAdminDoc = async () => {
    if (!user) return;
    setAdminStatus("loading");
    setAdminError("");
    try {
      await createUserDoc({
        uid: user.uid,
        name: user.displayName || "Admin",
        email: user.email || "admin@digiscribe.com",
        role: "admin",
        createdAt: new Date(),
      });
      setAdminStatus("success");
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Failed to create admin doc",
      );
      setAdminStatus("error");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Seed Database</span>
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Populate Firestore with sample data and configure admin access.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Create Admin User Doc */}
        <GlassCard glow={adminStatus === "success" ? "gradient" : "none"}>
          <div className="flex flex-col items-center text-center py-6">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                adminStatus === "success"
                  ? "bg-emerald-500/10"
                  : adminStatus === "error"
                    ? "bg-red-500/10"
                    : "bg-amber-500/10"
              }`}
            >
              {adminStatus === "loading" ? (
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              ) : adminStatus === "success" ? (
                <Check className="w-6 h-6 text-emerald-400" />
              ) : adminStatus === "error" ? (
                <AlertTriangle className="w-6 h-6 text-red-400" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              )}
            </div>

            <h2 className="text-base font-semibold text-foreground mb-1">
              {adminStatus === "success"
                ? "Admin Doc Created"
                : adminStatus === "error"
                  ? "Failed"
                  : "Create Admin User Doc"}
            </h2>
            <p className="text-xs text-foreground-muted mb-6 max-w-sm">
              {adminStatus === "success"
                ? "Your account has been registered as admin in Firestore. Refresh the page to apply."
                : adminStatus === "error"
                  ? adminError
                  : `Creates a Firestore user document for your current account (${user?.email || "..."}) with the "admin" role. Run this once during initial setup.`}
            </p>

            <Button
              variant={adminStatus === "success" ? "secondary" : "primary"}
              onClick={handleCreateAdminDoc}
              disabled={adminStatus === "loading" || !user}
            >
              {adminStatus === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              )}
              {adminStatus === "success" ? "Create Again" : "Create Admin Doc"}
            </Button>
          </div>
        </GlassCard>

        {/* Seed Database */}
        <GlassCard glow={status === "success" ? "gradient" : "none"}>
          <div className="flex flex-col items-center text-center py-6">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                status === "success"
                  ? "bg-emerald-500/10"
                  : status === "error"
                    ? "bg-red-500/10"
                    : "bg-accent-indigo/10"
              }`}
            >
              {status === "loading" ? (
                <Loader2 className="w-6 h-6 text-accent-indigo animate-spin" />
              ) : status === "success" ? (
                <Check className="w-6 h-6 text-emerald-400" />
              ) : status === "error" ? (
                <AlertTriangle className="w-6 h-6 text-red-400" />
              ) : (
                <Database className="w-6 h-6 text-accent-indigo" />
              )}
            </div>

            <h2 className="text-base font-semibold text-foreground mb-1">
              {status === "success"
                ? "Database Seeded"
                : status === "error"
                  ? "Seed Failed"
                  : "Seed Firestore"}
            </h2>
            <p className="text-xs text-foreground-muted mb-6 max-w-sm">
              {status === "success"
                ? "All sample data (employees, nominations, leaderboard, analytics) has been written to Firestore."
                : status === "error"
                  ? error
                  : "This will write sample employees, nominations, leaderboard entries, monthly winners, and analytics data to your Firestore database."}
            </p>

            <Button
              variant={status === "success" ? "secondary" : "primary"}
              onClick={handleSeed}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" strokeWidth={1.5} />
              )}
              {status === "success" ? "Seed Again" : "Seed Database"}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
