// scripts/index.ts
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fetchData } from "./lib/github";
import { parseLanguage, parseCommit } from "./lib/parser";
import { makeBar, renderSection, buildReadme } from "./lib/render";
import { GITHUB_QUERY } from "./lib/query";

const README_PATH = process.argv[2] || path.join(process.cwd(), "README.md");

async function main() {
  // add console log
  console.log("🚀 starting data fetch...");

  // fetch
  const data = await fetchData(GITHUB_QUERY);

  if (!data) {
    throw new Error("fail: notfound data from GitHub API.");
  }

  // --- Process Languages ---
  const sortedLangs = parseLanguage(data);
  const totalSize = sortedLangs.reduce((acc, [, size]) => acc + size, 0);
  const langLines = sortedLangs.map(([name, size]) => {
    const bar = makeBar(size, totalSize, 15);
    return `${name.padEnd(10)} ${bar} ${((size / totalSize) * 100).toFixed(1)}%`;
  });

  // --- Process Commits ---
  const commitData = parseCommit(data);
  const commitLines = commitData.map((day: any) => {
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(new Date(day.date));
    const bar = makeBar(day.contributionCount, 10, 10);
    return `${dayName.padEnd(5)} ${bar} ${day.contributionCount} commits`;
  });

  // --- assembly ---
  const statsOutput = renderSection("languages", langLines);
  const commitOutput = renderSection("commit", commitLines);

  // --- Build Readme ---
  const finalReadme = buildReadme(statsOutput, commitOutput);

  // overwrite file
  writeFileSync(README_PATH, finalReadme);
  console.log(" Nice: README.md generated with Headless Architectur!");
}

main().catch(console.error);
