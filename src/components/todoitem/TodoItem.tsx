import { useState } from "react";
import { Todo } from "../../types";
import { removeTodo, toggleCompleteTodo } from "../../services/todos";

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => Promise<any>;
}

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isLoading, setLoading] = useState(false);

  async function onToggleCompleteTodo() {
    setLoading(true);
    try {
      await toggleCompleteTodo(todo.id);
      await onUpdate();
    } finally {
      setLoading(false);
    }
  }

  async function onRemoveTodo() {
    setLoading(true);
    try {
      await removeTodo(todo.id);
      await onUpdate();
    } catch {
      setLoading(false);
    }
  }

  const classnames = ["todo-item"];
  if (todo.completed) {
    classnames.push("completed");
  }

  return (
    <li className={classnames.join(" ")} data-testid={`todo-${todo.id}`}>
      <input
        data-testid={"complete-checkbox"}
        type={"checkbox"}
        onChange={onToggleCompleteTodo}
        disabled={isLoading}
        checked={todo.completed}
      />
      {todo.text}
      <button className={"remove"} onClick={onRemoveTodo} disabled={isLoading} data-testid={"remove-btn"}>
        X
      </button>
    </li>
  );
}
