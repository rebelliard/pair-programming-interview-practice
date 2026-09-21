import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import { createInMemoryTransport } from "../../test/fixtures";

afterEach(cleanup);

describe("extension acceptance: resolved visibility UI", () => {
  it("includes resolved tickets when Include resolved is checked", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    await screen.findAllByRole("cell", { name: "ticket-2" });

    const checkbox = screen.getByRole("checkbox", {
      name: /Include resolved/,
    });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    const queue = screen.getByRole("region", { name: "Priority queue" });
    expect(
      await within(queue).findByRole("cell", {
        name: "Reset an archived workspace",
      }),
    ).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });
});
