import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchData } from "./lib/github";
import { parseLanguage, parseCommit } from "./lib/parser";
import { makeBar, renderSection } from "./lib/render";

const QUERY = readFileSync(path.join(process.cwd(), "scripts/query.graphql"), "utf8");
const README_PATH = process.argv[2] || path.join(process.cwd(), "README.md");

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

  // final assembly
  const statsOutput = renderSection("languages", langLines);
  const commitOutput = renderSection("commit", commitLines);
  const fullStats = `\`\`\`text\n${statsOutput}\n\n${commitOutput}\n\`\`\``;

  // inject logic new
  const readme = readFileSync(README_PATH, "utf-8");

  // tag on README.md
  const START_TAG = "";
  const END_TAG = "";

  // regex tag
  const regex = new RegExp(`${START_TAG}[\\s\\S]*${END_TAG}`);

  // safety check
  if (!readme.includes(START_TAG) || !readme.includes(END_TAG)) {
    console.error("error: tag notfound on README!");
    console.log("check repo public");
    process.exit(1); 
  }

  // inject tag on README.md target
  const updatedReadme = readme.replace(
    regex,
    `${START_TAG}\n${fullStats}\n${END_TAG}`
  );

  writeFileSync(README_PATH, updatedReadme);
  console.log("stats updated succes!");
}

main().catch(console.error);