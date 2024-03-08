describe("Issue time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const timeEstimateField = () => cy.get('input[placeholder="Number"]');
  const timeReminingField = () => cy.get('[placeholder="Number"]').eq(1);
  const timeLoggingWindow = () => cy.get('[data-testid="modal:tracking"]');

  const addedEstimation = "10";
  const editedEstimation = "12";

  const stopWatchbutton = () => cy.get('[data-testid="icon:stopwatch"]');
  const timeSpentInitially = "4";
  const timeRemainInitially = "3";
  const timeSpentUpdated = "12";
  const timeRemainUpdated = "13";

  it("Should add, edit, remove time estimation successfully", () => {
    getIssueDetailsModal().within(() => {
      timeEstimateField().clear().type(addedEstimation);

      timeEstimateField().should("have.value", addedEstimation);

      timeEstimateField().clear().type(editedEstimation);

      timeEstimateField().should("have.value", editedEstimation);

      timeEstimateField().clear();

      cy.get(editedEstimation).should("not.exist");
      cy.get('[data-testid="icon:close"]').eq(0).click();
    });
  });

  it("Should add, edit, remove time-logging successfully", () => {
    getIssueDetailsModal().within(() => {
      stopWatchbutton().click();
    });
    timeLoggingWindow().should("be.visible");
    timeLoggingWindow().within(() => {
      timeEstimateField().eq(0).clear().type(timeSpentInitially);
      timeReminingField().clear().type(timeRemainInitially);
      cy.contains(timeSpentInitially + "h logged").should("be.visible");
      cy.contains(timeRemainInitially + "h remaining").should("be.visible");

      cy.contains("Done").click();
    });
    timeLoggingWindow().should("not.exist");

    stopWatchbutton().click();
    timeLoggingWindow().should("be.visible");
    timeLoggingWindow().within(() => {
      timeEstimateField().eq(0).clear().type(timeSpentUpdated);
      timeReminingField().clear().type(timeRemainUpdated);
      cy.contains(timeSpentUpdated + "h logged").should("be.visible");
      cy.contains(timeRemainUpdated + "h remaining").should("be.visible");
      cy.contains("Done").click();
    });
    timeLoggingWindow().should("not.exist");

    stopWatchbutton().click();
    timeLoggingWindow().should("be.visible");
    timeLoggingWindow().within(() => {
      timeEstimateField().clear();
      timeReminingField().clear();
      cy.contains("No time logged").should("be.visible");
      cy.contains("Done").click();
    });
  });
});
