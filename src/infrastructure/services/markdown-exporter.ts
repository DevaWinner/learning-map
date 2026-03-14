import type { WeeklySummary } from '@/domain/entities/weekly-summary';
import { deliverableStatusLabels } from '@/domain/entities/weekly-checkpoint';

export function buildWeeklyMarkdownReport(summary: WeeklySummary): string {
  const completedList =
    summary.outcomes.length > 0
      ? summary.outcomes.map((item) => `- ${item}`).join('\n')
      : '- No outcomes recorded yet.';

  const taskList =
    summary.uniqueTasks.length > 0
      ? summary.uniqueTasks.map((item) => `- ${item}`).join('\n')
      : '- No study tasks recorded yet.';

  return [
    `# Week ${summary.week.weekNumber} Report`,
    '',
    `- Window: ${summary.week.startDate} to ${summary.week.endDate}`,
    `- Planned hours: ${summary.week.plannedHours}`,
    `- Actual hours: ${summary.actualHours}`,
    `- Remaining hours: ${summary.remainingHours}`,
    `- Deliverable status: ${deliverableStatusLabels[summary.checkpoint.deliverableStatus]}`,
    '',
    '## Planned focus',
    `- Coursera: ${summary.week.coursera}`,
    `- Math: ${summary.week.math}`,
    `- Deliverable: ${summary.week.deliverable}`,
    '',
    '## Worked tasks',
    taskList,
    '',
    '## Completed outcomes',
    completedList,
    '',
    '## Blockers',
    summary.checkpoint.blockers
      ? `- ${summary.checkpoint.blockers}`
      : '- No blockers recorded.',
    '',
    '## Next action',
    summary.checkpoint.nextAction
      ? `- ${summary.checkpoint.nextAction}`
      : '- Define the next concrete action.',
    '',
    '## Reflection',
    summary.checkpoint.summaryNote || 'No summary note recorded yet.',
    '',
  ].join('\n');
}

