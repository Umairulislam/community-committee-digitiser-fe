# Frontend Development Rules

## Framework

* Use Next.js App Router and TypeScript.
* Follow existing Next.js conventions before introducing new patterns.
* Clearly distinguish Server Components and Client Components.
* Use Client Components only when client-side behaviour is required.

## State Management

* Use **RTK Query** for server/API state.
* Use Redux only for genuinely shared client state.
* Use React state for local UI state.
* Do not duplicate API data in Redux/local state without a clear reason.

## Forms & Validation

* Use **React Hook Form** for forms.
* Use **Zod** for schema validation.
* Keep schemas close to the feature/form that uses them.
* Do not duplicate backend validation rules unnecessarily.
* Always handle form loading, validation, success, and error states.

## Material UI

* **Material UI is the only styling/UI library.**
* Do not use Tailwind CSS or another CSS framework.
* Do not introduce arbitrary global CSS for component styling when MUI can handle it.
* Reuse MUI components and project patterns instead of creating duplicate UI primitives.
* Use the central MUI theme for colours, typography, spacing, shadows, radii, and component overrides.

## Theme Rules

* Never hard-code design tokens when an existing theme token can be used.
* Add reusable design values to `theme/tokens.ts`.
* Add global MUI component customisation to `theme/theme.ts`.
* Do not create multiple competing theme definitions.

## Components

* Reusable components belong in `components/`.
* Group shared components by category such as `layout/` and `ui/`.
* Feature-specific components belong inside their feature.
* Components should have a single clear responsibility.
* Avoid large components containing unrelated logic.

## Feature Structure

Each feature should own its:

* API logic
* Types
* Hooks
* Components
* Feature-specific utilities
* Validation schemas

Keep feature boundaries clear.

## Types

* Put genuinely shared types in root-level `types/`.
* Keep feature-specific types inside the feature.
* Avoid duplicate definitions of the same API/domain type.
* Prefer inferred types from Zod schemas where appropriate.

## API

* Always consult docs/api-documentation.md before implementing or consuming an API
* Do not invent endpoints, request fields, response fields, or business behaviour.
* Handle loading, empty, error, and success states.
* Never assume that client state represents the actual financial or business state.


## Authentication & Authorisation

* Use `proxy.ts` for appropriate request-level route protection.
* Treat proxy protection as a frontend routing layer, not the final security boundary.
* The backend remains responsible for actual authentication and authorisation.
* Do not expose tokens, secrets, or backend credentials in client code.

## Business Logic

* Do not implement critical backend business rules inside UI components.
* Do not calculate or determine lottery winners on the client.
* Do not treat client-side calculations as authoritative financial values.
* Use backend responses as the source of truth.

## UX

Every API-driven screen should consider:

* Loading state
* Error state
* Empty state
* Success state
* Disabled state where appropriate

Provide clear feedback for user actions such as payments, invitations, lottery results, and status changes.

## Code Quality

* Use strict TypeScript.
* Avoid `any`.
* Prefer readable and maintainable code.
* Avoid unnecessary abstraction.
* Reuse existing components, hooks, utilities, and patterns.
* Keep components and hooks focused.
* Remove unused code and imports.
* Do not modify unrelated features when implementing a task.

## Responsive Design

* Build responsive layouts using MUI's responsive APIs and theme system.
* Design for desktop and mobile from the beginning.
* Avoid fixed dimensions that unnecessarily break responsive layouts.

## Accessibility

* Use semantic HTML where appropriate.
* Provide accessible labels and keyboard interaction.
* Use MUI accessibility features correctly.
* Do not rely only on colour to communicate status.

## Development Principle

Build the frontend feature by feature, following the documented backend contracts, project architecture, business rules, and central design system.
