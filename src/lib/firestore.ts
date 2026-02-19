import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Employee,
  Nomination,
  LeaderboardEntry,
  MonthlyWinner,
  AnalyticsData,
  NominationCategory,
  NominationStatus,
  AppUser,
  UserRole,
} from "./types";

// -- Collection references --
const employeesCol = () => collection(db, "employees");
const nominationsCol = () => collection(db, "nominations");
const leaderboardCol = () => collection(db, "leaderboard");
const winnersCol = () => collection(db, "monthlyWinners");
const analyticsCol = () => collection(db, "analytics");
const statsDoc = () => doc(db, "meta", "stats");
const usersCol = () => collection(db, "users");

// -- Helpers --
function toDate(val: Timestamp | Date | string): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date(val);
}

// -- Employees --
export async function getEmployees(): Promise<Employee[]> {
  const snap = await getDocs(employeesCol());
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      role: data.role,
      department: data.department,
      avatar: data.avatar,
      joinedDate: toDate(data.joinedDate),
      active: data.active ?? true,
      email: data.email,
    };
  });
}

// -- Nominations --
export async function getNominations(): Promise<Nomination[]> {
  const q = query(nominationsCol(), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      nomineeId: data.nomineeId,
      nomineeName: data.nomineeName,
      nomineeRole: data.nomineeRole,
      nomineeDepartment: data.nomineeDepartment,
      nominatorId: data.nominatorId,
      nominatorName: data.nominatorName,
      category: data.category as NominationCategory,
      reason: data.reason,
      impact: data.impact,
      status: data.status as NominationStatus,
      createdAt: toDate(data.createdAt),
      votes: data.votes ?? 0,
    };
  });
}

export async function addNomination(
  nomination: Omit<Nomination, "id" | "createdAt" | "votes" | "status">,
): Promise<string> {
  const docRef = await addDoc(nominationsCol(), {
    ...nomination,
    status: "pending",
    votes: 0,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateNominationStatus(
  id: string,
  status: NominationStatus,
): Promise<void> {
  await updateDoc(doc(db, "nominations", id), { status });
}

// -- Leaderboard --
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const q = query(leaderboardCol(), orderBy("rank", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      rank: data.rank,
      employee: {
        id: data.employee.id,
        name: data.employee.name,
        role: data.employee.role,
        department: data.employee.department,
        avatar: data.employee.avatar,
        joinedDate: toDate(data.employee.joinedDate),
        active: data.employee.active ?? true,
        email: data.employee.email,
      },
      nominations: data.nominations,
      wins: data.wins,
      score: data.score,
      trend: data.trend,
      previousRank: data.previousRank,
    };
  });
}

// -- Monthly Winners --
export async function getMonthlyWinners(): Promise<MonthlyWinner[]> {
  const q = query(winnersCol(), orderBy("sortKey", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      employee: {
        id: data.employee.id,
        name: data.employee.name,
        role: data.employee.role,
        department: data.employee.department,
        avatar: data.employee.avatar,
        joinedDate: toDate(data.employee.joinedDate),
        active: data.employee.active ?? true,
        email: data.employee.email,
      },
      month: data.month,
      year: data.year,
      category: data.category as NominationCategory,
      totalVotes: data.totalVotes,
      quote: data.quote,
    };
  });
}

// -- Analytics --
export async function getAnalyticsData(): Promise<AnalyticsData[]> {
  const q = query(analyticsCol(), orderBy("sortKey", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      month: data.month,
      nominations: data.nominations,
      participationRate: data.participationRate,
      departments: data.departments,
    };
  });
}

// -- Stats --
export async function getStats(): Promise<{
  totalNominations: number;
  activeEmployees: number;
  participationRate: number;
  awardsGiven: number;
  pendingReviews: number;
  avgVotesPerNomination: number;
}> {
  const snap = await getDoc(statsDoc());
  if (!snap.exists()) {
    return {
      totalNominations: 0,
      activeEmployees: 0,
      participationRate: 0,
      awardsGiven: 0,
      pendingReviews: 0,
      avgVotesPerNomination: 0,
    };
  }
  return snap.data() as {
    totalNominations: number;
    activeEmployees: number;
    participationRate: number;
    awardsGiven: number;
    pendingReviews: number;
    avgVotesPerNomination: number;
  };
}

// -- Seed utility --
export async function seedFirestore() {
  const {
    employees,
    nominations,
    leaderboard,
    monthlyWinners,
    analyticsData,
    stats,
  } = await import("./data");

  const batch = writeBatch(db);

  // Employees
  employees.forEach((emp) => {
    const ref = doc(db, "employees", emp.id);
    batch.set(ref, {
      name: emp.name,
      role: emp.role,
      department: emp.department,
      joinedDate: Timestamp.fromDate(emp.joinedDate),
    });
  });

  // Nominations
  nominations.forEach((nom) => {
    const ref = doc(db, "nominations", nom.id);
    batch.set(ref, {
      nomineeId: nom.nomineeId,
      nomineeName: nom.nomineeName,
      nomineeRole: nom.nomineeRole,
      nomineeDepartment: nom.nomineeDepartment,
      nominatorId: nom.nominatorId,
      nominatorName: nom.nominatorName,
      category: nom.category,
      reason: nom.reason,
      impact: nom.impact,
      status: nom.status,
      createdAt: Timestamp.fromDate(nom.createdAt),
      votes: nom.votes,
    });
  });

  // Leaderboard
  leaderboard.forEach((entry, i) => {
    const ref = doc(db, "leaderboard", `rank-${i + 1}`);
    batch.set(ref, {
      rank: entry.rank,
      employee: {
        id: entry.employee.id,
        name: entry.employee.name,
        role: entry.employee.role,
        department: entry.employee.department,
        joinedDate: Timestamp.fromDate(entry.employee.joinedDate),
      },
      nominations: entry.nominations,
      wins: entry.wins,
      score: entry.score,
      trend: entry.trend,
      previousRank: entry.previousRank,
    });
  });

  // Monthly winners
  const monthToNum: Record<string, string> = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  monthlyWinners.forEach((winner, i) => {
    const ref = doc(db, "monthlyWinners", `winner-${i + 1}`);
    batch.set(ref, {
      employee: {
        id: winner.employee.id,
        name: winner.employee.name,
        role: winner.employee.role,
        department: winner.employee.department,
        joinedDate: Timestamp.fromDate(winner.employee.joinedDate),
      },
      month: winner.month,
      year: winner.year,
      category: winner.category,
      totalVotes: winner.totalVotes,
      quote: winner.quote ?? null,
      sortKey: `${winner.year}-${monthToNum[winner.month] ?? "01"}`,
    });
  });

  // Analytics
  const monthOrder = [
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
  ];
  analyticsData.forEach((data, i) => {
    const ref = doc(db, "analytics", `month-${i + 1}`);
    batch.set(ref, {
      month: data.month,
      nominations: data.nominations,
      participationRate: data.participationRate,
      departments: data.departments,
      sortKey: i,
    });
  });

  // Stats
  batch.set(statsDoc(), stats);

  await batch.commit();
}

// -- Users (RBAC) --
export async function getUserByUid(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid: snap.id,
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
    createdAt: toDate(data.createdAt),
  };
}

export async function createUserDoc(user: AppUser): Promise<void> {
  const ref = doc(db, "users", user.uid);
  await updateDoc(ref, {
    uid: user.uid,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: Timestamp.fromDate(user.createdAt),
  }).catch(async () => {
    // If doc doesn't exist yet, create it
    const { setDoc } = await import("firebase/firestore");
    await setDoc(ref, {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: Timestamp.fromDate(user.createdAt),
    });
  });
}

export async function getAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(usersCol());
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      createdAt: toDate(data.createdAt),
    };
  });
}

// -- Employee CRUD --
export async function createEmployee(
  employee: Omit<Employee, "id">,
): Promise<string> {
  const docRef = await addDoc(employeesCol(), {
    name: employee.name,
    role: employee.role,
    department: employee.department,
    email: employee.email,
    joinedDate: Timestamp.fromDate(employee.joinedDate),
    active: employee.active,
  });
  return docRef.id;
}

export async function updateEmployee(
  id: string,
  data: Partial<Omit<Employee, "id">>,
): Promise<void> {
  const updateData: Record<string, unknown> = { ...data };
  if (data.joinedDate) {
    updateData.joinedDate = Timestamp.fromDate(data.joinedDate);
  }
  delete updateData.id;
  await updateDoc(doc(db, "employees", id), updateData);
}

export async function deactivateEmployee(id: string): Promise<void> {
  await updateDoc(doc(db, "employees", id), { active: false });
}

export async function deleteEmployee(id: string): Promise<void> {
  await deleteDoc(doc(db, "employees", id));
}

export async function getActiveEmployees(): Promise<Employee[]> {
  const q = query(employeesCol(), where("active", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      role: data.role,
      department: data.department,
      avatar: data.avatar,
      joinedDate: toDate(data.joinedDate),
      active: true,
      email: data.email,
    };
  });
}

// -- Nomination queries --
export async function getNominationsByStatus(
  status: NominationStatus,
): Promise<Nomination[]> {
  const q = query(
    nominationsCol(),
    where("status", "==", status),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      nomineeId: data.nomineeId,
      nomineeName: data.nomineeName,
      nomineeRole: data.nomineeRole,
      nomineeDepartment: data.nomineeDepartment,
      nominatorId: data.nominatorId,
      nominatorName: data.nominatorName,
      category: data.category as NominationCategory,
      reason: data.reason,
      impact: data.impact,
      status: data.status as NominationStatus,
      createdAt: toDate(data.createdAt),
      votes: data.votes ?? 0,
    };
  });
}
