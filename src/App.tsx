import "./styles.css";
import { TodoList } from "./components/todolist/TodoList";

export default function App() {
  return (
    <div className="App" data-testid={"app"}>
      <h1>todos</h1>
      <TodoList />
    </div>
  );
}
