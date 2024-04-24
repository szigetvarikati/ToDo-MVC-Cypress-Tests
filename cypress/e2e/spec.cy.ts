import {
  NEW_TODO_TITLE,
  MODIFIED_TITLE,
  FILTER_ALL,
  FILTER_ACTIVE,
  FILTER_COMPLETED,
} from '@fixtures/constants';

import {
  addTodoItem,
  deleteTodoItem,
  editTitleOfATodoItem,
  setTodoComplete,
  setTodoIncomplete,
} from '@fixtures/todoManipulation';

describe('ToDo MVC Tests', () => {
  let testData: string[];
  let initialListLength: number;

  beforeEach(() => {
    cy.fixture('testdata').then((data: string[]) => {
      testData = data;
      initialListLength = data.length;
      cy.visit('/');
      testData.forEach((task: string) => {
        addTodoItem(task);
      });
    });
  });

  //check the initial data
  describe('Initial Data', () => {
    it('view the initial todo list', () => {
      testData.forEach((task: string) => {
        verifyTodoItem(task);
      });
      verifyListLength(initialListLength);
      verifyNumberOfLeftItems(initialListLength);
    });
  });

  //user story: Adding todo item
  describe('Todo Item Manipulation', () => {
    it('add a new todo item to the list', () => {
      addTodoItem(NEW_TODO_TITLE);
      verifyTodoItem(NEW_TODO_TITLE);
      verifyListLength(initialListLength + 1);
      verifyNumberOfLeftItems(initialListLength + 1);
    });

    it('edit a title of a todo item', () => {
      editTitleOfATodoItem(testData[0], MODIFIED_TITLE);
      verifyTodoItem(MODIFIED_TITLE);
      verifyTodoItemDoesNotExist(testData[0]);
      verifyListLength(initialListLength);
      verifyNumberOfLeftItems(initialListLength);
    });

    it('delete a todo item from the list', () => {
      deleteTodoItem(testData[0]);
      verifyTodoItemDoesNotExist(testData[0]);
      verifyListLength(initialListLength - 1);
      verifyNumberOfLeftItems(initialListLength - 1);
    });
  });

  describe('Viewing Todo Lists', () => {
    //user story: view All todo list
    it(`should view All todo list`, () => {
      cy.get('.filters li').then((filterList: JQuery<HTMLElement>) => {
        const allFilter = filterList[0].querySelector('a');
        cy.wrap(allFilter).should('have.class', 'selected');
        verifyPageUrl('');
        verifyNumberOfLeftItems(initialListLength);
        verifySelectedClass(FILTER_ALL);
      });
    });

    //user story: view Active todo list
    it('should navigate to Active todo list az view it', () => {
      cy.contains('Active').click();
      verifyPageUrl('/active');

      cy.get('.todo-list li').each((todoItem: string) => {
        cy.wrap(todoItem).within(() => {
          cy.get('.toggle').should('not.be.checked');
        });
        verifyNumberOfLeftItems(initialListLength);
        verifySelectedClass(FILTER_ACTIVE);
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
      verifySelectedClass(FILTER_COMPLETED);
    });
  });

  describe('Managing Todo Status', () => {
    it('marking a todo item as completed', () => {
      const todoTitle: string = testData[0];
      setTodoComplete(todoTitle);
      verifyTodoItemIsCompleted(todoTitle);
      verifyClearCompletedButtonIsAppaered();
      verifyNumberOfLeftItems(initialListLength - 1);
      verifyTodoListInView(FILTER_COMPLETED, [`${todoTitle}`]);
    });

    it('marking a todo item as incompleted', () => {
      const todoTitle: string = testData[0];
      setTodoComplete(todoTitle);
      setTodoIncomplete(todoTitle);
      verifyTodoItemIsIncomplete(todoTitle);
    });

    it('should move completed todo to "Completed" list', () => {
      const todoTitle: string = testData[0];
      setTodoComplete(todoTitle);
      verifyTodoListInView(FILTER_COMPLETED, [todoTitle]);
      verifyTodoListInView(FILTER_ALL, [todoTitle]);
      verifyTodoListNotInView(FILTER_ACTIVE, [todoTitle]);
    });

    it('deleting a completed todo item', () => {
      const todoTitle: string = testData[1];
      setTodoComplete(todoTitle);
      clearCompletedTodos();
      verifyTodoItemDoesNotExist(todoTitle);
    });
  });

  //helper functions
  function clearCompletedTodos() {
    cy.contains('Clear completed').click();
  }

  function verifyNumberOfLeftItems(expectedCount: number) {
    cy.get('.todo-count strong').should('have.text', expectedCount);
  }

  function verifyTodoItem(title: string) {
    cy.get('.todo-list').should('contain.text', title);
  }

  function verifyPageUrl(expectedUrl: string) {
    cy.url().should('include', expectedUrl);
  }

  function verifyListLength(expectedLength: number) {
    cy.get('.todo-list li').should('have.length', expectedLength);
  }

  function verifySelectedClass(filterName: string) {
    cy.contains('.filters li a', filterName).should('have.class', 'selected');
  }

  function verifyTodoItemDoesNotExist(title: string) {
    cy.get('.todo-list').should('not.contain', title);
  }

  function verifyTodoItemIsCompleted(title: string) {
    cy.contains('.todo-list li.completed', title).should('exist');
  }

  function verifyTodoItemIsIncomplete(title: string) {
    cy.contains('.todo-list li', title).should('exist');
    cy.contains('.todo-list li.completed', title).should('not.exist');
  }

  function verifyTodoListInView(viewName: string, expectedTodoItems: string[]) {
    cy.contains(viewName).click();
    expectedTodoItems.forEach((todoItem) => {
      verifyTodoItem(todoItem);
    });
  }

  function verifyTodoListNotInView(
    viewName: string,
    notExpectedTodoItems: string[]
  ) {
    cy.contains(viewName).click();
    notExpectedTodoItems.forEach((todoItem) => {
      verifyTodoItemDoesNotExist(todoItem);
    });
  }

  function verifyClearCompletedButtonIsAppaered() {
    cy.contains('Clear completed').should('be.visible');
  }
});
