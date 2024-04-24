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
  describe('Initial Data', () => {
    it('view the initial todo list', () => {
      verifyNumberOfLeftItems(initialListLength);
      verifyTodoItem(firstTask);
      verifyTodoItem(secondTask);
      verifyListLength(initialListLength);
      verifyNumberOfLeftItems(initialListLength);
    });
  });

  //user story: Adding todo item
  describe('Todo Item Manipulation', () => {
    it('add a new todo item to the list', () => {
      const newTodoTitle = 'This is a new todo item!';
      addTodoItem(newTodoTitle);
      verifyTodoItem(newTodoTitle);
      verifyListLength(initialListLength + 1);
      verifyNumberOfLeftItems(initialListLength + 1);
    });

    it('edit a title of a todo item', () => {
      const newTitle = 'This is the modified title';
      editTitleOfATodoItem(firstTask, newTitle);
      verifyTodoItem(newTitle);
      verifyTodoItemDoesNotExist(firstTask);
      verifyListLength(initialListLength);
      verifyNumberOfLeftItems(initialListLength);
    });

    it('delete a todo item from the list', () => {
      deleteTodoItem(firstTask);
      verifyTodoItemDoesNotExist(firstTask);
      verifyListLength(initialListLength - 1);
      verifyNumberOfLeftItems(initialListLength - 1);
    });
  });

  describe('Viewing Todo Lists', () => {
    //user story: view All todo list
    it(`should viev All todo list`, () => {
      cy.get('.filters li').then((filterList) => {
        const allFilter = filterList[0].querySelector('a');
        cy.wrap(allFilter).should('have.class', 'selected');
        verifyPageUrl('');
        verifyNumberOfLeftItems(initialListLength);
        verifySelectedClass('All');
      });
    });

    //user story: view Active todo list
    it('should navigate to Active todo list az view it', () => {
      cy.contains('Active').click();
      verifyPageUrl('/active');

      cy.get('.todo-list li').each((todoItem) => {
        cy.wrap(todoItem).within(() => {
          cy.get('.toggle').should('not.be.checked');
        });
        verifyNumberOfLeftItems(initialListLength);
        verifySelectedClass('Active');
      });
    });

    //user story: view Completed todo list
    it('should navigate to Completed todo list and view it', () => {
      cy.contains('Completed').click();
      verifyPageUrl('/completed');
      cy.get('.todo-list li').should('have.length', 0);

      //should be an other test for managing todo status user story
      cy.get('.toggle-all').click();
      verifyListLength(initialListLength);
      verifyNumberOfLeftItems(0);
      verifySelectedClass('Completed');
    });
  });

  describe('Managing Todo Status', () => {
    it('marking a todo item as completed', () => {
      const todoTitle = firstTask;
      setTodoComplete(todoTitle);
      verifyTodoItemIsCompleted(todoTitle);
      verifyNumberOfLeftItems(initialListLength - 1);
      verifyTodoListInView('Completed', [`${todoTitle}`]);
    });

    it('marking a todo item as incompleted', () => {
      const todoTitle = firstTask;
      setTodoComplete(todoTitle);
      setTodoIncomplete(todoTitle);
      verifyTodoItemIsIncomplete(todoTitle);
    });

    it('should move completed todo to "Completed" list', () => {
      const todoTitle = firstTask;
      setTodoComplete(todoTitle);
      verifyTodoListInView('Completed', [todoTitle]);
      verifyTodoListInView('All', [todoTitle]);
      verifyTodoListNotInView('Active', [todoTitle]);
    });

    it('deleting a completed todo item', () => {
      const todoTitle = secondTask;
      setTodoComplete(todoTitle);
      clearCompletedTodos();
      verifyTodoItemDoesNotExist(todoTitle);
    });
  });

  //helper functions
  function addTodoItem(title) {
    cy.get('.new-todo').type(`${title}{enter}`);
  }

  function deleteTodoItem(title) {
    cy.contains('.todo-list li', title).within(() => {
      cy.get('.destroy').click({ force: true });
    });
  }

  function getInitialListLength() {
    cy.get('.todo-list li')
      .its('length')
      .then((length) => {
        initialListLength = length;
      });
  }

  function editTitleOfATodoItem(oldTitle, newTitle) {
    cy.contains('.todo-list li', oldTitle).dblclick();
    cy.get('.todo-list li.editing .edit').clear().type(`${newTitle}{enter}`);
  }

  function setTodoComplete(title) {
    cy.contains('.todo-list li', title).within(() => {
      cy.get('.toggle').click();
    });
  }

  function setTodoIncomplete(title) {
    cy.contains('.todo-list li.completed', title).within(() => {
      cy.get('.toggle').click();
    });
  }

  function clearCompletedTodos() {
    cy.contains('Clear completed').click();
  }

  function verifyNumberOfLeftItems(expectedCount) {
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

  function verifyTodoItemDoesNotExist(title) {
    cy.get('.todo-list').should('not.contain', title);
  }

  function verifyTodoItemIsCompleted(title) {
    cy.contains('.todo-list li.completed', title).should('exist');
  }

  function verifyTodoItemIsIncomplete(title) {
    cy.contains('.todo-list li', title).should('exist');
    cy.contains('.todo-list li.completed', title).should('not.exist');
  }

  function verifyTodoListInView(viewName, expectedTodoItems) {
    cy.contains(viewName).click();
    expectedTodoItems.forEach((todoItem) => {
      verifyTodoItem(todoItem);
    });
  }

  function verifyTodoListNotInView(viewName, notExpectedTodoItems) {
    cy.contains(viewName).click();
    notExpectedTodoItems.forEach((todoItem) => {
      verifyTodoItemDoesNotExist(todoItem);
    });
  }
});
