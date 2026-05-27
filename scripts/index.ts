// scripts/index.ts
import "./lib/env";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchData } from "./lib/github";
import {
  renderSection,
  buildReadme,
  formatLanguages,
  formatCommits,
} from "./lib/render";
import { GITHUB_QUERY } from "./lib/query";

async function main() {
  console.info("[▱_▱] Starting sync...");

  // --- Fetch data from github query ---
  const data = await fetchData(GITHUB_QUERY);
  if (!data?.viewer) throw new Error("GitHub API Error");
  const user = data.viewer;

  // 2. Format & Assembly
  const stats = renderSection("languages", formatLanguages(user));
  const commit = renderSection("commit", [
    ...formatCommits(user),
    "",
    `Total: ${user.contributionsCollection.contributionCalendar.totalContributions.toLocaleString()} commits`,
  ]);

  // --- Build Readme ---
  const finalReadme = buildReadme(template, statsOutput, commitOutput);

writeFileSync(README_PATH, finalReadme);
  console.log("[ ▰_▰ ] Done, README.md generated with Headless Architecture!");

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
    console.log(`[ ⌐■_■] Done, data JSON exported to: ${jsonOutput}`);
  }

  console.info("[▰_▰] System Synced");
  console.info("[⌐■_■] Check your README.md and stats.json")
}

main().catch(console.error);
