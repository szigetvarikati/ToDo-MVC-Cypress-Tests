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

  //check the initial data
  it('view the initial todo list', () => {
    verifyCountNumber(initialListLength);
    verifyTodoItem(firstTask);
    verifyTodoItem(secondTask);
    verifyListLength(initialListLength);
    verifyCountNumber(initialListLength);
  });

  //user story: Adding todo item
  it('add a new todo item to the list', () => {
    const newTodoTitle = 'This is a new todo item!';
    addTodoItem(newTodoTitle);
    verifyTodoItem(newTodoTitle);
    verifyListLength(initialListLength + 1);
    verifyCountNumber(initialListLength + 1);
  });

  //user story: view all, active and compleded todo lists
  it(`should viev All todo list`, () => {
    cy.get('.filters li').then((filterList) => {
      const allFilter = filterList[0].querySelector('a');
      cy.wrap(allFilter).should('have.class', 'selected');
      verifyPageUrl('');
      verifyCountNumber(initialListLength);
      verifySelectedClass('All');
    });
  });

  it('should navigate to Active todo list az view it', () => {
    cy.contains('Active').click();
    verifyPageUrl('/active');

    cy.get('.todo-list li').each((todoItem) => {
      cy.wrap(todoItem).within(() => {
        cy.get('.toggle').should('not.be.checked');
      });
      verifyCountNumber(initialListLength);
      verifySelectedClass('Active');
    });
  });

  it('should navigate to Completed todo list and view it', () => {
    cy.contains('Completed').click();
    verifyPageUrl('/completed');

    cy.get('.todo-list li').should('have.length', 0);
    cy.get('.toggle-all').click();
    verifyListLength(initialListLength);
    verifyCountNumber(0);
    verifySelectedClass('Completed');
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

  function verifyTodoItem(title) {
    cy.get('.todo-list').should('contain.text', title);
  }

  function verifyPageUrl(expectedUrl) {
    cy.url().should('include', expectedUrl);
  }

  function verifyListLength(expectedLength) {
    cy.get('.todo-list li').should('have.length', expectedLength);
  }

  function verifySelectedClass(filterName) {
    cy.contains('.filters li a', filterName).should('have.class', 'selected');
  }
});
