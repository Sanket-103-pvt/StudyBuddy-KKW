describe("Home Page & Search E2E Test Suite", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the home page and render hero heading and year selection cards", () => {
    cy.contains("h1", "Find your notes in seconds").should("be.visible");
    cy.contains("First Year").should("be.visible");
    cy.contains("Second Year").should("be.visible");
  });

  it("should navigate to year pages when clicking year cards", () => {
    cy.get('a[href="/first-year"]').first().click();
    cy.url().should("include", "/first-year");
    cy.contains("h1", "First Year").should("be.visible");
  });

  it("should display search results overlay when typing a search query", () => {
    // Type search query into SearchBar input
    cy.get('input[placeholder*="Search"]').type("DBMS");

    // Dropdown overlay should appear with search results
    cy.contains("Database Management System [DBMS]").should("be.visible");
  });

  it("should clear the search input and close dropdown when clear button is clicked", () => {
    cy.get('input[placeholder*="Search"]').type("DBMS");
    cy.contains("Database Management System [DBMS]").should("be.visible");

    // Click clear button inside SearchBar
    cy.get('button[aria-label="Clear search"]').click();

    // Search input should be empty
    cy.get('input[placeholder*="Search"]').should("have.value", "");
    // Search dropdown result should no longer exist
    cy.contains("Database Management System [DBMS]").should("not.exist");
  });
});
