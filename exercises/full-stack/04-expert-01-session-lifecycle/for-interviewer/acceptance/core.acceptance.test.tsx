import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import { createInMemoryTransport } from "../../test/fixtures";

afterEach(cleanup);

describe("resume control acceptance", () => {
  it("disables Resume for scheduled and live, and enables it for paused", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    expect(
      await screen.findByRole("button", { name: "Resume" }),
    ).toBeDisabled();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Session" }),
      "ses-live",
    );
    await screen.findByText("live");
    expect(screen.getByRole("button", { name: "Resume" })).toBeDisabled();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Session" }),
      "ses-paused",
    );
    await screen.findByText("paused");
    expect(screen.getByRole("button", { name: "Resume" })).toBeEnabled();
  });
});
