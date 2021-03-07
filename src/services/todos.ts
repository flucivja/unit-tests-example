import { fetch } from "../mock";
import { Todo } from "../types";

export function getTodos() {
  return fetch<Todo[]>("/todos");
}

export function addTodo(todo: string) {
  return fetch("/add-todo", { method: "POST", body: todo });
}

export async function toggleCompleteTodo(todoId: string) {
  return fetch("/toggle-todo", { method: "PATCH", body: todoId });
}

export async function removeTodo(todoId: string) {
  return fetch("/remove-todo", { method: "DELETE", body: todoId });
}
