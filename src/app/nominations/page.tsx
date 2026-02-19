"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { CategoryBadge, StatusBadge } from "@/components/ui/badge";
import { employees, nominations } from "@/lib/data";
import { NominationCategory, CATEGORY_LABELS } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  Send,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  User,
  MessageSquare,
  Zap,
  ThumbsUp,
  Clock,
  Search,
} from "lucide-react";
import confetti from "canvas-confetti";

const steps = [
  { id: 1, label: "Select Nominee", icon: User },
  { id: 2, label: "Category", icon: Zap },
  { id: 3, label: "Details", icon: MessageSquare },
  { id: 4, label: "Confirm", icon: Check },
];

const categories: {
  value: NominationCategory;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "innovation",
    label: "Innovation",
    description: "Pioneering new ideas, technologies, or processes",
    color:
      "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-400/50",
  },
  {
    value: "leadership",
    label: "Leadership",
    description: "Inspiring and guiding teams to achieve exceptional results",
    color:
      "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 hover:border-indigo-400/50",
  },
  {
    value: "teamwork",
    label: "Teamwork",
    description: "Outstanding collaboration and support for colleagues",
    color:
      "from-purple-500/20 to-purple-500/5 border-purple-500/30 hover:border-purple-400/50",
  },
  {
    value: "customer-excellence",
    label: "Customer Excellence",
    description: "Going above and beyond for customer satisfaction",
    color:
      "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-400/50",
  },
  {
    value: "above-and-beyond",
    label: "Above & Beyond",
    description: "Exceeding expectations in extraordinary ways",
    color:
      "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-400/50",
  },
];

export default function NominationsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<NominationCategory | null>(null);
  const [reason, setReason] = useState("");
  const [impact, setImpact] = useState("");

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedEmployee = employees.find((e) => e.id === selectedNominee);

  const handleSubmit = () => {
    setSubmitted(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#22D3EE", "#818CF8", "#C084FC", "#F59E0B"],
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedNominee(null);
    setSelectedCategory(null);
    setReason("");
    setImpact("");
    setSubmitted(false);
    setShowForm(false);
  };

  return (
    <div className="p-8 max-w-350 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">Nominations</span>
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Recognize your colleagues for their outstanding contributions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className={showForm ? "opacity-50 pointer-events-none" : ""}
        >
          <Send className="w-4 h-4" strokeWidth={1.5} />
          New Nomination
        </Button>
      </motion.div>

      {/* Nomination Form Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-layer-0/80 backdrop-blur-sm"
              onClick={resetForm}
            />

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
              className="relative z-10 w-full max-w-2xl mx-4"
            >
              {submitted ?
                <GlassCard
                  variant="elevated"
                  glow="gradient"
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-accent-cyan via-accent-indigo to-accent-purple flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Nomination Submitted!
                  </h2>
                  <p className="text-sm text-foreground-muted mb-6">
                    Your nomination for {selectedEmployee?.name} has been
                    submitted for review.
                  </p>
                  <Button variant="secondary" onClick={resetForm}>
                    Close
                  </Button>
                </GlassCard>
              : <GlassCard variant="elevated" noPadding>
                  {/* Step indicator */}
                  <div className="px-6 pt-6 pb-4 border-b border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground">
                        New Nomination
                      </h2>
                      <button
                        onClick={resetForm}
                        className="text-foreground-muted hover:text-foreground text-xl cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {steps.map((step, i) => {
                        const Icon = step.icon;
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        return (
                          <div
                            key={step.id}
                            className="flex items-center gap-2 flex-1"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                                isCompleted ? "bg-accent-indigo text-white"
                                : isActive ?
                                  "bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/50"
                                : "bg-white/5 text-foreground-muted"
                              }`}
                            >
                              {isCompleted ?
                                <Check className="w-3.5 h-3.5" />
                              : <Icon
                                  className="w-3.5 h-3.5"
                                  strokeWidth={1.5}
                                />
                              }
                            </div>
                            {i < steps.length - 1 && (
                              <div
                                className={`flex-1 h-px ${isCompleted ? "bg-accent-indigo" : "bg-white/10"}`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="p-6 min-h-80">
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-base font-semibold text-foreground mb-1">
                            Select Nominee
                          </h3>
                          <p className="text-xs text-foreground-muted mb-4">
                            Choose the colleague you want to recognize.
                          </p>
                          <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                            <input
                              type="text"
                              placeholder="Search by name or department..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full h-10 pl-10 pr-3 rounded-sm bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground-muted/50 focus:outline-none focus:border-accent-indigo/50"
                            />
                          </div>
                          <div className="space-y-1 max-h-60 overflow-y-auto">
                            {filteredEmployees.map((employee) => (
                              <button
                                key={employee.id}
                                onClick={() => setSelectedNominee(employee.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-200 cursor-pointer ${
                                  selectedNominee === employee.id ?
                                    "bg-accent-indigo/10 border border-accent-indigo/30"
                                  : "hover:bg-white/5 border border-transparent"
                                }`}
                              >
                                <Avatar name={employee.name} size="sm" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">
                                    {employee.name}
                                  </p>
                                  <p className="text-[10px] text-foreground-muted">
                                    {employee.role} · {employee.department}
                                  </p>
                                </div>
                                {selectedNominee === employee.id && (
                                  <Check className="w-4 h-4 text-accent-indigo" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-base font-semibold text-foreground mb-1">
                            Select Category
                          </h3>
                          <p className="text-xs text-foreground-muted mb-4">
                            What type of achievement are you recognizing?
                          </p>
                          <div className="space-y-2">
                            {categories.map((cat) => (
                              <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm text-left transition-all duration-200 border cursor-pointer bg-linear-to-r ${cat.color} ${
                                  selectedCategory === cat.value ?
                                    "ring-1 ring-white/20"
                                  : ""
                                }`}
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground">
                                    {cat.label}
                                  </p>
                                  <p className="text-[10px] text-foreground-muted">
                                    {cat.description}
                                  </p>
                                </div>
                                {selectedCategory === cat.value && (
                                  <Check className="w-4 h-4 text-accent-indigo" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          <h3 className="text-base font-semibold text-foreground mb-1">
                            Nomination Details
                          </h3>
                          <p className="text-xs text-foreground-muted mb-4">
                            Tell us why this person deserves recognition.
                          </p>
                          <Textarea
                            id="reason"
                            label="Reason for Nomination"
                            placeholder="Describe the specific actions or behaviors that deserve recognition..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                          />
                          <Textarea
                            id="impact"
                            label="Business Impact"
                            placeholder="How did their actions impact the team, customers, or company?"
                            value={impact}
                            onChange={(e) => setImpact(e.target.value)}
                            rows={3}
                          />
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-base font-semibold text-foreground mb-1">
                            Review & Submit
                          </h3>
                          <p className="text-xs text-foreground-muted mb-4">
                            Please review your nomination before submitting.
                          </p>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 rounded-sm bg-white/5 border border-white/10">
                              <Avatar
                                name={selectedEmployee?.name || ""}
                                size="lg"
                                showRing
                                ringColor="gradient"
                              />
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {selectedEmployee?.name}
                                </p>
                                <p className="text-xs text-foreground-muted">
                                  {selectedEmployee?.role} ·{" "}
                                  {selectedEmployee?.department}
                                </p>
                              </div>
                            </div>
                            {selectedCategory && (
                              <div>
                                <p className="text-xs text-foreground-muted mb-1">
                                  Category
                                </p>
                                <CategoryBadge category={selectedCategory} />
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-foreground-muted mb-1">
                                Reason
                              </p>
                              <p className="text-sm text-foreground">
                                {reason || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-foreground-muted mb-1">
                                Business Impact
                              </p>
                              <p className="text-sm text-foreground">
                                {impact || "Not provided"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Navigation */}
                  <div className="px-6 pb-6 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep((s) => s - 1)}
                      disabled={currentStep === 1}
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </Button>
                    {currentStep < 4 ?
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setCurrentStep((s) => s + 1)}
                        disabled={
                          (currentStep === 1 && !selectedNominee) ||
                          (currentStep === 2 && !selectedCategory) ||
                          (currentStep === 3 && !reason)
                        }
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </Button>
                    : <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSubmit}
                      >
                        <Sparkles className="w-4 h-4" /> Submit Nomination
                      </Button>
                    }
                  </div>
                </GlassCard>
              }
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Nominations List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-base font-semibold text-foreground mb-4">
          Recent Nominations
        </h2>
        {nominations.map((nomination, i) => (
          <motion.div
            key={nomination.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <GlassCard variant="interactive">
              <div className="flex items-start gap-4">
                <Avatar name={nomination.nomineeName} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">
                      {nomination.nomineeName}
                    </span>
                    <CategoryBadge category={nomination.category} />
                    <StatusBadge status={nomination.status} />
                  </div>
                  <p className="text-xs text-foreground-muted mb-2">
                    {nomination.nomineeRole} · {nomination.nomineeDepartment}
                  </p>
                  <p className="text-sm text-foreground/90 mb-2">
                    {nomination.reason}
                  </p>
                  <p className="text-xs text-foreground-muted italic">
                    {nomination.impact}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-foreground-muted">
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
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
