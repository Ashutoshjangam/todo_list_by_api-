const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = getTodos();
console.log(allTodos);
updateTodoList();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject = {
      todo: todoText,
      completed: false,
    };

    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}

function addTodo() {
  //code for add new todo erro in it
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject = {
      todo: todoText,
      completed: false,
      userId: 5,
    };
    fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoObject),
    })
      .then((res) => res.json())
      .then((newTodo) => {
        allTodos.push(newTodo);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
      });
  }
}

function updateTodoList() {
  todoListUL.innerHTML = "";
  allTodos.forEach((todo, todoIndex) => {
    todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

// function updateTodoList() {   //code for upadte todo but it does't work porperly
//   console.log("Updating todo list...");
//   todoListUL.innerHTML = "";
//   allTodos.forEach((todo, todoIndex) => {
//     console.log(`Creating item for todo: ${todo.text}`);
//     const todoItem = createTodoItem(todo, todoIndex);
//     todoListUL.append(todoItem);
//   });
// }

function createTodoItem(todo, todoIndex) {
  console.log("todo", todo);
  const todoId = "todo-" + todoIndex;
  const todoLI = document.createElement("li");
  const todoText = todo.todo;
  todoLI.className = "todo";
  todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
       <button class="edit-button">
             <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20.71,4.63l-1.34-1.34a1.58,1.58,0,0,0-2.22,0L14.72,5.72,18.28,9.28l2.43-2.43A1.58,1.58,0,0,0,20.71,4.63ZM3,17.25V21H6.75L17.81,9.93,14.07,6.19ZM3,15.77,12.46,6.31l3.73,3.73L6.73,19.5Z"/></svg>
        </button>
    `;
  const editButton = todoLI.querySelector(".edit-button");
  editButton.addEventListener("click", () => {
    editTodoItem(todoIndex);
  });

  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoIndex);
  });

  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });

  console.log("allTodos", allTodos);

  checkbox.checked = todo.completed;
  return todoLI;
}

function editTodoItem(todoIndex) {
  const newTodoText = prompt("Edit your todo:", allTodos[todoIndex].todo);
  if (newTodoText !== null) {
    fetch(`https://dummyjson.com/todos/${todoIndex + 1}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo: newTodoText.trim(),
      }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        allTodos[todoIndex].todo = updatedTodo.todo;
        updateTodoList();
        saveTodos();
      });
    // .catch((error) => {
    //   console.error("Error updating todo:", error);
    // });
  }
}

// function deleteTodoItem(todoIndex) {
//   allTodos = allTodos.filter((_, i) => i !== todoIndex);
//   saveTodos();
//   updateTodoList();
// }

function deleteTodoItem(todoIndex) {
  //code for delete todo from serverside
  const todo = allTodos[todoIndex];
  fetch(`https://dummyjson.com/todos/${todoIndex + 1}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      allTodos = allTodos.filter((_, i) => i !== todoIndex);
      saveTodos();
      updateTodoList();
    })
    .catch((error) => {
      console.error("Error deleting todo:", error);
    });
}

function saveTodos() {
  const todosJson = JSON.stringify(allTodos);
  localStorage.setItem("todos", todosJson);
}
function getTodos() {
  const todos = localStorage.getItem("todos") || "[]";
  // const newtodo = [...todos];
  // console.log("newtodo", newtodo);
  return JSON.parse(todos);
}

fetch("https://dummyjson.com/todos") //code for get todo
  .then((res) => res.json())
  .then((todosData) => {
    console.log(todosData.todos);
    allTodos = todosData.todos.map((todo) => ({
      ...todo,
      text: todo.todo,
    }));
    todo.todo = { todosData };
    updateTodoList();
    saveTodos();
  });
