import { render, waitFor } from "@testing-library/react";
import { TodoList } from "./TodoList";
import { getTodos } from "../../services/todos";

jest.mock("../../services/todos", () => {
  return {
    __esModule: true,
    getTodos: jest.fn(),
  };
});

test("todos are loaded correctly", async () => {
  ((getTodos as unknown) as jest.Mock).mockImplementation(() => Promise.resolve([{ id: "123" }]));
  render(<TodoList />);

  await waitFor(() => expect(getTodos).toBeCalled());
});
