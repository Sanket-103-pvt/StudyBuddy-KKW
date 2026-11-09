describe("Bookmarks E2E Test Suite", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    cy.clearLocalStorage();
  });

  it("should pin a resource, persist across reloads, and unpin successfully", () => {
    // 1. Visit a subject page
    cy.visit("/second-year/deld");

    // 2. Click the star/bookmark button on the first resource
    cy.get('button[aria-label="Bookmark resource"]').first().click();

    // 3. Confirm Toast notification appears
    cy.contains("Pinned").should("be.visible");

    // 4. Navigate to Home Page
    cy.visit("/");

    // 5. Confirm "Pinned Resources" section is visible
    // The section is below the fold inside a scrolling container; Cypress treats clipped elements as hidden.
    cy.contains("Pinned Resources").scrollIntoView().should("be.visible");

    // 6. Reload page to verify persistence in localStorage
    cy.reload();

    // 7. Verify Pinned Resources section persists after reload
    // The section is below the fold inside a scrolling container; Cypress treats clipped elements as hidden.
    cy.contains("Pinned Resources").scrollIntoView().should("be.visible");

    // 8. Click unpin button on the pinned card
    cy.get('button[aria-label="Remove pin"]').first().click();

    // 9. Confirm toast notification and removal of Pinned Resources section
    cy.contains("Unpinned").should("be.visible");
    cy.contains("Pinned Resources").should("not.exist");
  });
});
