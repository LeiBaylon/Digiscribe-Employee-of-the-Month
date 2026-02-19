"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { CategoryBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  ThumbsUp,
  Clock,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNominations, updateNominationStatus } from "@/lib/firestore";
import { formatRelativeTime } from "@/lib/utils";
import type { NominationStatus } from "@/lib/types";

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function AdminNominationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterTab>("pending");
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    id: string;
    name: string;
  } | null>(null);

  const { data: nominations = [], isLoading } = useQuery({
    queryKey: ["nominations"],
    queryFn: getNominations,
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: NominationStatus;
    }) => updateNominationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nominations"] });
      setConfirmAction(null);
    },
  });

  const filtered = filter === "all"
    ? nominations
    : nominations.filter((n) => n.status === filter);

  const counts = {
    all: nominations.length,
    pending: nominations.filter((n) => n.status === "pending").length,
    approved: nominations.filter((n) => n.status === "approved").length,
    rejected: nominations.filter((n) => n.status === "rejected").length,
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "pending", label: `Pending (${counts.pending})` },
    { key: "approved", label: `Approved (${counts.approved})` },
    { key: "rejected", label: `Rejected (${counts.rejected})` },
  ];

  return (
    <div className="p-8 max-w-350 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Nomination Approval</span>
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Review and approve or reject employee nominations.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white/5 rounded-sm p-1 border border-white/10 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
              filter === tab.key
                ? "bg-white/10 text-foreground"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nominations List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-foreground-muted" />
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard>
          <div className="text-center py-8 text-sm text-foreground-muted">
            No {filter === "all" ? "" : filter} nominations found.
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filtered.map((nomination, i) => (
            <motion.div
              key={nomination.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-start gap-4">
                  <Avatar name={nomination.nomineeName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {nomination.nomineeName}
                      </span>
                      <CategoryBadge category={nomination.category} />
                      <StatusBadge status={nomination.status} />
                    </div>
                    <p className="text-xs text-foreground-muted mb-1">
                      {nomination.nomineeRole} · {nomination.nomineeDepartment}
                    </p>
                    <p className="text-sm text-foreground/80 mb-2">
                      {nomination.reason}
                    </p>
                    {nomination.impact && (
                      <p className="text-xs text-foreground-muted italic mb-2">
                        Impact: {nomination.impact}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-[10px] text-foreground-muted">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {nomination.votes} votes
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {formatRelativeTime(nomination.createdAt)}
                      </span>
                      <span>Nominated by {nomination.nominatorName}</span>
                    </div>
                  </div>

                  {/* Action buttons only for pending */}
                  {nomination.status === "pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setConfirmAction({
                            type: "approve",
                            id: nomination.id,
                            name: nomination.nomineeName,
                          })
                        }
                        className="text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Check className="w-4 h-4" strokeWidth={1.5} />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setConfirmAction({
                            type: "reject",
                            id: nomination.id,
                            name: nomination.nomineeName,
                          })
                        }
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmAction(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-sm"
            >
              <div className="bg-layer-1 border border-white/10 rounded-sm p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      confirmAction.type === "approve"
                        ? "bg-emerald-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    {confirmAction.type === "approve" ? (
                      <Check
                        className="w-5 h-5 text-emerald-400"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <X className="w-5 h-5 text-red-400" strokeWidth={1.5} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {confirmAction.type === "approve"
                        ? "Approve Nomination"
                        : "Reject Nomination"}
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      {confirmAction.type === "approve"
                        ? `Approve ${confirmAction.name}'s nomination?`
                        : `Reject ${confirmAction.name}'s nomination?`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 h-9 rounded-sm text-sm font-medium bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      mutation.mutate({
                        id: confirmAction.id,
                        status:
                          confirmAction.type === "approve"
                            ? "approved"
                            : "rejected",
                      });
                    }}
                    disabled={mutation.isPending}
                    className={`flex-1 h-9 rounded-sm text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                      confirmAction.type === "approve"
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                        : "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                    }`}
                  >
                    {mutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : confirmAction.type === "approve" ? (
                      "Approve"
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
