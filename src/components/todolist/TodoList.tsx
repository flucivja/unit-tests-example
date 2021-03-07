import { useEffect, useState, useCallback } from "react";
import { Todo } from "../../types";
import { getTodos } from "../../services/todos";
import { AddTodo } from "../addtodo/AddTodo";
import { TodoItem } from "../todoitem/TodoItem";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>();

  const loadTodos = useCallback(() => getTodos().then(setTodos), []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return (
    <ul>
      <li className={"newtodo"}>
        <AddTodo onTodoAdded={loadTodos} />
      </li>
      {todos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={loadTodos} />
      ))}
    </ul>
  );
}
