#!/usr/bin/env node
// Session clock for the /practice-exercise profiles.
// Synthesizes a `tick` gate every 10 minutes (elapsed + remaining).
// State lives outside the repository (os.tmpdir()/practice-exercise) so a
// session survives agent turns, interruptions, and editor restarts.
// Node built-ins only; no dependencies.

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

process.stdout.on("error", (error) => {
  if (error.code === "EPIPE") {
    process.exit(0);
  }

  throw error;
});

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillsDir = resolve(scriptDir, "..", "..");
const stateDir =
  process.env.PRACTICE_EXERCISE_DIR ?? join(tmpdir(), "practice-exercise");

const USAGE = `Usage: practice-timer.mjs <command> [--exercise <n>] [options]

Commands
  list                                     List and validate exercise profiles
  start   [--force] [--offset-seconds N]   Start the clock for the exercise
  status                                   Print the clock, due gates, and what is behind
  wait    [--max-seconds N]                Sleep until the next gate or 10-minute mark (default max 90 s), then print status
  pause                                    Freeze elapsed time and gate releases
  resume                                   Continue a paused clock
  fire    --gate <id>                      Record that a gate's content was posted
  met     --gate <id> [text]               Record that a checkpoint's expectation was met
  note    [--kind K] [--gate id] [--level n] <text>
                                           Append a timestamped note (kinds: transition, question,
                                           clarification, hint, ai, coaching, handoff, other)
  log                                      Print the session log
  stop                                     Stop the clock and print a summary
  reset   --force                          Delete the state and log for the exercise

Environment
  PRACTICE_EXERCISE_DIR   Override the state directory (default: <tmpdir>/practice-exercise)
`;

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  const positional = [];

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];

    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = rest[index + 1];

    if (next === undefined || next.startsWith("--")) {
      options[key] = true;
    } else {
      options[key] = next;
      index += 1;
    }
  }

  return { command, options, text: positional.join(" ") };
}

function parseClock(value) {
  if (typeof value === "number") {
    return value;
  }

  const match = /^(\d+):(\d{2})$/.exec(String(value).trim());

  if (!match) {
    fail(`Invalid clock value "${value}"; expected mm:ss`);
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function formatClock(totalSeconds) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function paths(exercise) {
  return {
    state: join(stateDir, `exercise-${exercise}.json`),
    log: join(stateDir, `exercise-${exercise}.log`),
    schedule: join(
      skillsDir,
      "practice-exercise",
      "exercises",
      String(exercise),
      "schedule.json",
    ),
  };
}

function profileDirectory() {
  return join(skillsDir, "practice-exercise", "exercises");
}

function loadProfiles() {
  const profiles = [];
  const ids = new Set();
  const warmups = new Map();

  for (const directory of readdirSync(profileDirectory(), {
    withFileTypes: true,
  })) {
    if (!directory.isDirectory() || !/^\d+$/.test(directory.name)) {
      continue;
    }

    const id = Number(directory.name);
    const schedulePath = join(
      profileDirectory(),
      directory.name,
      "schedule.json",
    );

    if (!existsSync(schedulePath)) {
      fail(`Profile ${id} has no schedule at ${schedulePath}`);
    }

    const schedule = JSON.parse(readFileSync(schedulePath, "utf8"));
    const required = ["title", "surface", "kind", "difficulty"];

    for (const field of required) {
      if (typeof schedule[field] !== "string" || schedule[field] === "") {
        fail(`Profile ${id} is missing required "${field}" metadata`);
      }
    }

    if (!["warm-up", "live"].includes(schedule.kind)) {
      fail(`Profile ${id} has invalid kind "${schedule.kind}"`);
    }

    if (ids.has(id) || schedule.exercise !== id) {
      fail(`Profile ${id} has a duplicate or mismatched exercise ID`);
    }

    ids.add(id);

    if (schedule.kind === "warm-up") {
      if (warmups.has(schedule.surface)) {
        fail(`Surface "${schedule.surface}" has more than one warm-up`);
      }

      warmups.set(schedule.surface, id);
    }

    profiles.push({
      difficulty: schedule.difficulty,
      durationMinutes: schedule.durationMinutes ?? 50,
      id,
      kind: schedule.kind,
      surface: schedule.surface,
      title: schedule.title,
    });
  }

  return profiles.sort((left, right) => left.id - right.id);
}

function listProfiles() {
  const profiles = loadProfiles();
  let currentSurface = null;

  for (const profile of profiles) {
    if (profile.surface !== currentSurface) {
      currentSurface = profile.surface;
      process.stdout.write(`\n${currentSurface}\n`);
    }

    process.stdout.write(
      `${profile.id} · ${profile.surface} · ${profile.kind} · ${profile.difficulty} · ${profile.title} · ${profile.durationMinutes} minutes\n`,
    );
  }
}

function loadSchedule(exercise) {
  const { schedule } = paths(exercise);

  if (!existsSync(schedule)) {
    fail(`No schedule for exercise ${exercise} at ${schedule}`);
  }

  const parsed = JSON.parse(readFileSync(schedule, "utf8"));
  const durationSeconds = (parsed.durationMinutes ?? 50) * 60;
  const tickMinutes = parsed.tickMinutes ?? 10;
  const tickIntervalSeconds = tickMinutes * 60;
  const tickGates = [];

  if (tickIntervalSeconds > 0) {
    for (
      let atSeconds = tickIntervalSeconds;
      atSeconds < durationSeconds;
      atSeconds += tickIntervalSeconds
    ) {
      const minutes = atSeconds / 60;
      tickGates.push({
        id: `tick-${minutes}`,
        at: formatClock(atSeconds),
        kind: "tick",
        title: `${minutes} minutes in`,
      });
    }
  }

  const knownIds = new Set(parsed.gates.map((gate) => gate.id));

  for (const tick of tickGates) {
    if (knownIds.has(tick.id)) {
      fail(
        `Schedule already has a gate id "${tick.id}"; rename it or set tickMinutes to 0`,
      );
    }
  }

  const gates = [...parsed.gates, ...tickGates]
    .map((gate) => ({ ...gate, atSeconds: parseClock(gate.at) }))
    .sort((left, right) => left.atSeconds - right.atSeconds);
  const rules = (parsed.rules ?? []).map((rule) => ({
    ...rule,
    beforeSeconds: parseClock(rule.before),
  }));

  return {
    durationSeconds,
    tickMinutes,
    gates,
    rules,
  };
}

function loadState(exercise) {
  const { state } = paths(exercise);

  if (!existsSync(state)) {
    return null;
  }

  return JSON.parse(readFileSync(state, "utf8"));
}

function saveState(exercise, state) {
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(paths(exercise).state, `${JSON.stringify(state, null, 2)}\n`);
}

function elapsedSeconds(state, now = Date.now()) {
  const end = state.stoppedAt ?? state.pausedAt ?? now;
  const pausedMilliseconds = state.pausedMilliseconds ?? 0;

  return (
    Math.floor((end - state.startedAt - pausedMilliseconds) / 1000) +
    (state.offsetSeconds ?? 0)
  );
}

function appendLog(exercise, state, line) {
  mkdirSync(stateDir, { recursive: true });
  const stamp = formatClock(elapsedSeconds(state));
  appendFileSync(paths(exercise).log, `[${stamp}] ${line}\n`);
}

function buildStatus(exercise, state, schedule) {
  const elapsed = elapsedSeconds(state);
  const remaining = Math.max(0, schedule.durationSeconds - elapsed);
  const fired = state.fired ?? {};
  const met = state.met ?? {};

  const describe = (gate) => ({
    id: gate.id,
    at: gate.at,
    kind: gate.kind,
    title: gate.title,
    ...(gate.expect ? { expect: gate.expect } : {}),
    ...(gate.verify ? { verify: gate.verify } : {}),
    ...(gate.requires
      ? { requires: gate.requires, requirementMet: Boolean(met[gate.requires]) }
      : {}),
  });

  const due = schedule.gates
    .filter((gate) => gate.atSeconds <= elapsed && !fired[gate.id])
    .map(describe);
  const nextGate = schedule.gates.find((gate) => gate.atSeconds > elapsed);
  const behind = schedule.gates
    .filter(
      (gate) =>
        gate.kind === "checkpoint" &&
        gate.atSeconds <= elapsed &&
        fired[gate.id] &&
        !met[gate.id],
    )
    .map((gate) => ({
      id: gate.id,
      at: gate.at,
      title: gate.title,
      expect: gate.expect,
      overdueBy: formatClock(elapsed - gate.atSeconds),
    }));
  const rules = schedule.rules.map((rule) => ({
    id: rule.id,
    title: rule.title,
    before: rule.before,
    requires: rule.requires,
    open: elapsed < rule.beforeSeconds && Boolean(met[rule.requires]),
  }));

  let sessionState = "running";

  if (state.stoppedAt) {
    sessionState = "stopped";
  } else if (state.pausedAt) {
    sessionState = "paused";
  } else if (elapsed >= schedule.durationSeconds) {
    sessionState = "finished";
  }

  return {
    exercise,
    state: sessionState,
    elapsed: formatClock(elapsed),
    elapsedSeconds: elapsed,
    remaining: formatClock(remaining),
    due,
    behind,
    next: nextGate
      ? {
          id: nextGate.id,
          at: nextGate.at,
          title: nextGate.title,
          inSeconds: nextGate.atSeconds - elapsed,
        }
      : null,
    rules,
    fired: Object.keys(fired),
    met: Object.keys(met),
  };
}

function printStatus(status) {
  const dueText = status.due.length
    ? status.due.map((gate) => gate.id).join(", ")
    : "none";
  const behindText = status.behind.length
    ? status.behind.map((gate) => `${gate.id} (+${gate.overdueBy})`).join(", ")
    : "none";
  const nextText = status.next
    ? `${status.next.id} in ${formatClock(status.next.inSeconds)}`
    : "none";

  process.stdout.write(
    `⏱️ ${status.elapsed} elapsed · ${status.remaining} left · ${status.state} · due: ${dueText} · behind: ${behindText} · next: ${nextText}\n`,
  );
  process.stdout.write(`${JSON.stringify(status, null, 2)}\n`);
}

function requireState(exercise) {
  const state = loadState(exercise);

  if (!state) {
    fail(
      `No session for exercise ${exercise}. Run: practice-timer.mjs start --exercise ${exercise}`,
    );
  }

  return state;
}

function requireGate(schedule, gateId) {
  if (!gateId || gateId === true) {
    fail("Missing --gate <id>");
  }

  const gate = schedule.gates.find((candidate) => candidate.id === gateId);

  if (!gate) {
    const known = schedule.gates.map((candidate) => candidate.id).join(", ");
    fail(`Unknown gate "${gateId}". Known gates: ${known}`);
  }

  return gate;
}

async function main() {
  const { command, options, text } = parseArgs(process.argv.slice(2));

  if (!command || command === "help" || options.help) {
    process.stdout.write(USAGE);
    return;
  }

  if (command === "list") {
    listProfiles();
    return;
  }

  const rawExercise = options.exercise;
  const exercise =
    typeof rawExercise === "string" && /^\d+$/.test(rawExercise)
      ? Number(rawExercise)
      : Number.NaN;

  if (!Number.isInteger(exercise)) {
    fail("Missing or invalid --exercise <n>");
  }

  const schedule = loadSchedule(exercise);

  switch (command) {
    case "start": {
      const existing = loadState(exercise);

      if (existing && !existing.stoppedAt && !options.force) {
        process.stdout.write(
          `A session for exercise ${exercise} is already running. Use --force to restart it, or status to continue.\n`,
        );
        printStatus(buildStatus(exercise, existing, schedule));
        return;
      }

      if (existing) {
        rmSync(paths(exercise).log, { force: true });
      }

      const offsetSeconds = options["offset-seconds"]
        ? Number(options["offset-seconds"])
        : 0;
      const state = {
        exercise,
        startedAt: Date.now(),
        offsetSeconds,
        pausedAt: null,
        pausedMilliseconds: 0,
        stoppedAt: null,
        fired: {},
        met: {},
      };

      saveState(exercise, state);
      appendLog(
        exercise,
        state,
        `start exercise ${exercise} (${schedule.durationSeconds / 60} minutes)`,
      );
      printStatus(buildStatus(exercise, state, schedule));
      return;
    }

    case "status": {
      const state = requireState(exercise);
      printStatus(buildStatus(exercise, state, schedule));
      return;
    }

    case "wait": {
      const state = requireState(exercise);
      const maxSeconds = options["max-seconds"]
        ? Number(options["max-seconds"])
        : 90;
      const before = buildStatus(exercise, state, schedule);

      if (before.state !== "running" || before.due.length > 0) {
        printStatus(before);
        return;
      }

      const untilNext = before.next
        ? before.next.inSeconds
        : Number.POSITIVE_INFINITY;
      const untilEnd = schedule.durationSeconds - before.elapsedSeconds;
      const seconds = Math.max(1, Math.min(maxSeconds, untilNext, untilEnd));

      await sleep(seconds * 1000);
      printStatus(buildStatus(exercise, requireState(exercise), schedule));
      return;
    }

    case "pause": {
      const state = requireState(exercise);
      const status = buildStatus(exercise, state, schedule);

      if (state.stoppedAt) {
        fail(`Exercise ${exercise} is already stopped`);
      }

      if (status.state === "finished") {
        fail(`Exercise ${exercise} has already reached its time limit`);
      }

      if (state.pausedAt) {
        process.stdout.write(`Exercise ${exercise} is already paused.\n`);
        printStatus(buildStatus(exercise, state, schedule));
        return;
      }

      state.pausedAt = Date.now();
      saveState(exercise, state);
      appendLog(exercise, state, "pause");
      printStatus(buildStatus(exercise, state, schedule));
      return;
    }

    case "resume": {
      const state = requireState(exercise);

      if (state.stoppedAt) {
        fail(`Exercise ${exercise} is already stopped`);
      }

      if (!state.pausedAt) {
        process.stdout.write(`Exercise ${exercise} is not paused.\n`);
        printStatus(buildStatus(exercise, state, schedule));
        return;
      }

      const pausedAt = state.pausedAt;
      const breakMilliseconds = Date.now() - pausedAt;
      state.pausedMilliseconds =
        (state.pausedMilliseconds ?? 0) + breakMilliseconds;
      state.pausedAt = null;
      saveState(exercise, state);
      appendLog(
        exercise,
        state,
        `resume after ${formatClock(breakMilliseconds / 1000)} break`,
      );
      printStatus(buildStatus(exercise, state, schedule));
      return;
    }

    case "fire": {
      const state = requireState(exercise);

      if (state.pausedAt) {
        fail(`Exercise ${exercise} is paused; resume before firing gates`);
      }

      const gate = requireGate(schedule, options.gate);

      state.fired[gate.id] = Date.now();
      saveState(exercise, state);
      appendLog(exercise, state, `fire ${gate.id} — ${gate.title}`);
      printStatus(buildStatus(exercise, state, schedule));
      return;
    }

    case "met": {
      const state = requireState(exercise);

      if (state.pausedAt) {
        fail(
          `Exercise ${exercise} is paused; resume before recording checkpoints`,
        );
      }

      const gate = requireGate(schedule, options.gate);

      state.met[gate.id] = Date.now();
      saveState(exercise, state);
      appendLog(exercise, state, `met ${gate.id}${text ? ` — ${text}` : ""}`);
      printStatus(buildStatus(exercise, state, schedule));
      return;
    }

    case "note": {
      const state = requireState(exercise);
      const kind = typeof options.kind === "string" ? options.kind : "other";
      const details = [];

      if (typeof options.gate === "string") {
        details.push(`gate=${options.gate}`);
      }

      if (options.level !== undefined) {
        details.push(`level=${options.level}`);
      }

      if (!text) {
        fail("A note needs text");
      }

      appendLog(
        exercise,
        state,
        `note(${kind}${details.length ? `; ${details.join(", ")}` : ""}) ${text}`,
      );
      process.stdout.write("noted\n");
      return;
    }

    case "log": {
      requireState(exercise);
      const { log } = paths(exercise);
      process.stdout.write(
        existsSync(log) ? readFileSync(log, "utf8") : "(empty log)\n",
      );
      return;
    }

    case "stop": {
      const state = requireState(exercise);

      if (!state.stoppedAt) {
        state.stoppedAt = state.pausedAt ?? Date.now();
        state.pausedAt = null;
        saveState(exercise, state);
        appendLog(exercise, state, "stop");
      }

      const status = buildStatus(exercise, state, schedule);
      const unfired = schedule.gates
        .filter((gate) => !state.fired[gate.id])
        .map((gate) => gate.id);

      process.stdout.write(
        `Stopped at ${status.elapsed}. Fired: ${status.fired.join(", ") || "none"}. Never reached: ${unfired.join(", ") || "none"}. Met: ${status.met.join(", ") || "none"}.\nLog: ${paths(exercise).log}\n`,
      );
      return;
    }

    case "reset": {
      if (!options.force) {
        fail("reset deletes the session state and log; add --force to confirm");
      }

      rmSync(paths(exercise).state, { force: true });
      rmSync(paths(exercise).log, { force: true });
      process.stdout.write(`Reset exercise ${exercise}.\n`);
      return;
    }

    default:
      fail(`Unknown command "${command}".\n\n${USAGE}`);
  }
}

await main();
