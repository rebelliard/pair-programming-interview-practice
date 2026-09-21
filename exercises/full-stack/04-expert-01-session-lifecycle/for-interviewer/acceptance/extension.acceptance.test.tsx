import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import type { ApiRequest, ApiResponse, Transport } from "../../src/shared/api";
import type { Session } from "../../src/shared/sessions";

afterEach(cleanup);

const liveSession: Session = {
  id: "ses-live",
  presentationId: "presentation-42",
  status: "live",
};

const endedSession: Session = {
  ...liveSession,
  status: "ended",
};

const pausedSession: Session = {
  ...liveSession,
  id: "ses-paused",
  status: "paused",
};

function createStaleTabTransport(): Transport {
  let loaded = false;

  return async (request: ApiRequest): Promise<ApiResponse> => {
    if (request.method === "GET" && request.path === "/sessions") {
      return {
        status: 200,
        body: { sessions: [liveSession, pausedSession] },
      };
    }

    if (request.method === "GET" && request.path === "/sessions/ses-live") {
      if (!loaded) {
        loaded = true;
        return { status: 200, body: { session: liveSession } };
      }

      return { status: 200, body: { session: endedSession } };
    }

    if (request.method === "GET" && request.path === "/sessions/ses-paused") {
      return { status: 200, body: { session: pausedSession } };
    }

    if (
      request.method === "POST" &&
      request.path === "/sessions/ses-live/commands"
    ) {
      return {
        status: 409,
        body: {
          error: {
            command: "pause",
            from: "ended",
            kind: "invalid_transition",
          },
        },
      };
    }

    return { status: 404, body: { error: "Not found" } };
  };
}

describe("stale tab recovery acceptance", () => {
  it("shows an inline alert and refreshes the badge after invalid_transition", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createStaleTabTransport())} />);
    await screen.findByText("live");

    await user.click(screen.getByRole("button", { name: "Pause" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "That action is no longer valid",
    );
    expect(await screen.findByText("ended")).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Session" }),
      "ses-paused",
    );

    expect(await screen.findByText("paused")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
