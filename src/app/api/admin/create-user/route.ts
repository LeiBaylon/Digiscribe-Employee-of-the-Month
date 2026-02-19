import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    // Verify the caller's ID token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Check if the caller is an admin
    const callerDoc = await adminDb
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Parse the request body
    const { email, password, displayName, department, jobTitle } =
      await request.json();

    if (!email || !password || !displayName || !department || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, displayName, department, jobTitle" },
        { status: 400 },
      );
    }

    // Create the Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    });

    const now = Timestamp.now();

    // Create the Firestore user doc (for RBAC)
    await adminDb
      .collection("users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        name: displayName,
        email,
        role: "employee",
        createdAt: now,
      });

    // Create the Firestore employee doc
    await adminDb.collection("employees").add({
      name: displayName,
      role: jobTitle,
      department,
      email,
      joinedDate: now,
      active: true,
    });

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      message: `Employee account created for ${email}`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    // Handle Firebase Auth specific errors
    if (message.includes("email-already-exists")) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
