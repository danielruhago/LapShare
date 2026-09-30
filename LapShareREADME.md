# LapShare

**Laptop rentals for university students.** Borrow a verified laptop by the day, week, or month, then hand it back on campus.

🏆 **3rd Place, Co.Hack 2026** · 🔗 **Live demo: [lap-share.vercel.app](https://lap-share.vercel.app)**

![LapShare: verified laptop rentals for students](docs/LapShare_Cover_Image.png)

---

## The Problem

Laptops are essential for university, but not every student can afford one, and a laptop that breaks mid-term can derail a semester. LapShare gives students short-term access to a working laptop when they need one.

LapShare owns and manages its own laptop inventory. Students rent devices directly, and pickup happens at a designated campus location (the Hardy Lab in the USask Engineering Building for the pilot).

## Features

- **University-only sign-in:** authentication is restricted to university email addresses, so only verified students can rent.
- **Full rental flow:** request a device, go through a simulated checkout, receive a confirmation, and cancel if plans change.
- **Admin panel:** manage device inventory and track each laptop's status (available, reserved, rented) in real time.
- **Production deployment:** live on Vercel with continuous deployment from GitHub.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL on Supabase |
| ORM | Drizzle ORM |
| Authentication | Better Auth |
| Deployment | Vercel (GitHub-based CI/CD) |

## Getting Started

### Prerequisites
- Node.js (LTS) and pnpm
- A PostgreSQL database (e.g., a free Supabase project)

### Installation

```bash
git clone https://github.com/<your-username>/lapshare.git
cd lapshare
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
DATABASE_URL=your_postgres_connection_string
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000
```

<!-- Update these names to match the ones your code actually uses. -->

### Run Locally

```bash
pnpm drizzle-kit push   # apply the database schema
pnpm dev                # start the dev server at http://localhost:3000
```

## Build Notes

- **Built in one day:** I developed the full stack (frontend, database, authentication, admin panel, and deployment) in about 10 hours during Co.Hack 2026, while teammates built the pitch.
- **Business model pivot:** the original idea was a peer-to-peer marketplace. We pivoted to a company-owned inventory model to simplify trust, device quality, and pickup logistics.
- **Deployment challenge:** resolved SSL connection issues between the Vercel deployment and the live Supabase database in production.
- **Workflow:** prototyped the UI with v0 by Vercel, then moved to Cursor for full development.

## Team

Built at Co.Hack 2026 by **Daniel Ruhago** (full-stack development and deployment), with **Omar, Ean, Dara, and Jethro** (pitch, business model, and presentation).

## Contact

**Daniel Ruhago**, Chemical Engineering, University of Saskatchewan
📧 daniel.ruhago@usask.ca
