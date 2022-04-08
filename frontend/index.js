// ~~~~~~~~~~~~~~~~~~~~~~~API~~~~~~~~~~~~~~~~~~~~~~~
import { Api } from "./api.js";
// ~~~~~~~~~~~~~~~~~~~~~~~View~~~~~~~~~~~~~~~~~~~~~~~
const View = (() => {
  const domstr = {
    todolist_pending: ".todolist__pending",
    todolist: ".todolist",
    deletebtn: ".button__delete",
    inputbox: ".input__todo",
    todobtn: "button__todo",
  };

  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  const createTmpPending = (arr) => {
    let tmp = "";
    arr.forEach((todo) => {
      tmp += `
              <li>
                  <span>${todo.content}</span>
                  <div>
                    <button class="button__edit" id="${todo.id}">
                      <i class='fa-solid fa-edit'></i>
                    </button>
                    <button class="button__delete" id="${todo.id}">
                      <i class='far fa-trash-alt' ></i>
                    </button>
                    <button class="button__arrow" id="${todo.id}">
                      <i class='fa-solid fa-arrow-right'></i>
                    </button>
                  </div>

              </li>
          `;
    });
    return tmp;
  };
  const createTmp = (arr) => {
    let tmp = "";
    arr.forEach((todo) => {
      tmp += `
              <li>
              <button class="button__arrow" id="${todo.id}">
              <i class='fa-solid fa-arrow-left'></i>
              </button>
                  <span>${todo.content}</span>
                  <div>
                    <button class="button__edit" id="${todo.id}">
                      <i class='fa-solid fa-edit'></i>
                    </button>
                    <button class="button__delete" id="${todo.id}">
                      <i class='far fa-trash-alt' ></i>
                    </button>

                  </div>

              </li>
          `;
    });
    return tmp;
  };
  return {
    render,
    createTmp,
    createTmpPending,
    domstr,
  };
})();
// ~~~~~~~~~~~~~~~~~~~~~~~Model~~~~~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
  class Todo {
    constructor(content) {
      this.content = content;
      this.isCompleted = false;
    }
  }

  class State {
    #todolist_pending = [];
    #todolist = [];

    get todolist_pending() {
      return this.#todolist_pending;
    }
    set todolist_pending(newtodos) {
      this.#todolist_pending = [...newtodos];

      const container = document.querySelector(view.domstr.todolist_pending);
      const tmp = view.createTmpPending(this.#todolist_pending);
      if (container && tmp) view.render(container, tmp);
    }

    get todolist() {
      return this.#todolist;
    }

    set todolist(newtodos) {
      this.#todolist = [...newtodos];

      const container = document.querySelector(view.domstr.todolist);
      const tmp = view.createTmp(this.#todolist);

      if (container && tmp) view.render(container, tmp);
    }
  }

  const getTodos = api.getTodos;
  const deleteTodo = api.deleteTodo;
  const addTodo = api.addTodo;
  const editTodo = api.editTodo;

  return {
    getTodos,
    deleteTodo,
    addTodo,
    editTodo,
    State,
    Todo,
  };
})(Api, View);
// ~~~~~~~~~~~~~~~~~~~~~~~Controller~~~~~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
  const state = new model.State();

  const addTodo = () => {
    const todoButton = document.querySelector(".button__todo");
    const inputbox = document.querySelector(view.domstr.inputbox);

    //For submit button
    todoButton.addEventListener("click", (event) => {
      event.preventDefault();
      const newtodo = new model.Todo(inputbox.value);
      model.addTodo(newtodo).then((todo) => {
        state.todolist = [todo, ...state.todolist];
      });
      event.target.value = "";
    });
    //typing and pressing Enter
    inputbox.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.target.value = "";
      }
    });
  };

  const deleteTodo = () => {
    const pending = document.querySelector(view.domstr.todolist_pending);
    const completed = document.querySelector(view.domstr.todolist);

    pending.addEventListener("click", (event) => {
      if (event.target.className.includes("button__delete")) {
        state.todolist = state.todolist.filter(
          (todo) => todo.id !== event.target.id
        );
        model.deleteTodo(event.target.id);
      }
    });

    completed.addEventListener("click", (event) => {
      if (event.target.className.includes("button__delete")) {
        state.todolist = state.todolist.filter(
          (todo) => todo.id !== event.target.id
        );
        model.deleteTodo(event.target.id);
      }
    });
  };

  const moveTodo = () => {
    const pending = document.querySelector(view.domstr.todolist_pending);
    const completed = document.querySelector(view.domstr.todolist);

    //pending to complete
    pending.addEventListener("click", (event) => {
      let todo;

      if (event.target.className.includes("button__arrow")) {
        //find the list item
        todo = state.todolist_pending.find(
          (todo) => +todo.id == +event.target.id
        );

        //add to complete
        todo.isCompleted = true;
        state.todolist = [todo, ...state.todolist];

        //take out from pending
        state.todolist_pending = state.todolist_pending.filter(
          (todo) => +todo.id !== +event.target.id
        );

        // model.editTodo(todo, event.target.id);
        // model.deleteTodo(event.target.id);
      }
    });

    //complete to pending
    completed.addEventListener("click", (event) => {
      let todo;

      if (event.target.className.includes("button__arrow")) {
        //find the list item
        todo = state.todolist.find((todo) => +todo.id == +event.target.id);

        //add to complete
        todo.isCompleted = true;
        state.todolist_pending = [todo, ...state.todolist_pending];

        //take out from pending
        state.todolist = state.todolist.filter(
          (todo) => +todo.id !== +event.target.id
        );

        // model.editTodo(todo, event.target.id);
        // model.deleteTodo(event.target.id);
      }
    });
  };

  const editTodo = () => {
    //const container = document.querySelector(view.domstr.todolist_pending);
  };

  const init = () => {
    model.getTodos().then((todos) => {
      //seperate completed and pending
      let completed = [];
      let pending = [];
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].isCompleted === false) {
          pending.push(todos[i]);
        } else {
          completed.push(todos[i]);
        }
      }

      state.todolist_pending = pending;
      state.todolist = completed;
    });
  };

  const bootstrap = () => {
    init();
    deleteTodo();
    addTodo();
    editTodo();
    moveTodo();
  };

  return { bootstrap };
})(Model, View);

Controller.bootstrap();
