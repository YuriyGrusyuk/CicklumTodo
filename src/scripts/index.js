import "../styles/index.scss";
import eventFire from "./helpers/eventFire";
const getById = s => document.getElementById(s);
const qs = s => document.querySelector(s);
const qsa = s => document.querySelector(s);

const form = getById("formCreate");
const todosNode = getById("todos");
const closeModal = getById("closeModal");
const titleHandler = getById("formTitle");
const editTitle = getById("editTitle");
const editPriority = getById("editPriority");
const editDescription = getById("editDescription");
const openForm = getById("openForm");
const descriptionHandler = getById("formDescription");

const priorityHandler = getById("formPriority");
const searchTodos = getById("searchTodos");

const priorities = ["high", "normal", "low"];
const todos = [];
const filters = {
  status: "all",
  priority: "all"
};

class Todo {
  constructor(title, description, priority) {
    this.title = title.value;
    this.description = description.value;
    this.priority = priority.innerText;
    this.id = `${Date.now()}`;
    this.done = false;
  }
}

const render = () => {
  todosNode.innerHTML = "";
  todos.map(task => {
    todosNode.innerHTML += `
      <div class="col-sm-3 mb-4" id="${task.id}">
        <div class="card">
          <div class="doneSymbol"></div>
          <div class="card-body">
            <h5 class="card-title">	${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <div class="d-flex justify-content-between align-items-center w-100">
              <span class="btn btn-outline-info" data-id="${task.id}">${task.priority}</span>
              <div class="dropdown">
                <button class="btn btn-info dropdown-toggle" type="button"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" data-rel="${task.id}">
                  <a class="dropdown-item custom" href="#" data-action="done">done</a>
                  <a class="dropdown-item custom" href="#" data-action="edit">edit</a>
                  <a class="dropdown-item custom" href="#" data-action="delete">delete</a>
                </div>
              </div>
            </div>      
          </div>
        </div>
      </div>
    `;
  });
};
form.addEventListener("submit", e => {
  e.preventDefault();
  eventFire(closeModal, "click");
  const newTask = new Todo(titleHandler, descriptionHandler, priorityHandler);
  todos.push(newTask);
  render();
  customSearch("priority", filters.priority);
  [titleHandler, descriptionHandler].forEach(i => (i.value = ""));
});

const customSearch = (selector, value) => {
  filters[selector] = value;
  if (selector === "status") {
    if (value === "all") {
      todos.map(i => {
        getById(i.id).classList.remove("hidden");
        if (filters.priority !== "all") {
          if (i.priority !== filters.priority) {
            getById(i.id).classList.add("hidden");
          }
        }
      });
    } else if (value === "open") {
      todos.map(i => {
        getById(i.id).classList.remove("hidden");
        if (i.done) getById(i.id).classList.add("hidden");
        if (filters.priority !== "all") {
          if (i.priority !== filters.priority) {
            getById(i.id).classList.add("hidden");
          }
        }
      });
    } else {
      todos.map(i => {
        getById(i.id).classList.remove("hidden");
        if (!i.done) getById(i.id).classList.add("hidden");
        if (filters.priority !== "all") {
          if (i.priority !== filters.priority)
            getById(i.id).classList.add("hidden");
        }
      });
    }
  } else if (selector === "priority") {
    customSearch("status", filters.status);
    if (value === "all") return;
    todos.map(i => {
      if (i.priority === value) getById(i.id).classList.remove("hidden");
    });
  }
};
document.addEventListener("click", e => {
  if (e.target.classList.value === "dropdown-item") {
    const dropdownNode = getById(e.target.parentNode.dataset.rel);
    [e.target.innerText, dropdownNode.innerText] = [
      dropdownNode.innerText,
      e.target.innerText
    ];
    if (dropdownNode.dataset.search)
      customSearch(dropdownNode.dataset.search, dropdownNode.innerText);
  }
  const el = e.target;
  if (el.dataset.action) {
    if (el.dataset.action) {
      if (el.dataset.action === "done") {
        getById(el.parentNode.dataset.rel).classList.add("done");
        todos.map(i => {
          if (i.id === el.parentNode.dataset.rel) {
            i.done = true;
          }
        });
      }
      if (el.dataset.action === "delete") {
        for (let i in todos) {
          if (todos[i].id === el.parentNode.dataset.rel) {
            todos.splice(i, 1);
            i--;
          }
        }
        render();
      }
      if (el.dataset.action === "edit") {
        let editItem;
        for (let i in todos) {
          if (todos[i].id === el.parentNode.dataset.rel) {
            editItem = todos[i];
          }
        }
        editDescription.value = editItem.description;
        editTitle.value = editItem.title;
        getById("formEdit").classList.add("d-block");
        getById("formCreate").classList.add("d-none");
        formEdit.addEventListener("submit", e => {
          e.preventDefault();
          for (let i in todos) {
            if (todos[i].id === el.parentNode.dataset.rel) {
              let change = new Todo(editTitle, editDescription, editPriority);
              todos[i] = change;
            }
          }
          eventFire(closeModal, "click");
          render();
          [editTitle, editDescription].forEach(i => (i.value = ""));
        });
        eventFire(openForm, "click");
      }
    }
  }
});

searchTodos.addEventListener("input", e => {
  const searched = e.target.value.trim();
  todos.map(i => {
    i.title.includes(searched)
      ? getById(i.id).classList.remove("hidden")
      : getById(i.id).classList.add("hidden");
  });
});
