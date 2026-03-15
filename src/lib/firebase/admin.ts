import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let app: App;

if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} else {
  app = getApps()[0]!;
}

export const adminAuth = getAuth(app);

export async function verifyBearerToken(
  authorizationHeader: string | null
): Promise<string | null> {
  if (!authorizationHeader?.startsWith("Bearer ")) return null;
  const token = authorizationHeader.slice("Bearer ".length);
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid ?? null;
  } catch {
    return null;
  }
}

