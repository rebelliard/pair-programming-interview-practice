// cursor-canvas-title: Scorecard: exercise 2
import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  CollapsibleSection,
  H1,
  H2,
  Row,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

// All data is inline. Replace every value with the session's real evidence.
const exercise = 2;
const releases = { core: true, extension: false, stretch: false };
const acceptance = [
  { release: "core", passed: 9, total: 9, opened: true },
  { release: "extension", passed: 1, total: 4, opened: false },
];
const dimensions = [
  {
    name: "Cold-start orientation",
    weight: 15,
    level: 2,
    evidence: "Traced handler → command → save at 08:40 (log)",
    source: "log",
  },
  {
    name: "Clarification and scope",
    weight: 10,
    level: 1,
    evidence: "No questions written before opening the table",
    source: "self-reported",
  },
  {
    name: "Incremental implementation",
    weight: 20,
    level: 2,
    evidence: "Three commits; checks rerun after each",
    source: "artifact",
  },
  {
    name: "Testing and verification",
    weight: 15,
    level: 1,
    evidence: "invite-member.test.ts asserts response only",
    source: "artifact",
  },
  {
    name: "Persistence discipline",
    weight: 15,
    level: 1,
    evidence: "No fresh findById after save",
    source: "artifact",
  },
  {
    name: "Debugging",
    weight: 10,
    level: 2,
    evidence: "Hypothesis at 21:10 matched the failing assertion",
    source: "log",
  },
  {
    name: "Communication and collaboration",
    weight: 5,
    level: 2,
    evidence: "Log entries at every slice boundary",
    source: "log",
  },
  {
    name: "Cursor and tool judgment",
    weight: 10,
    level: 2,
    evidence: "Rejected generated email regex",
    source: "chat",
  },
];
const weightedTotal =
  dimensions.reduce((sum, d) => sum + d.level * d.weight, 0) /
  dimensions.reduce((sum, d) => sum + d.weight, 0);
const lessons = [
  {
    title: "Rejected invites still saved",
    happened:
      "core.acceptance: 'does not save on already_member' failed; save() called before the duplicate check.",
    matters:
      "A 409 response with a changed store means the client and the database disagree.",
    better:
      "Load, check members, check invitations, append, then save once — the reference orders the guards before the write.",
    spot: "When a command can reject, ask: which line is the first write, and is every guard above it?",
  },
];
const feedback =
  "You oriented quickly and kept every slice green, which is the hardest habit to build. The misses share one pattern: you proved the response but not the store. Next time, make the first test a fresh read after save. A pass here looks like the core suite green plus one no-write assertion.";
const drill =
  "Untimed, 15 minutes: add one test that rejects an existing member and then asserts findById returns the unchanged workspace. Run the core acceptance file again.";
const committee = {
  laneA: "claude-opus-5-thinking-high",
  laneB: "gpt-5.6-sol-high",
  validator: "claude-opus-5-thinking-high",
  mode: "committee" as const,
  disagreements: [
    {
      name: "Testing and verification",
      a: 1,
      b: 2,
      validated: 1,
      why: "No failing test in the diff before the search implementation.",
    },
  ],
};

export default function Scorecard() {
  const releaseLabel = Object.entries(releases)
    .map(([name, reached]) => `${name}: ${reached ? "reached" : "not opened"}`)
    .join(" · ");
  return (
    <Stack gap={20}>
      <H1>Scorecard: exercise {exercise}</H1>
      <Row gap={24} wrap>
        <Stat
          value={weightedTotal.toFixed(1) + " / 3"}
          label="Weighted total"
        />
        {acceptance.map((a) => (
          <Stat
            key={a.release}
            value={`${a.passed}/${a.total}`}
            label={`${a.release} acceptance${a.opened ? "" : " (not opened)"}`}
            tone={
              !a.opened
                ? undefined
                : a.passed === a.total
                  ? "success"
                  : "danger"
            }
          />
        ))}
      </Row>
      <Text tone="secondary" size="small">
        {releaseLabel}
      </Text>

      <H2>Rubric level by dimension (0–3, expected 2)</H2>
      <BarChart
        horizontal
        categories={dimensions.map((d) => d.name)}
        series={[{ name: "Level", data: dimensions.map((d) => d.level) }]}
        yMin={0}
        yMax={3}
        referenceLines={[{ value: 2, label: "Expected", tone: "info" }]}
        height={dimensions.length * 36 + 40}
      />
      <Text tone="tertiary" size="small">
        Source: for-interviewer/rubric-and-solution.md scale · this session
      </Text>

      <H2>Scores and evidence</H2>
      <Table
        headers={["Dimension", "Level", "Weight", "Evidence", "Source"]}
        columnAlign={[undefined, "right", "right", undefined, undefined]}
        rows={dimensions.map((d) => [
          d.name,
          d.level,
          `${d.weight}%`,
          d.evidence,
          d.source,
        ])}
        rowTone={dimensions.map((d) =>
          d.level <= 1 ? "danger" : d.level === 3 ? "success" : undefined,
        )}
      />

      <CollapsibleSection
        title="Independent reviewers"
        defaultOpen={committee.disagreements.length > 0}
      >
        <Stack gap={12}>
          <Text tone="secondary" size="small">
            {committee.mode === "single-reader"
              ? "Single-reader grading; independent lanes were not available."
              : `Independent: ${committee.laneA} · ${committee.laneB}. Validator: ${committee.validator}.`}
          </Text>
          {committee.disagreements.length > 0 ? (
            <Table
              headers={["Dimension", "A", "B", "Validated", "Resolution"]}
              columnAlign={[undefined, "right", "right", "right", undefined]}
              rows={committee.disagreements.map((d) => [
                d.name,
                d.a,
                d.b,
                d.validated,
                d.why,
              ])}
            />
          ) : (
            <Text>Reviewers agreed on every dimension.</Text>
          )}
        </Stack>
      </CollapsibleSection>

      <H2>Lessons</H2>
      {lessons.map((l, i) => (
        <CollapsibleSection
          key={l.title}
          title={`${i + 1}. ${l.title}`}
          defaultOpen={i === 0}
        >
          <Stack gap={8}>
            <Text>
              <Text weight="semibold" as="span">
                What happened.{" "}
              </Text>
              {l.happened}
            </Text>
            <Text>
              <Text weight="semibold" as="span">
                Why it matters.{" "}
              </Text>
              {l.matters}
            </Text>
            <Text>
              <Text weight="semibold" as="span">
                The better move.{" "}
              </Text>
              {l.better}
            </Text>
            <Text>
              <Text weight="semibold" as="span">
                Spot it next time.{" "}
              </Text>
              {l.spot}
            </Text>
          </Stack>
        </CollapsibleSection>
      ))}

      <Callout tone="info" title="Overall feedback">
        {feedback}
      </Callout>

      <Card>
        <CardHeader>Optional follow-up drill</CardHeader>
        <CardBody>
          <Text>{drill}</Text>
          <Code>
            pnpm exec vitest run --config for-interviewer/vitest.config.ts
            for-interviewer/acceptance/core.acceptance.test.ts
          </Code>
        </CardBody>
      </Card>
    </Stack>
  );
}
