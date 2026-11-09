import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // 127.0.0.1, not localhost: Node 18+ resolves localhost to ::1 and the readiness check never connects.
    baseUrl: "http://127.0.0.1:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
    video: false,
    screenshotOnRunFailure: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
  },
});
