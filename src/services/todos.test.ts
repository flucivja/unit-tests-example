import { getTodos, removeTodo, toggleCompleteTodo, addTodo } from "./todos";
import { fetch } from "../mock";

jest.mock("../mock", () => ({
  fetch: jest.fn().mockResolvedValue([]),
}));

test("getTodos", async () => {
  await getTodos();
  expect(fetch).toBeCalled();
});

test("removeTodo", async () => {
    await removeTodo('1');
    expect(fetch).toBeCalled();
});

test("toggleCompleteTodo", async () => {
    await toggleCompleteTodo('1');
    expect(fetch).toBeCalled();
});

test("addTodo", async () => {
    await addTodo('1');
    expect(fetch).toBeCalled();
});
