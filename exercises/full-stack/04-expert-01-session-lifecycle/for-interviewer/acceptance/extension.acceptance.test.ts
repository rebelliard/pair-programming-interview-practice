import { describe, expect, it } from "vitest";
import { applyCommand } from "../../src/server/sessions/apply-command";
import {
  type Command,
  SESSION_STATUSES,
  type SessionStatus,
} from "../../src/shared/sessions";
import * as transitions from "../../src/shared/transitions";
import { accepted, rejected, sessionIn } from "../../test/fixtures";

type CanApply = (status: SessionStatus, command: Command) => boolean;

function canApply(status: SessionStatus, command: Command): boolean {
  const implementation = (
    transitions as typeof transitions & { canApply?: CanApply }
  ).canApply;

  return implementation?.(status, command) ?? false;
}

const baseCommands = [
  "start",
  "pause",
  "resume",
  "end",
  "cancel",
] as const satisfies readonly Command[];

const legalTransitions: Array<{
  from: SessionStatus;
  command: Command;
  to: SessionStatus;
}> = [
  { from: "scheduled", command: "start", to: "live" },
  { from: "scheduled", command: "cancel", to: "cancelled" },
  { from: "live", command: "pause", to: "paused" },
  { from: "live", command: "end", to: "ended" },
  { from: "live", command: "cancel", to: "cancelled" },
  { from: "paused", command: "resume", to: "live" },
  { from: "paused", command: "end", to: "ended" },
  { from: "paused", command: "cancel", to: "cancelled" },
];

const legalKeys = new Set(
  legalTransitions.map(({ from, command }) => `${from}:${command}`),
);

const illegalTransitions = SESSION_STATUSES.flatMap((from) =>
  baseCommands.map((command) => ({ from, command })),
).filter(({ from, command }) => !legalKeys.has(`${from}:${command}`));

describe("central transition legality", () => {
  it.each(legalTransitions)(
    "allows $from → $command",
    ({ from, command, to }) => {
      expect(canApply(from, command)).toBe(true);
      expect(applyCommand(sessionIn(from), command)).toEqual(accepted(to));
    },
  );

  it.each(illegalTransitions)(
    "rejects $from → $command",
    ({ from, command }) => {
      expect(canApply(from, command)).toBe(false);
      expect(applyCommand(sessionIn(from), command)).toEqual(
        rejected(from, command),
      );
    },
  );
});
