"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardCheck,
  UserCheck,
  Send,
  ArrowUpRight,
  Clock,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getEmployees, getNominations, getStats } from "@/lib/firestore";
import { formatRelativeTime } from "@/lib/utils";

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
  icon: Icon,
  accentColor,
}: {
  label: string;
  value: string | number;
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

export default function AdminDashboardPage() {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: 60_000,
  });

  const { data: nominations = [] } = useQuery({
    queryKey: ["nominations"],
    queryFn: getNominations,
    staleTime: 60_000,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    staleTime: 60_000,
  });

  const pendingNominations = nominations.filter((n) => n.status === "pending");
  const activeEmployees = employees.filter((e) => e.active !== false);

  return (
    <div className="p-8 max-w-350 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Admin Dashboard</span>
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Manage employees, nominations, and platform settings.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-5"
      >
        <StatCard
          label="Total Employees"
          value={employees.length}
          icon={Users}
          accentColor="bg-linear-to-br from-cyan-500 to-blue-500"
        />
        <StatCard
          label="Active Employees"
          value={activeEmployees.length}
          icon={UserCheck}
          accentColor="bg-linear-to-br from-emerald-500 to-teal-500"
        />
        <StatCard
          label="Pending Nominations"
          value={pendingNominations.length}
          icon={ClipboardCheck}
          accentColor="bg-linear-to-br from-amber-500 to-orange-500"
        />
        <StatCard
          label="Total Nominations"
          value={stats?.totalNominations ?? nominations.length}
          icon={Send}
          accentColor="bg-linear-to-br from-indigo-500 to-purple-500"
        />

        {/* Pending Nominations Queue */}
        <motion.div variants={item} className="col-span-2">
          <GlassCard noPadding>
            <div className="p-6 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Pending Nominations
                </h2>
                <p className="text-xs text-foreground-muted mt-0.5">
                  {pendingNominations.length} awaiting review
                </p>
              </div>
              <Link href="/admin/nominations">
                <Button variant="ghost" size="sm">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {pendingNominations.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-foreground-muted">
                  No pending nominations
                </div>
              ) : (
                pendingNominations.slice(0, 5).map((nomination) => (
                  <div
                    key={nomination.id}
                    className="px-6 py-4 flex items-start gap-4 hover:bg-white/2 transition-colors"
                  >
                    <Avatar name={nomination.nomineeName} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {nomination.nomineeName}
                        </span>
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
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Employees */}
        <motion.div variants={item} className="col-span-2">
          <GlassCard noPadding>
            <div className="p-6 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Recent Employees
                </h2>
                <p className="text-xs text-foreground-muted mt-0.5">
                  {employees.length} total
                </p>
              </div>
              <Link href="/admin/employees">
                <Button variant="ghost" size="sm">
                  Manage <ArrowUpRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {employees.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-foreground-muted">
                  No employees yet
                </div>
              ) : (
                employees.slice(0, 5).map((emp) => (
                  <div
                    key={emp.id}
                    className="px-6 py-3 flex items-center gap-3 hover:bg-white/2 transition-colors"
                  >
                    <Avatar name={emp.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {emp.name}
                      </p>
                      <p className="text-[10px] text-foreground-muted">
                        {emp.role} · {emp.department}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-sm ${
                        emp.active !== false
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {emp.active !== false ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="col-span-4">
          <GlassCard>
            <h2 className="text-base font-semibold text-foreground mb-1">
              Quick Actions
            </h2>
            <p className="text-xs text-foreground-muted mb-4">
              Admin management tools
            </p>
            <div className="grid grid-cols-4 gap-3">
              <Link href="/admin/employees">
                <Button variant="primary" className="w-full">
                  <Users className="w-4 h-4" strokeWidth={1.5} />
                  Manage Employees
                </Button>
              </Link>
              <Link href="/admin/nominations">
                <Button variant="secondary" className="w-full">
                  <ClipboardCheck className="w-4 h-4" strokeWidth={1.5} />
                  Review Nominations
                </Button>
              </Link>
              <Link href="/admin/seed">
                <Button variant="secondary" className="w-full">
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                  Seed Data
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="secondary" className="w-full">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
