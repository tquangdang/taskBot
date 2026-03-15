# Deploy TaskBot to Vercel (securely)

Your API keys and database credentials stay **out of your repo**. They are only set in Vercel’s environment and used at build/runtime.

---

## 1. Keep secrets out of Git

- **Never commit** `.env`, `.env.local`, or any file containing real keys.
- This repo already ignores them via `.gitignore` (`# env files` → `.env*`).
- Before pushing, run:  
  `git status`  
  and confirm no `.env*` files are listed. If one appears, run:  
  `git check-ignore -v .env.local`  
  (should say it’s ignored).

---

## 2. Push your code

- Push your project to **GitHub** (or GitLab / Bitbucket).
- Do **not** push any `.env` or `.env.local` file.

---

## 3. Create the project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New → Project** and import your TaskBot repo.
3. Leave **Framework Preset** as Next.js and **Root Directory** as `.`.

---

## 4. Add environment variables in Vercel

1. In the import screen, or after creation: **Project → Settings → Environment Variables**.
2. Add each variable below. For **Environment**, choose **Production** (and **Preview** if you want the same keys for PR previews).

| Name | Value | Notes |
|------|--------|------|
| `MONGODB_URI` | `mongodb+srv://...` | Full MongoDB connection string. **Sensitive.** |
| `MONGODB_DB_NAME` | Your DB name | e.g. `taskbot` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase Console | Client config. Exposed in browser (required for Firebase). |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | From Firebase Console. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project ID | From Firebase Console. |
| `FIREBASE_PROJECT_ID` | Same as above | For Firebase Admin. **Sensitive.** |
| `FIREBASE_CLIENT_EMAIL` | Service account email | From Firebase service account JSON. **Sensitive.** |
| `FIREBASE_PRIVATE_KEY` | Private key from service account | See note below. **Sensitive.** |
| `GEMINI_API_KEY` | Your Gemini API key | Optional; only if you use AI chat. **Sensitive.** |

### Firebase private key

- In Vercel you can paste the key **with real newlines** (multi-line). Vercel stores it correctly.
- Or use one line and replace newlines with `\n` (your code already does `replace(/\\n/g, "\n")` for the single-line form).
- Never commit the service account JSON or the key.

---

## 5. Deploy

1. Click **Deploy** (or push to the connected branch to trigger a new deploy).
2. After the build, open the deployment URL and test:
   - Sign up / sign in (Firebase).
   - Add a task (MongoDB).
   - (Optional) Chat (Gemini).

---

## 6. Security checklist

- [ ] No `.env` or `.env.local` in the repo (check `git status`).
- [ ] All variables above set in **Vercel** only (Settings → Environment Variables).
- [ ] Firebase Auth **authorized domains** include your Vercel URL (e.g. `your-app.vercel.app` and any custom domain). In Firebase Console: **Authentication → Settings → Authorized domains**.
- [ ] MongoDB **Network Access** allows Vercel’s IPs, or use “Allow access from anywhere” (0.0.0.0/0) if your DB supports it (Atlas does).
- [ ] For production, consider a **custom domain** and enabling **Vercel’s HTTPS** (default).

---

## Reference: where each variable is used

- **MongoDB** → `src/lib/db/mongo.ts` (server).
- **Firebase client** → `src/lib/firebase/client.ts` (browser).
- **Firebase admin** → `src/lib/firebase/admin.ts` (server; API auth).
- **Gemini** → `src/lib/chat/gemini.ts` (server; optional).

Only `NEXT_PUBLIC_*` values are embedded in the client bundle; the rest are server-only and never sent to the browser.
