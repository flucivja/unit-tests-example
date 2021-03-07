import { render, waitFor } from "@testing-library/react";
import App from "./App";
import { getTodos } from "./services/todos";

jest.mock("./services/todos", () => {
    return {
        __esModule: true,
        getTodos: jest.fn(),
    };
});

test("app is rendered", async () => {
    ((getTodos as unknown) as jest.Mock).mockImplementation(() => Promise.resolve([]));
    const { getByTestId } = render(<App />);

    await waitFor(() => expect(getTodos).toBeCalled());
    expect(getByTestId('app')).not.toBeNull();
});
