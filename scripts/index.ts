// scripts/index.ts

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchData } from "./lib/github";
import { parseLanguage, parseCommit, parseActivity } from "./lib/parser";
import {
  renderSection,
  buildReadme,
  formatLanguages,
  formatCommits,
} from "./lib/render";
import { GITHUB_QUERY } from "./lib/query";

// --- README.template.md ---
const README_PATH = process.argv[2] || path.join(process.cwd(), "README.md");
const TEMPLATE_PATH = path.join(process.cwd(), "README.template.md");

// --- Manual Env Load (for glitchy environments) ---
if (!process.env.GH_TOKEN) {
  try {
    const envContent = readFileSync(path.join(process.cwd(), ".env"), "utf-8");
    const lines = envContent.split("\n");
    for (const line of lines) {
      if (line.startsWith("GH_TOKEN=")) {
        process.env.GH_TOKEN = line.split("=")[1]?.trim();
        break;
      }
    }
  } catch (e) {
    /* Silent fail */
  }
}

async function main() {
  console.info("[ ▱_▱ ] Starting data fetching, wait a moment...");

  // --- Read Template ---
  const template = readFileSync(TEMPLATE_PATH, "utf-8");

  // --- Fetch data from github query ---
  const data = await fetchData(GITHUB_QUERY);

  if (!data) {
    throw new Error("[ ▟_▙ ]  Fail: Notfound data from GitHub API.");
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

  // --- Build Readme ---
  const finalReadme = buildReadme(template, statsOutput, commitOutput);

  writeFileSync(README_PATH, finalReadme);
  console.info("[ ▰_▰ ] Done, README.md generated with Clean Architecture!");

  // JSON for Portfolio
  const jsonOutput = process.argv[3];
  if (jsonOutput) {
    const portfolioData = {
      languages: sortedLangs.map(([name, size]) => ({
        name,
        percentage: ((size / totalSize) * 100).toFixed(1),
      })),
      totalCommits: totalContributions,
      updatedAt: new Date().toISOString(),
      dailyContributions: calendar?.weeks
        ?.flatMap((week) => week.contributionDays || [])
        .map((day) => ({
          date: day.date,
          count: day.contributionCount,
        })) || [],
    };
    writeFileSync(jsonOutput, JSON.stringify(portfolioData, null, 2));
    console.info(`[ ⌐■_■] Data exported to: ${jsonOutput}`);
  }
}

main().catch(console.error);
