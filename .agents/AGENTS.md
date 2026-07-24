# Behavior Customizations

- Do not ask for permission before making changes. Avoid creating implementation plans that block on user approval (`request_feedback = true`) unless absolutely necessary or explicitly requested. Execute changes immediately and directly without asking for permission.
- **Mandatory E2E Browser Testing**: Never declare a UI or user-facing feature fix complete without verifying the functionality directly in the production/live environment using Playwright. 
  - **Primary**: Use the Playwright MCP to interactively test. 
  - **Strict Fallback**: If the Playwright MCP fails to launch (e.g., "Browser is already in use" due to active user sessions), you MUST NOT skip validation. Instead, immediately write and execute a standalone, headless Node.js Playwright script to run the necessary interactions and timing checks against the live production URL. Never delegate the final verification to the user.
