import { auth } from "@/lib/firebase/client";

export async function authedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const user = auth?.currentUser ?? null;
  const token = user ? await user.getIdToken() : null;

  const headers = new Headers(init.headers ?? {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  headers.set("Content-Type", "application/json");

  return fetch(input, {
    ...init,
    headers,
  });
}

