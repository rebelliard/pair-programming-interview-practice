// Claude React artifact template (application/vnd.ant.react).
// Uses recharts, which Claude artifacts provide. Replace every value with the
// session's real evidence. All data stays inline; no fetch.
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const exercise = 2;
const acceptance = [
  { release: "core", passed: 9, total: 9, opened: true },
  { release: "extension", passed: 1, total: 4, opened: false },
];
const dimensions = [
  {
    name: "Orientation",
    weight: 15,
    level: 2,
    evidence: "Traced handler → command → save at 08:40 (log)",
    source: "log",
  },
  {
    name: "Clarification",
    weight: 10,
    level: 1,
    evidence: "No questions written before opening the table",
    source: "self-reported",
  },
  {
    name: "Incremental",
    weight: 20,
    level: 2,
    evidence: "Three commits; checks rerun after each",
    source: "artifact",
  },
  {
    name: "Testing",
    weight: 15,
    level: 1,
    evidence: "invite-member.test.ts asserts response only",
    source: "artifact",
  },
  {
    name: "Persistence",
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
    name: "Communication",
    weight: 5,
    level: 2,
    evidence: "Log entries at every slice boundary",
    source: "log",
  },
  {
    name: "Tool judgment",
    weight: 10,
    level: 2,
    evidence: "Rejected generated email regex",
    source: "chat",
  },
];
const lessons = [
  {
    title: "Rejected invites still saved",
    happened:
      "core.acceptance: 'does not save on already_member' failed; save() ran before the duplicate check.",
    matters:
      "A 409 response with a changed store means the client and the database disagree.",
    better:
      "Load, check members, check invitations, append, then save once. The reference orders every guard before the write.",
    spot: "When a command can reject, ask: which line is the first write, and is every guard above it?",
  },
];
const feedback =
  "You oriented quickly and kept every slice green, which is the hardest habit to build. The misses share one pattern: you proved the response but not the store. Next time, make the first test a fresh read after save.";
const drill =
  "Untimed, 15 minutes: add one test that rejects an existing member and asserts findById returns the unchanged workspace. Rerun the core acceptance file.";
const committee = {
  laneA: "claude-opus-5-thinking-high",
  laneB: "gpt-5.6-sol-high",
  validator: "claude-opus-5-thinking-high",
  mode: "committee",
  disagreements: [
    {
      name: "Testing",
      a: 1,
      b: 2,
      validated: 1,
      why: "No failing test in the diff before the implementation.",
    },
  ],
};

const weightedTotal =
  dimensions.reduce((sum, d) => sum + d.level * d.weight, 0) /
  dimensions.reduce((sum, d) => sum + d.weight, 0);

const radarData = dimensions.map((d) => ({
  dimension: d.name,
  level: d.level,
  expected: 2,
}));

const section = { marginTop: 24 };
const muted = { color: "#6b7280", fontSize: 13 };
const th = {
  textAlign: "left",
  padding: "6px 8px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 13,
};
const td = {
  padding: "6px 8px",
  borderBottom: "1px solid #f3f4f6",
  fontSize: 13,
  verticalAlign: "top",
};

export default function Scorecard() {
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        maxWidth: 960,
        color: "#111827",
      }}
    >
      <h1 style={{ fontSize: 22, margin: 0 }}>
        Scorecard: exercise {exercise}
      </h1>
      <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>
            {weightedTotal.toFixed(1)} / 3
          </div>
          <div style={muted}>Weighted total</div>
        </div>
        {acceptance.map((a) => (
          <div key={a.release}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>
              {a.passed}/{a.total}
            </div>
            <div style={muted}>
              {a.release} acceptance{a.opened ? "" : " (not opened)"}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, ...section }}>
        Rubric level by dimension (0–3, expected 2)
      </h2>
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={radarData} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis
            domain={[0, 3]}
            tickCount={4}
            tick={{ fontSize: 11 }}
          />
          <Radar
            name="Expected"
            dataKey="expected"
            stroke="#9ca3af"
            fill="#9ca3af"
            fillOpacity={0.15}
          />
          <Radar
            name="This session"
            dataKey="level"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div style={muted}>
        Source: for-interviewer/rubric-and-solution.md scale · this session
      </div>

      <h2 style={{ fontSize: 16, ...section }}>Scores and evidence</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {["Dimension", "Level", "Weight", "Evidence", "Source"].map((h) => (
              <th key={h} style={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dimensions.map((d) => (
            <tr key={d.name}>
              <td style={td}>{d.name}</td>
              <td style={td}>{d.level}</td>
              <td style={td}>{d.weight}%</td>
              <td style={td}>{d.evidence}</td>
              <td style={td}>{d.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 16, ...section }}>Independent reviewers</h2>
      <p style={muted}>
        {committee.mode === "single-reader"
          ? "Single-reader grading; independent lanes were not available."
          : `Independent: ${committee.laneA} · ${committee.laneB}. Validator: ${committee.validator}.`}
      </p>
      {committee.disagreements.length > 0 ? (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {["Dimension", "A", "B", "Validated", "Resolution"].map((h) => (
                <th key={h} style={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {committee.disagreements.map((d) => (
              <tr key={d.name}>
                <td style={td}>{d.name}</td>
                <td style={td}>{d.a}</td>
                <td style={td}>{d.b}</td>
                <td style={td}>{d.validated}</td>
                <td style={td}>{d.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Reviewers agreed on every dimension.</p>
      )}

      <h2 style={{ fontSize: 16, ...section }}>Lessons</h2>
      {lessons.map((l, i) => (
        <details key={l.title} open={i === 0} style={{ marginBottom: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>
            {i + 1}. {l.title}
          </summary>
          <p>
            <strong>What happened.</strong> {l.happened}
          </p>
          <p>
            <strong>Why it matters.</strong> {l.matters}
          </p>
          <p>
            <strong>The better move.</strong> {l.better}
          </p>
          <p>
            <strong>Spot it next time.</strong> {l.spot}
          </p>
        </details>
      ))}

      <h2 style={{ fontSize: 16, ...section }}>Overall feedback</h2>
      <p>{feedback}</p>

      <h2 style={{ fontSize: 16, ...section }}>
        Optional follow-up drill (15 minutes, untimed)
      </h2>
      <p>{drill}</p>
    </div>
  );
}
