// scripts/lib/render.ts

// --- Bar ---
export function makeBar(count: number, max: number, width: number) {
  const filledLength = Math.round((count / max) * width);
  const filled = "█".repeat(Math.max(0, filledLength));
  const empty = "░".repeat(Math.max(0, width - filledLength));
  return `[${filled}${empty}]`;
}

// --- Section Render Activity  ---
export function renderSection(title: string, line: string[]) {
  return [
    `$ aadnanmt-stats --${title.toLowerCase().replace(/\s+/g, "-")}`,
    "----------------------------------",
    ...line,
    "----------------------------------",
  ].join("\n");
}

// --- Build README with inject  data to template ---
export function buildReadme(
  template: string,
  statsOutput: string,
  commitOutput: string,
): string {
  return template
    .replace("{{languages}}", statsOutput)
    .replace("{{commit}}", commitOutput);
}
