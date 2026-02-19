"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { leaderboard } from "@/lib/data";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Medal,
  Trophy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const podiumVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

function PodiumCard({ entry, position }: { entry: (typeof leaderboard)[0]; position: 1 | 2 | 3 }) {
  const heights = { 1: "h-48", 2: "h-40", 3: "h-36" };
  const sizes = { 1: "xl" as const, 2: "lg" as const, 3: "lg" as const };
  const icons = {
    1: <Crown className="w-6 h-6 text-amber-400" />,
    2: <Medal className="w-5 h-5 text-slate-300" />,
    3: <Medal className="w-5 h-5 text-amber-600" />,
  };
  const glows = {
    1: "gradient" as const,
    2: "indigo" as const,
    3: "purple" as const,
  };
  const orderClass = { 1: "order-2", 2: "order-1", 3: "order-3" };

  return (
    <motion.div
      custom={position === 1 ? 0 : position === 2 ? 1 : 2}
      variants={podiumVariants}
      initial="hidden"
      animate="show"
      className={`flex-1 ${orderClass[position]}`}
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: position === 1 ? 0.3 : position === 2 ? 0.45 : 0.6, type: "spring", bounce: 0.4 }}
          className="mb-3"
        >
          {icons[position]}
        </motion.div>
        <Avatar
          name={entry.employee.name}
          size={sizes[position]}
          showRing
          ringColor={position === 1 ? "gold" : "gradient"}
        />
        <h3 className={`mt-3 font-bold text-foreground ${position === 1 ? "text-lg" : "text-sm"}`}>
          {entry.employee.name}
        </h3>
        <p className="text-xs text-foreground-muted">{entry.employee.role}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={position === 1 ? "gold" : "default"}>Score {entry.score}</Badge>
        </div>
        <GlassCard
          glow={glows[position]}
          className={`w-full mt-4 ${heights[position]} flex flex-col items-center justify-center`}
        >
          <span className={`text-4xl font-bold ${position === 1 ? "gradient-text" : "text-foreground"}`}>
            #{position}
          </span>
          <div className="mt-2 text-center">
            <p className="text-xs text-foreground-muted">{entry.wins} wins</p>
            <p className="text-xs text-foreground-muted">{entry.nominations} nominations</p>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const trendIcon = {
    up: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
    down: <TrendingDown className="w-3.5 h-3.5 text-red-400" />,
    stable: <Minus className="w-3.5 h-3.5 text-foreground-muted" />,
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Leaderboard</span>
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Top performers ranked by nomination score and wins.
        </p>
      </motion.div>

      {/* Podium */}
      <div className="flex items-end gap-6 mb-10 max-w-3xl mx-auto px-8">
        <PodiumCard entry={top3[1]} position={2} />
        <PodiumCard entry={top3[0]} position={1} />
        <PodiumCard entry={top3[2]} position={3} />
      </div>

      {/* Full Rankings Table */}
      <GlassCard noPadding>
        <div className="p-6 pb-3">
          <h2 className="text-base font-semibold text-foreground">Full Rankings</h2>
          <p className="text-xs text-foreground-muted mt-0.5">All-time performance scores</p>
        </div>

        {/* Header */}
        <div className="px-6 py-3 grid grid-cols-12 gap-4 text-xs font-medium text-foreground-muted uppercase tracking-wider border-b border-white/5">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Employee</div>
          <div className="col-span-2 text-center">Nominations</div>
          <div className="col-span-1 text-center">Wins</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center">Trend</div>
        </div>

        {/* Rows */}
        {leaderboard.map((entry, i) => (
          <motion.div
            key={entry.employee.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-white/[0.02] transition-colors ${
              i < leaderboard.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <div className="col-span-1">
              <span
                className={`text-sm font-bold ${
                  i === 0
                    ? "text-amber-400"
                    : i === 1
                    ? "text-slate-300"
                    : i === 2
                    ? "text-amber-600"
                    : "text-foreground-muted"
                }`}
              >
                {entry.rank}
              </span>
            </div>
            <div className="col-span-4 flex items-center gap-3">
              <Avatar
                name={entry.employee.name}
                size="sm"
                showRing={i === 0}
                ringColor={i === 0 ? "gold" : "none"}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{entry.employee.name}</p>
                <p className="text-[10px] text-foreground-muted">{entry.employee.role} · {entry.employee.department}</p>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-sm text-foreground">{entry.nominations}</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-sm text-foreground">{entry.wins}</span>
            </div>
            <div className="col-span-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${entry.score}%` }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo"
                  />
                </div>
                <span className="text-xs font-medium text-foreground">{entry.score}</span>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-1.5">
              {trendIcon[entry.trend]}
              <span
                className={`text-xs ${
                  entry.trend === "up"
                    ? "text-emerald-400"
                    : entry.trend === "down"
                    ? "text-red-400"
                    : "text-foreground-muted"
                }`}
              >
                {entry.trend === "up" && (
                  <span className="flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3" />
                    {entry.previousRank - entry.rank}
                  </span>
                )}
                {entry.trend === "down" && (
                  <span className="flex items-center gap-0.5">
                    <ArrowDown className="w-3 h-3" />
                    {entry.rank - entry.previousRank}
                  </span>
                )}
                {entry.trend === "stable" && "---"}
              </span>
            </div>
          </motion.div>
        ))}
      </GlassCard>
    </div>
  );
}
