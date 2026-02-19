"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const appUser = await signIn(email, password);
      if (appUser?.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err: unknown) {
      const raw =
        err instanceof Error ? err.message : "Authentication failed";
      const code = raw.match(/\(auth\/(.*?)\)/)?.[1] ?? "";
      const friendlyMessages: Record<string, string> = {
        "email-already-in-use": "An account with this email already exists.",
        "invalid-email": "Please enter a valid email address.",
        "weak-password": "Password must be at least 6 characters.",
        "user-not-found": "No account found with this email.",
        "wrong-password": "Incorrect password. Please try again.",
        "invalid-credential": "Invalid email or password.",
        "too-many-requests": "Too many attempts. Please try again later.",
        "network-request-failed": "Network error. Check your connection.",
        "invalid-api-key": "App configuration error. Contact admin.",
      };
      setError(
        friendlyMessages[code] ||
          raw
            .replace("Firebase: ", "")
            .replace(/\(auth\/.*\)\.?/, "")
            .trim() ||
          "Authentication failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-layer-0 px-4">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accent-indigo/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="Digiscribe Transcription Corp"
            width={260}
            height={80}
            className="object-contain mb-4"
            priority
          />
          <p className="text-xs text-foreground-muted mt-1">
            Recognize excellence. Celebrate achievement.
          </p>
        </div>

        <GlassCard variant="elevated" glow="gradient">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Welcome Back
          </h2>
          <p className="text-xs text-foreground-muted mb-6">
            Sign in to access the Employee of the Month portal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ?
                <Loader2 className="w-4 h-4 animate-spin" />
              : <LogIn className="w-4 h-4" strokeWidth={1.5} />}
              Sign In
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
