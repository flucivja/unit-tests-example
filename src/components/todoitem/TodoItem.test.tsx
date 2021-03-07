import { render, fireEvent, waitFor } from "@testing-library/react";
import { TodoItem } from "./TodoItem";
import { toggleCompleteTodo, removeTodo, getTodos } from "../../services/todos";

jest.mock("../../services/todos", () => {
    return {
        toggleCompleteTodo: jest.fn(),
        removeTodo: jest.fn()
    }
});

test("todo can be completed", async () => {
  const spy = jest.fn();
  const { getByTestId } = render(
    <TodoItem
      todo={{
        text: "some text",
        id: "1234",
        completed: true,
      }}
      onUpdate={spy}
    />
  );

  // when
  fireEvent.click(getByTestId("complete-checkbox"));

  // then
  await waitFor(() => expect(spy).toBeCalled());
  expect(toggleCompleteTodo).toBeCalled();
});

test("todo can be removed", async () => {
    const spy = jest.fn();
    const { getByTestId } = render(
        <TodoItem
            todo={{
                text: "some text",
                id: "1234",
                completed: false,
            }}
            onUpdate={spy}
        />
    );

    // when
    fireEvent.click(getByTestId("remove-btn"));

    // then
    await waitFor(() => expect(spy).toBeCalled());
    expect(removeTodo).toBeCalled();
});

test("todo is not removed when failed", async () => {
    const spy = jest.fn();
    ((removeTodo as unknown) as jest.Mock).mockImplementation(() => Promise.reject());
    const { getByTestId } = render(
        <TodoItem
            todo={{
                text: "some text",
                id: "1234",
                completed: false,
            }}
            onUpdate={spy}
        />
    );

    // when
    fireEvent.click(getByTestId("remove-btn"));

    // then
    await waitFor(() => expect(removeTodo).toBeCalled());
    expect(spy).not.toBeCalled()
});

