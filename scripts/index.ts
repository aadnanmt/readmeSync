// scripts/index.ts

import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchData } from "./lib/github";
import { parseLanguage, parseCommit } from "./lib/parser";
import { makeBar, renderSection, buildReadme } from "./lib/render";
import { GITHUB_QUERY } from "./lib/query";
import { GitHubGqlResponse } from "./types";

// --- README.template.md ---
const README_PATH = process.argv[2] || path.join(process.cwd(), "README.md");
const TEMPLATE_PATH = path.join(process.cwd(), "README.template.md");

async function main() {
  // --- Add console log ---
  console.log("🚀 Starting data fetching...");

  // --- Read Template ---
  const template = readFileSync(TEMPLATE_PATH, "utf-8");

  // --- Fetch data from github query ---
  const data = await fetchData(GITHUB_QUERY);

  if (!data) {
    throw new Error("fail: notfound data from GitHub API.");
  }

  // --- Process Languages ---
  const sortedLangs = parseLanguage(data.viewer); // Pass data.viewer
  const totalSize = sortedLangs.reduce((acc, [, size]) => acc + size, 0);
  const langLines = sortedLangs.map(([name, size]) => {
    const bar = makeBar(size, totalSize, 15);
    return `${name.padEnd(10)} ${bar} ${((size / totalSize) * 100).toFixed(1)}%`;
  });

  // --- Process Commits ---
  const calendar = data.viewer.contributionsCollection.contributionCalendar;
  const totalContributions = calendar.totalContributions;
  const commitData = parseCommit(data.viewer);
  const maxCommits = Math.max(...commitData.map((d) => d.contributionCount), 1);
  const commitLines = commitData.map((day) => {
    // Date time use en-US
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(new Date(day.date));
    const bar = makeBar(day.contributionCount, maxCommits, 10);
    return `${dayName.padEnd(5)} ${bar} ${day.contributionCount} commits`;
  });

  // --- Assembly ---
  const statsOutput = renderSection("languages", langLines);
  const commitOutput = renderSection("commit", [
    ...commitLines,
    "", // spacer
    `Total: ${totalContributions.toLocaleString()} commits in the last year`,
  ]);

  // --- Build README ---
  const finalReadme = buildReadme(template, statsOutput, commitOutput);

  // Overwrite file
  writeFileSync(README_PATH, finalReadme);
  console.log(" Nice: README.md generated!");
}

main().catch(console.error);
