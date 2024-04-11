describe('ToDo MVC Tests', () => {
  const firstTask = 'This is my first task on my list';
  const secondTask = 'Second one';
  let initialListLength;

  beforeEach(() => {
    cy.visit('/');
    addTodoItem(firstTask);
    addTodoItem(secondTask);
    getInitialListLength();
  });

  //user story: Adding todo item
  it('add a new todo item to the list', () => {
    const newTodoTitle = 'This is a new todo item!';
    addTodoItem(newTodoTitle);

    cy.get('.todo-list li').should('have.length', initialListLength + 1);

    cy.get('.todo-list li').last().should('contain.text', newTodoTitle);
  });

  it('view the initial todo list', () => {
    cy.get('.todo-list li').should('have.length', initialListLength);
    cy.get('.todo-list li').first().should('contain.text', firstTask);
    cy.get('.todo-list li').last().should('contain.text', secondTask);
    verifyCountNumber(initialListLength);
  });

  //user story: view all, active and compleded todo lists
  it(`viev All todo list`, () => {
    cy.get('.filters li').then((filterList) => {
      const allFilter = filterList[0].querySelector('a');
      cy.wrap(allFilter).should('have.class', 'selected');
      verifyCountNumber(initialListLength);
    });
  });

  it('should navigate to Active todo list az view it', () => {
    cy.contains('Active').click();
    cy.url().should('include', '/#/active');

    cy.get('.todo-list li').each((todoItem) => {
      cy.wrap(todoItem).within(() => {
        cy.get('.toggle').should('not.be.checked');
      });
      verifyCountNumber(initialListLength);
    });
  });

  it('should navigate to Completed todo list and view it', () => {
    cy.contains('Completed').click();
    cy.url().should('include', '/#/completed');

    cy.get('.todo-list li').should('have.length', 0);
    cy.get('.toggle-all').click();
    cy.get('.todo-list li').should('have.length', initialListLength);
    verifyCountNumber(0);
  });

  function addTodoItem(title) {
    cy.get('.new-todo').type(`${title}{enter}`);
  }

  function getInitialListLength() {
    cy.get('.todo-list li')
      .its('length')
      .then((length) => {
        initialListLength = length;
      });
  }

  function verifyCountNumber(expectedCount) {
    cy.get('.todo-count strong').should('have.text', expectedCount);
  }
});
