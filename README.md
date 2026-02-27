# DecorFlow - Interior Design Portal

This is a multi-tenant SaaS portal for interior designers, built with Next.js App Router, Prisma, PostgreSQL (Neon), UploadThing, Pusher, and auth.js.

## 🚀 Final Deployment Checklist

Before deploying this application to Vercel (or any other hosting provider), ensure the following **Environment Variables** are correctly set in the dashboard:

| Variable Name | Description |
| :--- | :--- |
| `DATABASE_URL` | Your Neon Postgres connection string |
| `NEXTAUTH_URL` | Your live production domain (e.g. `https://my-saas-website.com`) |
| `AUTH_SECRET` | A securely generated random string (e.g. `openssl rand -hex 32`) |
| `AUTH_TRUST_HOST` | Set to `true` (helps Vercel handle dynamic URLs) |
| `CRON_SECRET` | Secret key used by the GitHub Action to securely hit the keep-alive API |
| `PRODUCTION_URL` | Same as `NEXTAUTH_URL`, used by the keep-alive GitHub workflow |
| `UPLOADTHING_TOKEN` | Token from the UploadThing dashboard for image uploads |
| `NEXT_PUBLIC_PUSHER_KEY` | Public key from Pusher |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Pusher cluster (e.g. `mt1`) |
| `PUSHER_APP_ID` | Private App ID from Pusher |
| `PUSHER_SECRET` | Private Secret from Pusher |

*Note: Ensure your GitHub repository has `CRON_SECRET` and `PRODUCTION_URL` stored as Action Secrets for the periodic database warmup workflow to succeed.*
