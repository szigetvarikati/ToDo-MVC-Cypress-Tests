export function verifyListLength(expectedLength: number): void {
  cy.get('.todo-list li').should('have.length', expectedLength);
}

export function verifyNumberOfLeftItems(expectedCount: number): void {
  cy.get('.todo-count strong').should('have.text', expectedCount);
}

export function verifyPageUrl(expectedUrl: string): void {
  cy.url().should('include', expectedUrl);
}
