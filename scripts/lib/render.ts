export function makeBar(count: number, max: number, width: number) {
  const filledLength = Math.round((count / max) * width);
  const filled = "█".repeat(Math.max(0, filledLength));
  const empty = "░".repeat(Math.max(0, width - filledLength));
  return `[${filled}${empty}]`;
}

export function renderSection(title: string, line: string[]) {
  return [
    `$ aadnanmt-stats --${title.toLowerCase().replace(/\s+/g, "-")}`,
    "-------------------------",
    ...line,
    "-------------------------",
  ].join("\n");
}