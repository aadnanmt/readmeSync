import { writeFileSync } from "node:fs";
import path from "node:path";
import { fetchData } from "./lib/github";
import { parseLanguage, parseCommit } from "./lib/parser";
import { makeBar, renderSection, buildReadme } from "./lib/render";

const README_PATH = process.argv[2] || path.join(process.cwd(), "README.md");

async function main() {
  
  // Process languages
  const sortedLangs = parseLanguage(data);
  const totalSize = sortedLangs.reduce((acc, [, size]) => acc + size, 0);
  const langLines = sortedLangs.map(([name, size]) => {
    const bar = makeBar(size, totalSize, 15);
    return `${name.padEnd(10)} ${bar} ${((size / totalSize) * 100).toFixed(1)}%`;
  });

  // Process commits
  const commitData = parseCommit(data);
  const commitLines = commitData.map((day: any) => {
    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(day.date));
    const bar = makeBar(day.contributionCount, 10, 10);
    return `${dayName.padEnd(5)} ${bar} ${day.contributionCount} commits`;
  });

  //  stats sections
  const statsOutput = renderSection("languages", langLines);
  const commitOutput = renderSection("commit", commitLines);

  // generate full README.md string
  const finalReadmeString = buildReadme(statsOutput, commitOutput);

  // overwrite file README.md
  writeFileSync(README_PATH, finalReadmeString);
  
  console.log("Nice: README generated successfuly!");
}

main().catch(console.error);
