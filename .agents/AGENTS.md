# Behavior Customizations

- Do not ask for permission before making changes. Avoid creating implementation plans that block on user approval (`request_feedback = true`) unless absolutely necessary or explicitly requested. Execute changes immediately and directly without asking for permission.
- **Mandatory E2E Browser Testing**: Never declare a UI or user-facing feature fix complete without opening Playwright tools to interactively test and verify the functionality directly in production/live environment. Do not rely solely on code inspection or static builds; run end-to-end browser tests to verify real user interactions.

