"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { CategoryBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  nominations,
  leaderboard,
  stats,
  monthlyWinners,
  analyticsData,
} from "@/lib/data";
import { formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Award,
  Send,
  Target,
  ArrowUpRight,
  ThumbsUp,
  Clock,
  Crown,
  Sparkles,
  Trophy,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  accentColor,
}: {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accentColor: string;
}) {
  return (
    <motion.div variants={item}>
      <GlassCard variant="interactive" className="group">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
              {label}
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {change && (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {change}
              </p>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-sm flex items-center justify-center ${accentColor} transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function NominationQueue() {
  const pending = nominations.filter((n) => n.status === "pending");
  return (
    <motion.div variants={item} className="col-span-2">
      <GlassCard noPadding>
        <div className="p-6 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Nomination Queue
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              {pending.length} pending review
            </p>
          </div>
          <Link href="/nominations">
            <Button variant="ghost" size="sm">
              View all <ArrowUpRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {nominations.slice(0, 5).map((nomination, i) => (
            <motion.div
              key={nomination.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-6 py-4 flex items-start gap-4 hover:bg-white/2 transition-colors"
            >
              <Avatar name={nomination.nomineeName} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {nomination.nomineeName}
                  </span>
                  <CategoryBadge category={nomination.category} />
                </div>
                <p className="text-xs text-foreground-muted line-clamp-1">
                  {nomination.reason}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> {nomination.votes} votes
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{" "}
                    {formatRelativeTime(nomination.createdAt)}
                  </span>
                  <span>by {nomination.nominatorName}</span>
                </div>
              </div>
              <StatusBadge status={nomination.status} />
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function MiniLeaderboard() {
  const trendIcon = {
    up: <TrendingUp className="w-3 h-3 text-emerald-400" />,
    down: <TrendingDown className="w-3 h-3 text-red-400" />,
    stable: <Minus className="w-3 h-3 text-foreground-muted" />,
  };

  return (
    <motion.div variants={item}>
      <GlassCard noPadding>
        <div className="p-6 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Top Performers
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">This quarter</p>
          </div>
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm">
              Full rankings <ArrowUpRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {leaderboard.slice(0, 5).map((entry, i) => (
            <div
              key={entry.employee.id}
              className="px-6 py-3 flex items-center gap-3 hover:bg-white/2 transition-colors"
            >
              <span
                className={`w-6 text-center text-xs font-bold ${
                  i === 0 ? "text-amber-400"
                  : i === 1 ? "text-slate-300"
                  : i === 2 ? "text-amber-600"
                  : "text-foreground-muted"
                }`}
              >
                {entry.rank}
              </span>
              <Avatar
                name={entry.employee.name}
                size="sm"
                showRing={i === 0}
                ringColor={i === 0 ? "gold" : "none"}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {entry.employee.name}
                </p>
                <p className="text-[10px] text-foreground-muted">
                  {entry.nominations} nominations · {entry.wins} wins
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {trendIcon[entry.trend]}
                <span className="text-xs font-medium text-foreground-muted">
                  {entry.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function CurrentWinner() {
  const winner = monthlyWinners[0];
  return (
    <motion.div variants={item}>
      <GlassCard className="relative overflow-hidden" glow="gradient">
        <div className="absolute inset-0 bg-linear-to-br from-accent-cyan/5 via-accent-indigo/5 to-accent-purple/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              Employee of the Month
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Avatar
              name={winner.employee.name}
              size="xl"
              showRing
              ringColor="gold"
            />
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {winner.employee.name}
              </h3>
              <p className="text-sm text-foreground-muted">
                {winner.employee.role}
              </p>
              <p className="text-xs text-foreground-muted">
                {winner.employee.department}
              </p>
            </div>
          </div>
          <CategoryBadge category={winner.category} />
          {winner.quote && (
            <p className="text-xs text-foreground-muted italic mt-3 leading-relaxed">
              &ldquo;{winner.quote}&rdquo;
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 text-xs text-foreground-muted">
            <Sparkles className="w-3 h-3 text-accent-cyan" />
            {winner.totalVotes} votes · {winner.month} {winner.year}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function MiniChart() {
  return (
    <motion.div variants={item}>
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Nomination Trend
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              Last 12 months
            </p>
          </div>
          <Link href="/analytics">
            <Button variant="ghost" size="sm">
              Details <ArrowUpRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="h-35 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10 }}
                dy={5}
              />
              <Tooltip
                contentStyle={{
                  background: "#1E293B",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#E2E8F0",
                }}
                itemStyle={{ color: "#818CF8" }}
              />
              <Area
                type="monotone"
                dataKey="nominations"
                stroke="#818CF8"
                strokeWidth={2}
                fill="url(#miniGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-350 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Overview of nominations, recognition, and team performance.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-5"
      >
        <StatCard
          label="Total Nominations"
          value={stats.totalNominations}
          change="+12% from last month"
          icon={Send}
          accentColor="bg-linear-to-br from-cyan-500 to-blue-500"
        />
        <StatCard
          label="Active Employees"
          value={stats.activeEmployees}
          change="+3 new this month"
          icon={Users}
          accentColor="bg-linear-to-br from-indigo-500 to-purple-500"
        />
        <StatCard
          label="Participation Rate"
          value={`${stats.participationRate}%`}
          change="+4% from last month"
          icon={Target}
          accentColor="bg-linear-to-br from-purple-500 to-pink-500"
        />
        <StatCard
          label="Awards Given"
          value={stats.awardsGiven}
          change="+2 this month"
          icon={Award}
          accentColor="bg-linear-to-br from-amber-500 to-orange-500"
        />

        <NominationQueue />
        <div className="col-span-2 grid grid-rows-2 gap-5">
          <CurrentWinner />
          <MiniChart />
        </div>

        <div className="col-span-2">
          <MiniLeaderboard />
        </div>

        <motion.div variants={item} className="col-span-2">
          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground mb-1">
                Quick Actions
              </h2>
              <p className="text-xs text-foreground-muted mb-4">
                Streamline your recognition workflow
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/nominations">
                <Button variant="primary" className="w-full">
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                  Nominate Someone
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="secondary" className="w-full">
                  <Trophy className="w-4 h-4" strokeWidth={1.5} />
                  View Rankings
                </Button>
              </Link>
              <Link href="/hall-of-fame">
                <Button variant="secondary" className="w-full">
                  <Award className="w-4 h-4" strokeWidth={1.5} />
                  Hall of Fame
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="secondary" className="w-full">
                  <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
                  View Analytics
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
