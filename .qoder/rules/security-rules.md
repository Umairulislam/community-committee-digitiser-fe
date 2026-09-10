# Frontend Security Rules

## Authentication

* Protect authenticated routes using the root `proxy.ts`.
* Do not store sensitive authentication credentials in insecure client-side storage.
* Never expose secrets, private keys, database credentials, or backend API keys in frontend code.
* Do not place server-only environment variables in client-exposed configuration.

## Authorisation

* Frontend route protection improves UX but is not the security boundary.
* Never assume that hiding a UI element provides authorisation.
* The backend must enforce all permissions.

## API Security

* Send requests only to configured backend API endpoints.
* Follow the documented API contracts.
* Do not allow arbitrary user-controlled URLs to become API destinations.
* Handle authentication failures and expired sessions safely.

## Sensitive Data

* Display only the minimum data required by the current screen.
* Do not log passwords, tokens, payment data, or other sensitive information.
* Avoid exposing sensitive information in URLs, browser storage, or client-side logs.

## Forms

* Validate user input with Zod before submission where appropriate.
* Treat frontend validation as a usability feature, not a security control.
* Never trust values simply because they passed frontend validation.

## Payments

* Never determine payment success on the client.
* Do not store sensitive payment credentials.
* Do not expose secret payment-provider configuration in client code.

## Lottery

* Never generate or modify lottery winners in the browser.
* Never trust a client-generated eligibility list.
* Display only the backend-provided lottery result.

## AI

* Never expose the OpenAI API key in the browser.
* AI requests must go through the backend.
* Do not send unnecessary private user/committee data directly from the browser to an AI provider.

## Third-Party Libraries

* Avoid unnecessary third-party packages.
* Review package purpose before adding dependencies.
* Do not introduce libraries that duplicate existing project functionality without a clear reason.

## Error Handling

* Show user-friendly error messages.
* Do not display raw server errors, stack traces, SQL errors, tokens, or internal infrastructure details.

## Environment Variables

* Keep secrets in server-side environment variables.
* Only expose variables that genuinely need to be available to the browser using the appropriate Next.js public-variable mechanism.
* Keep `.env` out of source control and maintain `.env.example` with placeholders.
