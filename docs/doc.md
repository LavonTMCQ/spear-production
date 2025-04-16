Below is a concise end‑to‑end architecture and tech stack for your unified web application—one portal that lets clients remotely view & control their assigned Pixel 5 (screen+input) and see subscription info, and gives you (the admin) a console to onboard devices/clients, monitor billing, and cut off non‑payers.

⸻

1. High‑Level Architecture

flowchart LR
  subgraph Client Browser
    A[Login / Dashboard] --> B[Remote‑Control UI]
    A --> C[Subscription Status UI]
  end

  subgraph Admin Browser
    X[Admin Login] --> Y[Admin Console]
    Y --> Z[Client & Billing Management]
    Y --> D[Device Inventory]
  end

  subgraph Next.js App (Vercel)
    A & X --> E[(NextAuth + Role‑Gate)]
    E --> F[(API Routes)]
    F --> G[(PostgreSQL + Prisma)]
    F --> H[Stripe Billing API]
    F --> I[TeamViewer / Remote‑Control API]
  end

  subgraph Device Fleet
    J[Pixel 5 w/ TeamViewer Host] --> I
  end



⸻

2. Core Features & Flow

User Role    Feature    Flow
Client    1. Login & Profile    NextAuth handles OAuth/JWT → session cookie → /dashboard
    2. Dashboard    Fetch /api/devices → show assigned Pixel 5 with: “Connect” buttonLast check‑in mapSubscription status
    3. Remote‑Control Session    “Connect” → embed TeamViewer Web SDK iframe (or deep‑link teamviewer://…)
    4. Subscription UI    Show Stripe subscription object (plan, next renewal, invoice history); link to Customer Portal
Admin    1. Admin Login    Same NextAuth, but restricted to role: admin
    2. Client & Billing Management    /admin/clients → list users + subscription status + “Cancel subscription” action
    3. Device Inventory & Assignment    /admin/devices → list Pixel 5s, their TeamViewer IDs, assignment to clients
    4. Cut‑Off / Re‑Enable Access    Backend calls TeamViewer API or webhooks to revoke tunnel or Host access



⸻

3. Tech Stack

Front‑End
    •    Framework: Next.js + TypeScript
    •    File‑based routing /dashboard, /admin, /api/....
    •    Hybrid SSR/SSG for fast load & SEO.
    •    UI Library: Chakra UI
    •    Accessible, themeable components for dashboards, tables, maps, forms.
    •    State & Data‑Fetching: React Query + Context API
    •    Caching of devices, subscriptions, user session.
    •    Forms & Validation: React Hook Form + Zod
    •    Lightweight, type‑safe check‑in forms.
    •    Maps: Mapbox GL JS
    •    Show device last‑known GPS point on a small map.
    •    Remote‑Control Embed:
    •    TeamViewer Web SDK (JavaScript iframe)
    •    Or simple <iframe src="https://web.teamviewer.com/l/{connectionId}" />
    •    Fallback deep link: <a href="teamviewer://remotecontrol?alias={alias}">Launch</a>

Back‑End (API Routes)
    •    Next.js API Routes (Node.js)
    •    Authentication: NextAuth.js (credentials + JWT + role claims)
    •    Database: PostgreSQL + Prisma ORM
    •    Schemas: User, Device, Subscription, CheckIn
    •    Billing: Stripe Billing
    •    Webhooks → /api/webhooks/stripe → upsert subscription status in DB
    •    Customer Portal → embed or redirect
    •    TeamViewer Integration
    •    REST calls to create users/groups/devices & revoke access
    •    Store teamViewerDeviceId, connectionAlias in your DB

DevOps & Deployment
    •    Hosting: Vercel (Next.js)
    •    Environment:
    •    Env vars for STRIPE_KEY, TW_CLIENT_ID/SECRET, DATABASE_URL, NEXTAUTH_SECRET
    •    CI/CD: GitHub Actions → auto‑deploy on merge
    •    Monitoring: Sentry (errors), Vercel Analytics (performance)

⸻

4. Key Data Models (Prisma Schema Snippet)

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  name           String?
  role           Role     @default(CLIENT)
  teamViewerUser String?  // if managing sub‑accounts
  subscriptions  Subscription[]
  devices        Device[]
}

model Device {
  id                 String   @id @default(uuid())
  name               String
  teamViewerDeviceId String   @unique
  assignedTo         User?    @relation(fields: [userId], references: [id])
  userId             String?
  lastCheckIn        CheckIn?
  checkIns           CheckIn[]
}

model Subscription {
  id               String   @id @default(uuid())
  stripeSubId      String   @unique
  status           String
  currentPeriodEnd DateTime
  user             User     @relation(fields: [userId], references: [id])
  userId           String
}

model CheckIn {
  id        String   @id @default(uuid())
  device    Device   @relation(fields: [deviceId], references: [id])
  deviceId  String
  latitude  Float
  longitude Float
  createdAt DateTime @default(now())
}



⸻

5. Example API Endpoints

Route    Method    Description
POST /api/auth/login    POST    NextAuth credentials flow
GET  /api/devices    GET    List a user’s assigned devices + status
POST /api/checkin    POST    Record GPS check‑in (lat/lng)
GET  /api/subscription    GET    Fetch current subscription data from DB
POST /api/stripe/webhook    POST    Handle Stripe events (invoice.paid, customer.deleted)
GET  /api/admin/clients    GET    (Admin only) list all users + subscription statuses
POST /api/admin/clients/:id/revoke    POST    Cancel a client’s subscription & revoke TeamViewer access



⸻

6. Security & Roles
    •    Clients only see /dashboard and their own devices.
    •    Admins see /admin/* via role‑based guard in NextAuth callbacks.
    •    Secure API with CSRF tokens, rate limiting, helmet/CSP.
    •    HTTPS/TLS everywhere—no mixed content on TeamViewer iframe.

⸻

7. Flow: Cutting Off a Non‑Payer
    1.    Stripe Webhook fires invoice.payment_failed → your /api/stripe/webhook updates Subscription.status = "past_due".
    2.    Background Worker or immediate logic calls TeamViewer API to disable that device’s Host (or remove group membership).
    3.    User Portal sees subscription.status !== "active" → hides “Connect” button, shows “Pay to restore access.”
    4.    Admin UI highlights past‑due clients; one click “Revoke access” further ensures device is unassigned.

⸻

Next Steps
    1.    Prototype the client dashboard in Next.js + Chakra with mocked data.
    2.    Wire up NextAuth + Stripe Customer Portal.
    3.    Integrate TeamViewer Web SDK in a staging device to prove end‑to‑end remote control.
    4.    Build admin console and full billing/webhook workflow.

With this stack you’ll deliver a single web app that handles remote screen control, geofenced check‑ins, subscription management, and a robust admin console—all under your $350 / mo pricing model.