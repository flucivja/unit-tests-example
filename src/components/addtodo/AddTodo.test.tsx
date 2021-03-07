import { render, fireEvent, waitFor } from "@testing-library/react";
import { AddTodo } from "./AddTodo";
import { addTodo } from "../../services/todos";

jest.mock("../../services/todos");

test("todo can be added", async () => {
  const spy = jest.fn();
  const { getByTestId } = render(<AddTodo onTodoAdded={spy} />);

  // when
  fireEvent.change(getByTestId("newtodo-input"), {
    target: { value: "some todo" },
  });
  fireEvent.submit(getByTestId("newtodo-input"));

  // then
  await waitFor(() => expect(spy).toBeCalled());
  expect(addTodo).toBeCalled();
});

test("adding empty todo does not add it", async () => {
  const spy = jest.fn();
  const { getByTestId } = render(<AddTodo onTodoAdded={spy} />);

  // when
  fireEvent.change(getByTestId("newtodo-input"), {
    target: { value: "" },
  });
  fireEvent.submit(getByTestId("newtodo-input"));

  // then
  expect(addTodo).not.toBeCalled();
});
