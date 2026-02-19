export type UserRole = "admin" | "employee";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  joinedDate: Date;
  active: boolean;
  email?: string;
}

export interface Nomination {
  id: string;
  nomineeId: string;
  nomineeName: string;
  nomineeRole: string;
  nomineeDepartment: string;
  nominatorId: string;
  nominatorName: string;
  category: NominationCategory;
  reason: string;
  impact: string;
  status: NominationStatus;
  createdAt: Date;
  votes: number;
}

export type NominationCategory =
  | "innovation"
  | "leadership"
  | "teamwork"
  | "customer-excellence"
  | "above-and-beyond";

export type NominationStatus = "pending" | "approved" | "awarded" | "rejected";

export interface LeaderboardEntry {
  rank: number;
  employee: Employee;
  nominations: number;
  wins: number;
  score: number;
  trend: "up" | "down" | "stable";
  previousRank: number;
}

export interface MonthlyWinner {
  employee: Employee;
  month: string;
  year: number;
  category: NominationCategory;
  totalVotes: number;
  quote?: string;
}

export interface AnalyticsData {
  month: string;
  nominations: number;
  participationRate: number;
  departments: Record<string, number>;
}

export const CATEGORY_LABELS: Record<NominationCategory, string> = {
  innovation: "Innovation",
  leadership: "Leadership",
  teamwork: "Teamwork",
  "customer-excellence": "Customer Excellence",
  "above-and-beyond": "Above & Beyond",
};

export const STATUS_LABELS: Record<NominationStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  awarded: "Awarded",
  rejected: "Rejected",
};
