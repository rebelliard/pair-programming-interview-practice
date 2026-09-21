import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import type { Transport } from "../../src/shared/api";
import { createInMemoryTransport } from "../../test/fixtures";

afterEach(cleanup);

describe("invitation core acceptance UI", () => {
  it("disables while pending and appends a successful invitation", async () => {
    const user = userEvent.setup();
    const inMemoryTransport = createInMemoryTransport();
    let releaseRequest: (() => void) | undefined;
    const transport: Transport = async (request) => {
      if (request.method !== "POST") {
        return inMemoryTransport(request);
      }

      return new Promise((resolve) => {
        releaseRequest = () => {
          void inMemoryTransport(request).then(resolve);
        };
      });
    };

    render(<App api={createApi(transport)} />);
    await screen.findByRole("cell", { name: "pending@acme.test" });

    const input = screen.getByRole("textbox", { name: "Email" });
    const submit = screen.getByRole("button", { name: "Send invite" });
    await user.type(input, "new@acme.test");
    await user.click(submit);

    await waitFor(() => {
      expect(submit).toBeDisabled();
    });
    releaseRequest?.();
    expect(
      await within(
        screen.getByRole("region", { name: "Invitations" }),
      ).findByRole("cell", { name: "new@acme.test" }),
    ).toBeInTheDocument();
  });

  it("shows an error and keeps the input value for a rejected invitation", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    await screen.findByRole("cell", { name: "dev@acme.test" });

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.type(input, "dev@acme.test");
    await user.click(screen.getByRole("button", { name: "Send invite" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "already a member",
    );
    expect(input).toHaveValue("dev@acme.test");
    expect(
      within(screen.getByRole("region", { name: "Invitations" })).queryByRole(
        "cell",
        { name: "dev@acme.test" },
      ),
    ).not.toBeInTheDocument();
  });
});
