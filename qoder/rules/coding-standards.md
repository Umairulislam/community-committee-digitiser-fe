# Frontend Coding Standards

## TypeScript

* Use strict TypeScript.
* Avoid `any`.
* Prefer interfaces/types that clearly represent domain and API data.
* Reuse existing shared types instead of duplicating them.

## Naming

* Components: `PascalCase`
* Hooks: `useSomething`
* Functions/variables: `camelCase`
* Constants: `UPPER_SNAKE_CASE` where appropriate
* Files should follow the existing project naming convention consistently.
* Use clear domain-specific names.

## Components

* Keep components small and focused.
* Separate presentation from data-fetching/business concerns where practical.
* Avoid large components containing unrelated responsibilities.
* Reuse existing components before creating new ones.
* Move genuinely reusable components into `components/`.
* Keep feature-specific components inside their feature.

## React

* Use functional components.
* Use hooks according to React rules.
* Add `"use client"` only when required.
* Avoid unnecessary effects and derived state.
* Prefer server rendering where client-side behaviour is not required.

## RTK Query

* Use RTK Query for API/server state.
* Keep endpoint definitions organised by feature.
* Prefer generated hooks rather than manually managing API request state.
* Do not copy RTK Query data into another state store without a clear reason.
* Correctly handle loading, error, success, empty, and refetch states.

## Forms

* Use React Hook Form for forms.
* Use Zod schemas for validation.
* Keep form schemas close to the feature/form.
* Reuse shared form components when appropriate.
* Avoid duplicating the same validation schema.

## Material UI

* Use MUI components for UI and styling.
* Use the central theme and design tokens.
* Prefer `sx`, `styled`, and MUI component APIs.
* Do not introduce Tailwind or another CSS/UI framework.
* Avoid hard-coded colours, typography, shadows, and spacing when a theme token exists.

## Theme

* Put reusable design tokens in `theme/tokens.ts`.
* Put the complete MUI theme configuration and component overrides in `theme/theme.ts`.
* Do not create ad-hoc competing themes.
* Any new global visual pattern should be evaluated for inclusion in the central theme.

## Feature Structure

Feature-specific code should stay together:

```text id="9ebxpw"
features/
└── feature-name/
    ├── api/
    ├── components/
    ├── hooks/
    ├── types/
    ├── schemas/
    └── ...
```

Only move code to shared folders when it is genuinely reusable.

## Shared Code

* Reusable components belong in `components/`.
* Shared application types belong in `types/`.
* Reusable helper functions belong in `utils/`.
* Do not use `utils/` as a place for business logic.

## API Contracts

* Follow the backend API documentation exactly.
* Do not invent endpoints, fields, statuses, or response structures.
* Update frontend types when backend contracts change.
* Handle unexpected/malformed API responses safely.

## Accessibility

* Use semantic elements where appropriate.
* Provide labels for inputs and controls.
* Ensure keyboard accessibility.
* Use accessible names for icon-only actions.
* Do not rely on colour alone to communicate status.

## Responsive Design

* Use MUI responsive utilities and breakpoints.
* Avoid unnecessary fixed widths/heights.
* Test important screens across desktop and mobile layouts.

## Code Quality

* Prefer readable code over clever code.
* Avoid premature abstraction.
* Reuse existing patterns.
* Keep functions focused.
* Remove unused imports, variables, and components.
* Do not modify unrelated code during feature implementation.

## Comments

* Comment only non-obvious technical or business decisions.
* Do not write comments that merely describe obvious code.

## Testing

* Test important user flows and feature logic.
* Prioritise tests for:

  * Forms and validation
  * Authentication behaviour
  * Protected routes
  * API states
  * Critical user interactions
* Do not rely only on visual/manual testing for important logic.

## General Rule

Before creating new code, check whether an existing component, hook, utility, type, API pattern, or theme token can be reused.
