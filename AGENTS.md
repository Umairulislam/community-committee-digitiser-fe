<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Trust Kameti — Frontend

## Project

Frontend for a transparent and auditable digital committee (kameti) platform.

The frontend allows users and admins to view and interact with committee data through a simple, clear, and trustworthy interface.

## Stack

* Next.js (App Router)
* TypeScript
* React
* Redux Toolkit + RTK Query
* React Hook Form
* Zod
* Material UI (MUI)
* Tailwind CSS where appropriate

## Roles

* `USER` — manages their committee-related activities and views their records.
* `ADMIN` — manages committees, members, contributions, cycles, lottery, payouts, notifications, audits, and reports.

## Architecture

* Use Next.js App Router.
* Organise code by feature/domain.
* Use RTK Query for server state and API communication.
* Use React Hook Form + Zod for form handling and validation.
* Keep business logic out of UI components.
* Keep reusable UI components separate from feature-specific components.
* Follow the existing backend API contracts.

## Core Features

### User

* Authentication
* Dashboard
* Committees
* Contributions
* Payment history
* Payout tracking
* Lottery results
* Committee timeline
* Notifications
* Profile
* AI Committee Assistant

### Admin

* Dashboard
* Committee management
* Member management
* Contributions and payment verification
* Cycle management
* Lottery management
* Payout management
* Notifications
* Audit logs/timeline
* Reports
* Committee settings

## Important Rules

* Do not duplicate backend business logic in the frontend.
* The backend is the source of truth.
* Never calculate or determine lottery winners on the client.
* Never treat client-side state as proof of payment or payout.
* Respect the user's role and permissions.
* Never expose secrets or sensitive backend configuration.
* Handle loading, error, empty, and success states for API-driven UI.

## UI Principles

* Keep interfaces simple and user-focused.
* Prefer reusable MUI components and established project patterns.
* Maintain consistent spacing, typography, forms, tables, dialogs, and feedback states.
* Build responsive layouts.
* Avoid unnecessary complexity and excessive visualisation.

## Development Principle

Build the frontend incrementally and keep each feature aligned with the documented product scope, backend API contracts, business rules, and security requirements.
