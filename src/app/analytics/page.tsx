"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { analyticsData, departments, stats } from "@/lib/data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  Award,
  Zap,
  ArrowUpRight,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

const COLORS = ["#22D3EE", "#818CF8", "#C084FC", "#10B981", "#F59E0B", "#F472B6", "#6366F1"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-layer-2 border border-white/10 rounded-[4px] px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-foreground-muted">
          <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value}
        </p>
      ))}
    </div>
  );
};

function DepartmentPieData() {
  const latest = analyticsData[analyticsData.length - 1];
  return Object.entries(latest.departments).map(([name, value]) => ({
    name,
    value,
  }));
}

export default function AnalyticsPage() {
  const pieData = DepartmentPieData();

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Insights into nomination patterns, participation, and recognition trends.
        </p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show">
        {/* Summary Stats */}
        <motion.div variants={item} className="grid grid-cols-4 gap-5 mb-6">
          {[
            { label: "Total Nominations", value: stats.totalNominations, icon: TrendingUp, color: "text-accent-cyan" },
            { label: "Participation Rate", value: `${stats.participationRate}%`, icon: Users, color: "text-accent-indigo" },
            { label: "Awards Given", value: stats.awardsGiven, icon: Award, color: "text-accent-purple" },
            { label: "Avg Votes/Nomination", value: stats.avgVotesPerNomination, icon: Zap, color: "text-amber-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={stat.label} variant="interactive" className="group">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-foreground-muted">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          {/* Nomination Trend */}
          <motion.div variants={item}>
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Nomination Volume</h2>
                  <p className="text-xs text-foreground-muted mt-0.5">Monthly nomination submissions</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUpRight className="w-3 h-3" />
                  +23% YoY
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="nomGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                        <stop offset="50%" stopColor="#818CF8" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#C084FC" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="nominations"
                      stroke="#22D3EE"
                      strokeWidth={2}
                      fill="url(#nomGrad)"
                      name="Nominations"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Participation Rate */}
          <motion.div variants={item}>
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Participation Rate</h2>
                  <p className="text-xs text-foreground-muted mt-0.5">Percentage of employees actively nominating</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUpRight className="w-3 h-3" />
                  +34% YoY
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="partGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C084FC" stopOpacity={0.3} />
                        <stop offset="50%" stopColor="#818CF8" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="participationRate"
                      stroke="#C084FC"
                      strokeWidth={2}
                      fill="url(#partGrad)"
                      name="Participation"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-5">
          {/* Department Breakdown Bar */}
          <motion.div variants={item} className="col-span-2">
            <GlassCard>
              <div className="mb-6">
                <h2 className="text-base font-semibold text-foreground">Department Breakdown</h2>
                <p className="text-xs text-foreground-muted mt-0.5">Nominations by department (current month)</p>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pieData} layout="vertical">
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      fill="url(#barGrad)"
                      radius={[0, 4, 4, 0]}
                      name="Nominations"
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Department Distribution Pie */}
          <motion.div variants={item}>
            <GlassCard>
              <div className="mb-6">
                <h2 className="text-base font-semibold text-foreground">Distribution</h2>
                <p className="text-xs text-foreground-muted mt-0.5">Share by department</p>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      strokeWidth={0}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.7} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {pieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-[10px] text-foreground-muted truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
