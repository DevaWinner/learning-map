import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const roadmapPath = path.join(projectRoot, "roadmap.md");
const outputPath = path.join(
  projectRoot,
  "src/infrastructure/seeds/roadmap-data.generated.json",
);

const ROADMAP_START = new Date(2026, 2, 16);

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const LONG_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PHASES = [
  {
    range: [1, 8],
    phase: "Foundations",
    timeSplit: "8 h Python · 8 h Math · 4 h Build",
  },
  {
    range: [9, 21],
    phase: "Core ML",
    timeSplit: "8 h ML · 6 h Math · 6 h Build",
  },
  {
    range: [22, 39],
    phase: "Deep Learning + CV/NLP",
    timeSplit: "10 h DL · 4 h Math · 6 h Build",
  },
  {
    range: [40, 52],
    phase: "GenAI + Production",
    timeSplit: "8 h GenAI/MLOps · 2 h Math · 10 h Build",
  },
];

function getPhase(weekNumber) {
  const match = PHASES.find(
    (p) => weekNumber >= p.range[0] && weekNumber <= p.range[1],
  );
  return match ?? PHASES[PHASES.length - 1];
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toShortLabel(date) {
  return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function toMonthYear(date) {
  return `${LONG_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function parseRoadmap(markdown) {
  const lines = markdown.split(/\r?\n/);
  const weeks = [];

  for (const line of lines) {
    if (!line.startsWith("|")) {
      continue;
    }

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length !== 5) {
      continue;
    }

    if (!/^\d+$/.test(cells[0])) {
      continue;
    }

    const weekNumber = Number(cells[0]);
    const startDate = addDays(ROADMAP_START, (weekNumber - 1) * 7);
    const endDate = addDays(startDate, 6);
    const { phase, timeSplit } = getPhase(weekNumber);

    weeks.push({
      weekNumber,
      section: toMonthYear(startDate),
      dateRangeLabel: `${toShortLabel(startDate)}–${toShortLabel(endDate)}`,
      startDate: toIsoDate(startDate),
      endDate: toIsoDate(endDate),
      coursera: cells[2],
      math: cells[3],
      deliverable: cells[4],
      plannedHours: 20,
      phase,
      timeSplit,
    });
  }

  return weeks;
}

const markdown = fs.readFileSync(roadmapPath, "utf8");
const weeks = parseRoadmap(markdown);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(weeks, null, 2)}\n`);

console.log(`Generated ${weeks.length} roadmap weeks at ${outputPath}`);
