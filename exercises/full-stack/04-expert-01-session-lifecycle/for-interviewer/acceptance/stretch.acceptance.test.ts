import { describe, expect, it } from "vitest";
import { applyCommand } from "../../src/server/sessions/apply-command";
import {
  type Command,
  SESSION_STATUSES,
  type SessionStatus,
} from "../../src/shared/sessions";
import * as transitions from "../../src/shared/transitions";
import { accepted, rejected, sessionIn } from "../../test/fixtures";

type ExtendedCommand = Command | "reopen";
type CanApply = (status: SessionStatus, command: ExtendedCommand) => boolean;

const reopen: ExtendedCommand = "reopen";

function canApply(status: SessionStatus, command: ExtendedCommand): boolean {
  const implementation = (
    transitions as typeof transitions & { canApply?: CanApply }
  ).canApply;

  return implementation?.(status, command) ?? false;
}

describe("reopen acceptance", () => {
  it("reopens an ended session", () => {
    expect(canApply("ended", reopen)).toBe(true);
    expect(applyCommand(sessionIn("ended"), reopen as Command)).toEqual(
      accepted("live"),
    );
  });

  it.each(SESSION_STATUSES.filter((status) => status !== "ended"))(
    "rejects reopen from %s",
    (status) => {
      expect(canApply(status, reopen)).toBe(false);
      expect(applyCommand(sessionIn(status), reopen as Command)).toEqual(
        rejected(status, reopen as Command),
      );
    },
  );

  it("keeps cancel invalid from ended", () => {
    expect(applyCommand(sessionIn("ended"), "cancel")).toEqual(
      rejected("ended", "cancel"),
    );
  });
});
