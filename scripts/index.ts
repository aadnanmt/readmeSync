import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchData } from "./lib/github";
import { parseLanguage, parseCommit } from "./lib/parser";
import { makeBar, renderSection } from "./lib/render";

const QUERY = readFileSync(path.join(process.cwd(), "scripts/query.graphql"), "utf8");
const README_PATH = path.join(process.cwd(), "README.md");

async function main() {
  const data = await fetchData(QUERY);

  // Process Languages
  const sortedLangs = parseLanguage(data);
  const totalSize = sortedLangs.reduce((acc, [, size]) => acc + size, 0);
  const langLines = sortedLangs.map(([name, size]) => {
    const bar = makeBar(size, totalSize, 15);
    return `${name.padEnd(10)} ${bar} ${((size / totalSize) * 100).toFixed(1)}%`;
  });

  // Process Commits
  const commitData = parseCommit(data);
  const commitLines = commitData.map((day: any) => {
    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(day.date));
    const bar = makeBar(day.contributionCount, 10, 10); // Scale 10 = full
    return `${dayName.padEnd(5)} ${bar} ${day.contributionCount} commits`;
  });

  // Final Assembly
  const statsOutput = renderSection("languages", langLines);
  const commitOutput = renderSection("commit", commitLines);
  const fullStats = `\`\`\`text\n${statsOutput}\n\n${commitOutput}\n\`\`\``;

  // Inject
  const readme = readFileSync(README_PATH, "utf8");
  const newReadme = readme.replace(/[\s\S]*/, `\n${fullStats}\n`);
  
  writeFileSync(README_PATH, newReadme);
  console.log("stats updated succes!");
}

main().catch(console.error);