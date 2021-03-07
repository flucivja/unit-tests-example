import { Todo } from "./types";

const data: Todo[] = [];

export function fetch<T extends any>(url: string, options?: { method?: string; body?: string }): Promise<T> {
  const { body } = options || {};
  switch (url) {
    case "/todos":
      return getTodos() as Promise<T>;
    case "/add-todo":
      return addTodo(body!) as Promise<T>;
    case "/remove-todo":
      return removeTodo(body!) as Promise<T>;
    case "/toggle-todo":
      return toggleCompleteTodo(body!) as Promise<T>;
    default:
      return Promise.reject();
  }
}

function uuidv4() {
  return (String([1e7]) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
  );
}

async function getTodoOrFail(todoId: string): Promise<Todo> {
  const todo = data.find((it) => it.id === todoId);
  if (!todo) {
    return Promise.reject();
  }
  return Promise.resolve(todo);
}

function getTodos() {
  return Promise.resolve([...data]);
}

function addTodo(todo: string) {
  data.unshift({
    id: uuidv4(),
    text: todo,
    completed: false,
  });
  return Promise.resolve();
}

async function toggleCompleteTodo(todoId: string) {
  const todo = await getTodoOrFail(todoId);
  todo.completed = !todo.completed;
  return Promise.resolve(todo);
}

function removeTodo(todoId: string) {
  const index = data.findIndex((it) => it.id === todoId);
  if (index === -1) {
    return Promise.reject();
  }
  data.splice(index, 1);
  return Promise.resolve();
}
