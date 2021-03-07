import { ChangeEvent, FormEvent, useState, useRef, useEffect } from "react";
import { addTodo } from "../../services/todos";

interface AddTodoProps {
  onTodoAdded: () => Promise<any>;
}

export function AddTodo({ onTodoAdded }: AddTodoProps) {
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onNewTodoFormSubmit(evt: FormEvent) {
    evt.preventDefault();

    if (newTodo) {
      setLoading(true);
      try {
        await addTodo(newTodo);
        await onTodoAdded();
        setNewTodo("");
      } finally {
        setLoading(false);
      }
    }
  }

  function onTodoChange(evt: ChangeEvent<HTMLInputElement>) {
    setNewTodo(evt.target.value);
  }

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [inputRef, isLoading]);

  return (
    <form onSubmit={onNewTodoFormSubmit}>
      <input
        data-testid={"newtodo-input"}
        ref={inputRef}
        autoFocus={true}
        name={"newtodo"}
        type={"text"}
        placeholder={"add new todo"}
        value={newTodo}
        onChange={onTodoChange}
        disabled={isLoading}
      />
    </form>
  );
}
