import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import { createInMemoryTransport } from "../fixtures";

afterEach(cleanup);

describe("SessionControls", () => {
  it("renders the five session command buttons", async () => {
    render(<App api={createApi(createInMemoryTransport())} />);

    expect(
      await screen.findByRole("button", { name: "Start" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "End" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("updates the status badge after a legal command", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    await screen.findByText("scheduled");

    await user.click(screen.getByRole("button", { name: "Start" }));

    expect(await screen.findByText("live")).toBeInTheDocument();
  });
});
