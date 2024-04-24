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
  verifySelectedClass,
} from '@fixtures/todoManipulation';

import {
  verifyListLength,
  verifyNumberOfLeftItems,
  verifyPageUrl,
} from '@fixtures/generalUtils';

import {
  verifyTodoItem,
  verifyTodoItemDoesNotExist,
  verifyTodoItemIsCompleted,
  verifyTodoItemIsIncomplete,
  verifyTodoListInView,
  verifyTodoItemIsNotInSelectedList,
} from '@fixtures/viewingTodoLists';

import {
  clearCompletedTodos,
  verifyClearCompletedButtonIsAppaered,
} from '@fixtures/clearCompletedUtils';

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
      verifyTodoItemIsNotInSelectedList(FILTER_ACTIVE, [todoTitle]);
    });

    it('deleting a completed todo item', () => {
      const todoTitle: string = testData[1];
      setTodoComplete(todoTitle);
      clearCompletedTodos();
      verifyTodoItemDoesNotExist(todoTitle);
    });
  });
});
