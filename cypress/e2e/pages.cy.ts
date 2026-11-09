describe("PYQ and Exam Countdown pages", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("shows Coming soon on the PYQ page while no papers are listed", () => {
    cy.visit("/pyq");
    cy.contains("h1", "Previous Year Question Papers").should("be.visible");
    cy.contains("Coming soon").should("be.visible");
  });

  it("adds an exam on the countdown page and shows the days left", () => {
    cy.visit("/countdown");
    cy.get("#exam-name").type("DBMS End-Sem");
    cy.get("#exam-date").type("2099-01-01");
    cy.contains("button", "Add exam").click();
    cy.contains("DBMS End-Sem").should("be.visible");
    cy.contains("days left").should("be.visible");
  });

  it("redirects the old quiz URLs to the subject page", () => {
    cy.visit("/first-year/c-programming/quiz");
    cy.url().should("include", "/first-year/c-programming");
    cy.url().should("not.include", "/quiz");
  });
});

describe("Contribute and admin pages without login configured", () => {
  it("shows the contribute page with a clear message when login is not set up", () => {
    cy.visit("/contribute");
    cy.contains("h1", "Contribute notes").should("be.visible");
    cy.contains("Contributions open soon").should("be.visible");
  });

  it("does not leak admin tools to visitors", () => {
    cy.visit("/admin");
    cy.contains("Approve").should("not.exist");
    cy.contains("Login is not configured").should("be.visible");
  });
});
