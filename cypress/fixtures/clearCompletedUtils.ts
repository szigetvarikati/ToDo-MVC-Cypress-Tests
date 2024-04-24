export function verifyClearCompletedButtonIsAppaered(): void {
  cy.contains('Clear completed').should('be.visible');
}

export function clearCompletedTodos(): void {
  cy.contains('Clear completed').click();
}
