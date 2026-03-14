import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const roadmapPath = path.join(projectRoot, 'roadmap.md');
const outputPath = path.join(
  projectRoot,
  'src/infrastructure/seeds/roadmap-data.generated.json',
);

const ROADMAP_START = new Date(2026, 0, 5);

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseRoadmap(markdown) {
  const lines = markdown.split(/\r?\n/);
  const weeks = [];
  let currentSection = '';

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentSection = line.replace(/^##\s+/, '').trim();
      continue;
    }

    if (!line.startsWith('|')) {
      continue;
    }

    const cells = line
      .split('|')
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

    weeks.push({
      weekNumber,
      section: currentSection,
      dateRangeLabel: cells[1],
      startDate: toIsoDate(startDate),
      endDate: toIsoDate(endDate),
      coursera: cells[2],
      math: cells[3],
      deliverable: cells[4],
      plannedHours: 20,
    });
  }

  return weeks;
}

const markdown = fs.readFileSync(roadmapPath, 'utf8');
const weeks = parseRoadmap(markdown);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(weeks, null, 2)}\n`);

console.log(`Generated ${weeks.length} roadmap weeks at ${outputPath}`);

