import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const GH_TOKEN = process.env.GH_TOKEN;
const README_PATH = path.join(process.cwd(), "README.md");

const QUERY = readFileSync(path.join(process.cwd(), "scripts/query.graphql"), "utf8");

async function generateStats() {
  if (!GH_TOKEN) throw new Error("GH_TOKEN is missing!");

  // Fetch data from GitHub GraphQL
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY }),
  });

  const { data } = await response.json();
  const langMap: Record<string, number> = {};

  // Language 
  data.viewer.repositories.nodes.forEach((repo: any) => {
    repo.languages.edges.forEach((edge: any) => {
      const name = edge.node.name;
      langMap[name] = (langMap[name] || 0) + edge.size;
    });
  });

  // Sort n Slice
  const totalSize = Object.values(langMap).reduce((a, b) => a + b, 0);
  const sortedLangs = Object.entries(langMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  // Ascii bar render
  const BAR_WIDTH = 20;
  const asciiLines = sortedLangs.map(([name, size]) => {
    const percent = size / totalSize;
    const filled = Math.round(percent * BAR_WIDTH);
    const bar = "█".repeat(filled).padEnd(BAR_WIDTH, "▒");
    return `${name.padEnd(12)} ${bar} ${(percent * 100).toFixed(1)}%`;
  });

  const statsOutput = [
    "$ adnan-stats --languages",
    "-------------------------",
    ...asciiLines,
    "-------------------------",
    `Status      : Internship`, 
    `Uptime      : 18 years `,

    ---
    ​[!] This profile updates automatically via custom Bun script.
  ].join("\n")

  // Inject README.md
  const readmeContent = readFileSync(README_PATH, "utf8");
  const regex = /[\s\S]*/;
  const newContent = readmeContent.replace(
    regex,
    `\n\`\`\`text\n${statsOutput}\n\`\`\`\n`
  );

  writeFileSync(README_PATH, newContent);
  console.log("README updated with fresh ASCII stats!");
}

generateStats().catch(console.error);
