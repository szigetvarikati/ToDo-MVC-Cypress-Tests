1. **Adding Todos:**

   - Scenario 1: Adding a New Todo
     - Given a user navigates to the application's URL and wants to add a new task,
     - When the user clicks on the "What needs to be done?" input field,
     - And the input field becomes active,
     - And the user type a todo,
     - And the user press "ENTER",
     - Then the new todo item is added to the todo list.

2. **Viewing and Managing Todos:**

   - Scenario 1: Viewing Todo List

     - Given a user navigates to the application's URL,
     - When the user is on the home page,
     - Then the user sees their todo list displayed with all existing todo items,
     - And the user sees the number of active todo items displayed under the todo list,
     - And the user can filter todo items based on their status using buttons labeled "All", "Active", "Completed",
     - And the user sees their todo items categorized based on their status.

   - Scenario 2: Editing a Todo

     - Given a user navigates to the application's URL, and viewing their todo list,
     - When the user double-clicks on a todo item,
     - Then the user is able to modify the title of the todo item,
     - And the changes are saved upon submission.

   - Scenario 3: Deleting a Todo

     - Given a user navigates to the application's URL and viewing their todo list,
     - When the user clicks on the delete icon next to a todo item,
     - Then the todo item is removed from the list.

3. **Managing Todo Status:**

   - Scenario 1: Marking Todo as Completed

     - Given a user navigates to the application's URL and viewing their todo list,
     - When the user marks a todo item as completed,
     - Then the system updates the status of the todo item accordingly,
     - And the item is moved to the completed list.

   - Scenario 2: Marking Todo as Incompleted

     - Given a user navigates to the application's URL and viewing their todo list,
     - When the user unmarks a todo item as incomplete,
     - Then the system updates the status of the todo item accordingly,
     - And the item is moved to the active list.

   - Scenario 3: Deleting a Completed Todo
   
     - Given a user navigates to the application's URL and viewing their completed todo list,
     - When the user clicks the "Clear Completed" button,
     - Then the system removes the completed item permanently from the list.
