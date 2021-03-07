import { fireEvent, render, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { TodoList } from "./TodoList";
import { fetch } from "../../mock";
import { Todo } from "../../types";

jest.mock("../../mock", () => ({ fetch: jest.fn() }));

const mockedFetch = (fetch as unknown) as jest.Mock;

beforeEach(() => {
  const todos: Todo[] = [
    { id: "1", text: "todo", completed: false },
    { id: "2", text: "completed", completed: true },
  ];
  mockedFetch.mockImplementation((url: string, options?: { body: string }) => {
    const { body } = options || {};
    switch (url) {
      case "/todos":
        return Promise.resolve([...todos]);
      case "/add-todo":
        todos.unshift({ id: "3", text: body!, completed: false });
        return Promise.resolve();
      case "/toggle-todo":
        todos.find((todo) => todo.id === body)!.completed = true;
        return Promise.resolve();
      case "/remove-todo":
        todos.splice(
          todos.findIndex((todo) => todo.id === body),
          1
        );
        return Promise.resolve();
    }
  });
});

test("todos are displayed with correct states", async () => {
  const { getByText, getAllByTestId, findByTestId } = render(<TodoList />);

  // given
  await findByTestId("todo-1");

  // then
  expect(getByText("todo")).not.toBeNull();
  expect(getByText("completed")).not.toBeNull();

  expect((getAllByTestId("complete-checkbox")[0] as HTMLInputElement).checked).toBe(false);
  expect((getAllByTestId("complete-checkbox")[1] as HTMLInputElement).checked).toBe(true);
});

test("empty todo is not added", async () => {
  const { getByTestId } = render(<TodoList />);

  // when
  fireEvent.change(getByTestId("newtodo-input"), {
    target: { value: "" },
  });
  fireEvent.submit(getByTestId("newtodo-input"));

  // then
  await waitFor(() => expect(mockedFetch).not.toBeCalledWith("/add-todo"));
});

test("new todo can be added", async () => {
  const { getByTestId, findByTestId, getAllByTestId } = render(<TodoList />);

  // given
  await findByTestId("todo-1");

  // when
  fireEvent.change(getByTestId("newtodo-input"), {
    target: { value: "some todo" },
  });
  fireEvent.submit(getByTestId("newtodo-input"));

  // then
  await findByTestId("todo-3");
  expect((getAllByTestId("complete-checkbox")[0] as HTMLInputElement).checked).toBe(false);
});

test("todo can be completed", async () => {
  const { getAllByTestId, findByTestId } = render(<TodoList />);
  // given
  await findByTestId("todo-1");
  expect((getAllByTestId("complete-checkbox")[0] as HTMLInputElement).checked).toBe(false);

  // when
  fireEvent.click(getAllByTestId("complete-checkbox")[0]);

  // then
  await waitFor(() => (getAllByTestId("complete-checkbox")[0] as HTMLInputElement).checked);
  await waitFor(() => !(getAllByTestId("complete-checkbox")[0] as HTMLInputElement).disabled);
  expect((getAllByTestId("complete-checkbox")[0] as HTMLInputElement).checked).toBe(true);
});

test("todo can be removed", async () => {
  const { getAllByTestId, findByTestId, queryByTestId } = render(<TodoList />);

  // given
  await findByTestId("todo-1");

  // when
  fireEvent.click(getAllByTestId("remove-btn")[0]);

  // then
  await waitForElementToBeRemoved(() => queryByTestId("todo-1"));
});

test("todo is not removed when failed", async () => {
  const { getAllByTestId, findByTestId, queryByTestId } = render(<TodoList />);

  // given
  await findByTestId("todo-1");

  // when
  mockedFetch.mockImplementationOnce(() => Promise.reject());
  fireEvent.click(getAllByTestId("remove-btn")[0]);

  // then
  expect(await findByTestId("todo-1")).not.toBeNull();
});
