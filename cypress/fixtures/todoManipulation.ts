export function addTodoItem(title: string): void {
  cy.get('.new-todo').type(`${title}{enter}`);
}

export function deleteTodoItem(title: string): void {
  cy.contains('.todo-list li', title).within(() => {
    cy.get('.destroy').click({ force: true });
  });
}

export function editTitleOfATodoItem(oldTitle: string, newTitle: string): void {
  cy.contains('.todo-list li', oldTitle).dblclick();
  cy.get('.todo-list li.editing .edit').clear().type(`${newTitle}{enter}`);
}

export function setTodoComplete(title: string): void {
  cy.contains('.todo-list li', title).within(() => {
    cy.get('.toggle').click();
  });
}

export function setTodoIncomplete(title: string): void {
  cy.contains('.todo-list li.completed', title).within(() => {
    cy.get('.toggle').click();
  });
}

export function verifySelectedClass(filterName: string): void {
  cy.contains('.filters li a', filterName).should('have.class', 'selected');
}
