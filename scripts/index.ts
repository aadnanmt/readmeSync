// scripts/index.ts
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fetchData } from "./lib/github"
import {
  renderSection,
  buildReadme,
  formatLanguages,
  formatCommits,
} from "./lib/render"
import { GITHUB_QUERY } from "./lib/query"
import { parseLanguage, parseCodebaseStats } from "./lib/parser"

async function main() {
  console.info("[▱_▱] Starting sync...")

  // 1. Fetch & Validate
  const data = await fetchData(GITHUB_QUERY)
  if (!data?.viewer) throw new Error("GitHub API Error")
  const user = data.viewer

  // 2. Format & Assembly
  const languageData = parseLanguage(user)
  const totalSize = languageData.reduce((acc, [, size]) => acc + size, 0)

  const codebaseMetrics = parseCodebaseStats(user)
  const mb = codebaseMetrics.totalDiskUsage / 1024
  const storageStr =
    mb > 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(2)} MB`

  const codebaseSection = renderSection("codebase", [
    `REPOS: ${codebaseMetrics.repoCount} (include private repo personal & org)`,
    `VOLUME: ${storageStr}`,
    `LICENSE: ${codebaseMetrics.mainLicense}`,
  ])

  const statsSection = renderSection("languages", formatLanguages(user))
  const commitSection = renderSection("commit", [
    ...formatCommits(user),
    "",
    `Total: ${user.contributionsCollection.contributionCalendar.totalContributions.toLocaleString()} commits in last year`,
  ])

  // 3. Output README
  const outputPath = process.argv[2] || path.join(process.cwd(), "README.md")
  const template = readFileSync(
    path.join(process.cwd(), "README.template.md"),
    "utf-8"
  )
  writeFileSync(
    outputPath,
    buildReadme(
      template,
      `${codebaseSection}\n\n${statsSection}`,
      commitSection
    )
  )

  // 4. Output JSON (optional)
  const jsonPath = process.argv[3]
  if (jsonPath) {
    const json = {
      updatedAt: new Date().toISOString(),
      totalCommits:
        user.contributionsCollection.contributionCalendar.totalContributions,
      ...codebaseMetrics,
      languages: languageData.map(([name, size]) => ({
        name,
        percentage: ((size / totalSize) * 100).toFixed(1),
      })),
    }
    writeFileSync(jsonPath, JSON.stringify(json, null, 2))
  }

  console.info("[▰_▰] System Synced")
  console.info("[⌐■_■] Check your README.md and stats.json")
}

main().catch(console.error)
