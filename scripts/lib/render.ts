// scripts/lib/render.ts

import { parseLanguage, parseCommit } from "./parser";

/**
 * Create style progress bar
 */
export function makeBar(count: number, max: number, width: number): string {
  const filledLength = Math.round((count / max) * width);
  const filled = "█".repeat(Math.max(0, filledLength));
  const empty = "░".repeat(Math.max(0, width - filledLength));
  return `[${filled}${empty}]`;
}

/**
 * Format output to structure cli section
 */
export function renderSection(title: string, lines: string[]): string {
  return [
    `$ aadnanmt-stats --${title.toLowerCase().replace(/\s+/g, "-")}`,
    "----------------------------------",
    ...lines,
    "----------------------------------",
  ].join("\n");
}

/**
 * Convert raw programming language data to format text lines
 */
export function formatLanguages(user: any): string[] {
  const sortedLangs = parseLanguage(user);
  const totalSize = sortedLangs.reduce((acc, [, size]) => acc + size, 0);

  return sortedLangs.map(([name, size]) => {
    const bar = makeBar(size, totalSize, 15);
    const percentage = ((size / totalSize) * 100).toFixed(1);
    return `${name.padEnd(10)} ${bar} ${percentage}%`;
  });
}

/**
 * Convert raw commit data to format text lines
 */
export function formatCommits(user: any): string[] {
  const commitData = parseCommit(user);
  const maxCommits = Math.max(
    ...commitData.map((d: any) => d.contributionCount),
    1,
  );

  return commitData.map((day: any) => {
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(new Date(day.date));
    const bar = makeBar(day.contributionCount, maxCommits, 10);
    return `${dayName.padEnd(5)} ${bar} ${day.contributionCount} commits`;
  });
}

/**
 * Build the final README by injecting data to the template
 */
export function buildReadme(
  template: string,
  statsOutput: string,
  commitOutput: string,
): string {
  return template
    .replace("{{languages}}", statsOutput)
    .replace("{{commit}}", commitOutput);
}
