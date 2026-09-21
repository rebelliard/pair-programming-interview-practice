import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import { createInMemoryTransport } from "../../test/fixtures";

afterEach(cleanup);

describe("reopen control acceptance", () => {
  it("enables Reopen only for an ended session", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    await screen.findByRole("combobox", { name: "Session" });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Session" }),
      "ses-ended",
    );
    await screen.findByText("ended");
    expect(screen.getByRole("button", { name: "Reopen" })).toBeEnabled();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Session" }),
      "ses-live",
    );
    await screen.findByText("live");
    expect(screen.getByRole("button", { name: "Reopen" })).toBeDisabled();
  });
});
