describe('ToDo MVC Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.new-todo').clear();
    cy.get('.new-todo').type('This is my first task on my list{enter}');
    cy.get('.new-todo').clear();
    cy.get('.new-todo').type('Second one{enter}');
  });
  //user story: Adding todo item
  it('add a new todo item to the list', () => {
    const newTodoTitle = 'This is a new todo item!';
    cy.get('.new-todo').clear().type(`${newTodoTitle}{enter}`);

    cy.get('.todo-list li').should('have.length', 3);

    cy.get('.todo-list li').last().should('contain.text', newTodoTitle);
  });


});
