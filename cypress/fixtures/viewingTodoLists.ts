export function verifyTodoItemDoesNotExist(title: string): void {
  cy.get('.todo-list').should('not.contain', title);
}

export function verifyTodoItemIsCompleted(title: string): void {
  cy.contains('.todo-list li.completed', title).should('exist');
}

export function verifyTodoItem(title: string): void {
  cy.get('.todo-list').should('contain.text', title);
}

export function verifyTodoItemIsIncomplete(title: string): void {
  cy.contains('.todo-list li', title).should('exist');
  cy.contains('.todo-list li.completed', title).should('not.exist');
}

export function verifyTodoListInView(
  viewName: string,
  expectedTodoItems: string[]
): void {
  cy.contains(viewName).click();
  expectedTodoItems.forEach((todoItem) => {
    verifyTodoItem(todoItem);
  });
}

export function verifyTodoItemIsNotInSelectedList(
  viewName: string,
  notExpectedTodoItems: string[]
): void {
  cy.contains(viewName).click();
  notExpectedTodoItems.forEach((todoItem) => {
    verifyTodoItemDoesNotExist(todoItem);
  });
}
