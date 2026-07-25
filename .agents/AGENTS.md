# Behavior Customizations

- Do not ask for permission before making changes. Avoid creating implementation plans that block on user approval (`request_feedback = true`) unless absolutely necessary or explicitly requested. Execute changes immediately and directly without asking for permission.
- **Mandatory E2E Browser Testing & Deployment Verification**:
  1. **Never declare a fix complete prematurely**: Do NOT tell the user a fix is resolved, and do NOT ask them to validate it, until you have personally confirmed it works on the live production URL.
  2. **Verify Deployments**: If your fix requires a deployment (e.g. Netlify/Vercel), you MUST wait for the deployment to finish and verify it was successful before proceeding. Do not assume your pushed code compiled successfully.
  3. **Validate via Playwright**: You must verify the functionality directly in the production/live environment using Playwright.
    - **Primary**: Use the Playwright MCP to interactively test.
    - **Strict Fallback**: If the Playwright MCP fails to launch, immediately write and execute a standalone, headless Node.js Playwright script to run the necessary interactions and timing checks against the live production URL. Never delegate the final verification to the user.
- **Mandatory Image Validation**: Always validate that images load correctly in the browser when making structural HTML changes or refactoring image URLs (e.g. src attributes, API image paths). Do not assume URL string manipulation is correct without visual validation via Playwright or by capturing screenshots of the live UI to ensure images are not broken.
