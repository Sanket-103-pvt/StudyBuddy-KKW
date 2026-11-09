describe("Home Page & Search E2E Test Suite", () => {
  // The landing page search box opens the global search palette.
  const openSearch = () => {
    cy.get('main, body').find('button[aria-label="Search subjects"]').first().click();
    return cy.get('[role="dialog"] input[aria-label="Search subjects"]').should("be.visible");
  };

  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the home page and render hero heading and year selection cards", () => {
    cy.contains("h1", "One solution").should("be.visible");
    cy.get('a[href="/first-year"]').should("exist");
    cy.get('a[href="/second-year"]').should("exist");
  });

  it("should navigate to year pages when clicking year cards", () => {
    cy.get('a[href="/first-year"]').first().click();
    cy.url().should("include", "/first-year");
    cy.contains("h1", "First Year").should("be.visible");
  });

  it("should list matching subjects when typing a search query", () => {
    openSearch().type("DBMS");
    cy.get('[role="option"]').contains("Database Management System [DBMS]").should("be.visible");
  });

  it("should open the subject page when a search result is selected", () => {
    openSearch().type("DBMS");
    cy.get('[role="option"]').first().click();
    cy.url().should("include", "/second-year/dbms");
  });

  it("should restrict results with the year filter", () => {
    openSearch().type("math");
    cy.get('button[aria-pressed]').contains("2nd Year").click();
    cy.get('[role="option"]').each(($el) => {
      cy.wrap($el).should("contain.text", "2nd Year");
    });
  });

  it("should clear the search input and close the results when the clear button is clicked", () => {
    openSearch().type("DBMS");
    cy.get('[role="option"]').should("exist");

    cy.get('button[aria-label="Clear search"]').click();

    cy.get('[role="dialog"] input[aria-label="Search subjects"]').should("have.value", "");
    cy.get('[role="option"]').should("not.exist");
  });

  it("should open the global search palette with Ctrl+K on any page", () => {
    cy.visit("/calculator");
    cy.get("body").type("{ctrl}k");
    cy.get('[role="dialog"] input[aria-label="Search subjects"]').should("be.visible").type("DBMS");
    cy.get('[role="dialog"] [role="option"]').first().click();
    cy.url().should("include", "/second-year/dbms");
  });
});
