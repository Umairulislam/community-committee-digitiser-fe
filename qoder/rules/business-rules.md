# Frontend Business Rules

## Source of Truth

* The backend is the source of truth for all committee, financial, lottery, payout, and audit data.
* The frontend must display backend state rather than independently deciding business outcomes.

## Committee

* A user may only access committees returned by the backend.
* Display committee status exactly as provided by the backend.
* Supported committee statuses:

  * `DRAFT`
  * `ACTIVE`
  * `PAUSED`
  * `COMPLETED`
  * `CANCELLED`

## Members

* Display only member information provided and authorised by the backend.
* Do not infer membership status from local UI state.
* Do not expose private member information unnecessarily.

## Contributions

* Display the contribution amount, due date, and status returned by the backend.
* Do not calculate authoritative contribution amounts on the client.
* Do not mark a contribution as paid from client state alone.

## Payments

* Payment success must come from the backend/payment flow.
* Never display a payment as permanently successful based only on a button click or optimistic state.
* Always refresh/use the authoritative API response after payment-related operations.

## Cycles

* Display cycle status and totals from backend responses.
* Do not independently advance, complete, reopen, or modify cycles on the client.

## Lottery

* The frontend only displays lottery state and results.
* The frontend must never:

  * Select a winner
  * Generate the winner
  * Determine eligibility
  * Exclude previous winners
* Show the final lottery result returned by the backend.

## Payouts

* Display payout amount, winner, status, date, and reference from backend data.
* Do not calculate or modify authoritative payout values on the client.

## Audit & Timeline

* Display audit events in chronological order according to backend data.
* Never allow users to edit or delete audit history through the frontend.

## Notifications

* Display notification state from the backend.
* Marking a notification as read must call the appropriate API rather than only changing local state.

## AI Assistant

* The AI Assistant only answers questions about data the authenticated user is authorised to access.
* Do not expose unauthorised committee information in the UI.
* AI responses must not be treated as authoritative business decisions.

## General Rule

When frontend behaviour conflicts with backend data or business rules, the backend response wins.
