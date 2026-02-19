"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Edit3,
  UserX,
  Trash2,
  X,
  Loader2,
  Check,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployees,
  updateEmployee,
  deactivateEmployee,
  deleteEmployee,
} from "@/lib/firestore";
import { useAuth } from "@/providers/auth-provider";

type FilterTab = "all" | "active" | "inactive";

export default function AdminEmployeesPage() {
  const queryClient = useQueryClient();
  const { createEmployeeAccount } = useAuth();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "deactivate" | "delete";
    id: string;
    name: string;
  } | null>(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    displayName: "",
    email: "",
    password: "",
    department: "",
    jobTitle: "",
  });
  const [createError, setCreateError] = useState("");

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
  });

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: createEmployeeAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setShowCreateModal(false);
      setCreateForm({
        displayName: "",
        email: "",
        password: "",
        department: "",
        jobTitle: "",
      });
      setCreateError("");
    },
    onError: (error: Error) => {
      setCreateError(error.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, string> }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditingEmployee(null);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setConfirmAction(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setConfirmAction(null);
    },
  });

  const filtered = employees.filter((emp) => {
    if (filter === "active" && emp.active === false) return false;
    if (filter === "inactive" && emp.active !== false) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        (emp.email?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: `All (${employees.length})` },
    {
      key: "active",
      label: `Active (${employees.filter((e) => e.active !== false).length})`,
    },
    {
      key: "inactive",
      label: `Inactive (${employees.filter((e) => e.active === false).length})`,
    },
  ];

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
            <span className="gradient-text">Employee Management</span>
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Create, edit, and manage employee accounts.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Create Employee
        </Button>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-sm bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground-muted/50 focus:outline-none focus:border-accent-indigo/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded-sm p-1 border border-white/10">
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
      </div>

      {/* Employee Table */}
      <GlassCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-6 py-3">
                  Employee
                </th>
                <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-6 py-3">
                  Email
                </th>
                <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-6 py-3">
                  Department
                </th>
                <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-6 py-3">
                  Job Title
                </th>
                <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-foreground-muted uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-foreground-muted" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-foreground-muted"
                  >
                    {search ? "No employees match your search." : "No employees yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.name} size="sm" />
                        {editingEmployee === emp.id ? (
                          <input
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="h-7 px-2 rounded-sm bg-white/5 border border-white/10 text-foreground text-sm w-40"
                          />
                        ) : (
                          <span className="text-sm font-medium text-foreground">
                            {emp.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">
                      {emp.email || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {editingEmployee === emp.id ? (
                        <input
                          value={editForm.department}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              department: e.target.value,
                            })
                          }
                          className="h-7 px-2 rounded-sm bg-white/5 border border-white/10 text-foreground text-sm w-32"
                        />
                      ) : (
                        <span className="text-sm text-foreground-muted">
                          {emp.department}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingEmployee === emp.id ? (
                        <input
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm({ ...editForm, role: e.target.value })
                          }
                          className="h-7 px-2 rounded-sm bg-white/5 border border-white/10 text-foreground text-sm w-32"
                        />
                      ) : (
                        <span className="text-sm text-foreground-muted">
                          {emp.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-sm ${
                          emp.active !== false
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {emp.active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingEmployee === emp.id ? (
                          <>
                            <button
                              onClick={() => {
                                editMutation.mutate({
                                  id: emp.id,
                                  data: editForm,
                                });
                              }}
                              className="p-1.5 rounded-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingEmployee(null)}
                              className="p-1.5 rounded-sm text-foreground-muted hover:bg-white/5 transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingEmployee(emp.id);
                                setEditForm({
                                  name: emp.name,
                                  role: emp.role,
                                  department: emp.department,
                                  email: emp.email || "",
                                });
                              }}
                              className="p-1.5 rounded-sm text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {emp.active !== false && (
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    type: "deactivate",
                                    id: emp.id,
                                    name: emp.name,
                                  })
                                }
                                className="p-1.5 rounded-sm text-foreground-muted hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                                title="Deactivate"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  type: "delete",
                                  id: emp.id,
                                  name: emp.name,
                                })
                              }
                              className="p-1.5 rounded-sm text-foreground-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Create Employee Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md"
            >
              <div className="bg-layer-1 border border-white/10 rounded-sm p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Create Employee
                    </h3>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      Create a new employee account
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1 rounded-sm text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate(createForm);
                  }}
                  className="space-y-4"
                >
                  <Input
                    id="create-name"
                    label="Full Name"
                    type="text"
                    placeholder="Jane Doe"
                    value={createForm.displayName}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, displayName: e.target.value })
                    }
                    required
                  />
                  <Input
                    id="create-email"
                    label="Email"
                    type="email"
                    placeholder="jane@company.com"
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    id="create-password"
                    label="Password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, password: e.target.value })
                    }
                    required
                  />
                  <Input
                    id="create-department"
                    label="Department"
                    type="text"
                    placeholder="Engineering"
                    value={createForm.department}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, department: e.target.value })
                    }
                    required
                  />
                  <Input
                    id="create-jobtitle"
                    label="Job Title"
                    type="text"
                    placeholder="Software Engineer"
                    value={createForm.jobTitle}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, jobTitle: e.target.value })
                    }
                    required
                  />

                  {createError && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2">
                      {createError}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" strokeWidth={1.5} />
                      )}
                      Create
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                      confirmAction.type === "delete"
                        ? "bg-red-500/10"
                        : "bg-amber-500/10"
                    }`}
                  >
                    {confirmAction.type === "delete" ? (
                      <Trash2 className="w-5 h-5 text-red-400" strokeWidth={1.5} />
                    ) : (
                      <UserX className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {confirmAction.type === "delete"
                        ? "Delete Employee"
                        : "Deactivate Employee"}
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      {confirmAction.type === "delete"
                        ? `Permanently delete ${confirmAction.name}?`
                        : `Deactivate ${confirmAction.name}'s account?`}
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
                      if (confirmAction.type === "delete") {
                        deleteMutation.mutate(confirmAction.id);
                      } else {
                        deactivateMutation.mutate(confirmAction.id);
                      }
                    }}
                    className={`flex-1 h-9 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                      confirmAction.type === "delete"
                        ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                        : "bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                    }`}
                  >
                    {confirmAction.type === "delete" ? "Delete" : "Deactivate"}
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
