import { GitHubUser, ContributionWeek } from "../types"

const ALLOWED_OWNER = ["aadnanmt", "nanoolabs"]

function isOwnRepo(repo: { owner?: { login?: string } | null } | null) {
  return (
    !!repo?.owner?.login &&
    ALLOWED_OWNER.includes(repo.owner.login.toLowerCase())
  )
}

export function parseLanguage(data: GitHubUser) {
  const langMap: Record<string, number> = {}

  data.repositories.nodes.filter(isOwnRepo).forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      langMap[edge.node.name] = (langMap[edge.node.name] || 0) + edge.size
    })
  })

  return Object.entries(langMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
}

export function parseCommit(data: GitHubUser) {
  const calendar = data.contributionsCollection.contributionCalendar
  return calendar.weeks
    .flatMap((w: ContributionWeek) => w.contributionDays)
    .slice(-7)
}

export function parseCodebaseStats(data: GitHubUser) {
  let totalDiskUsage = 0
  let repoCount = 0
  const licenseMap: Record<string, number> = {}

  data.repositories.nodes.filter(isOwnRepo).forEach((repo) => {
    totalDiskUsage += repo.diskUsage
    repoCount++
    if (repo.licenseInfo?.spdxId) {
      licenseMap[repo.licenseInfo.spdxId] =
        (licenseMap[repo.licenseInfo.spdxId] || 0) + 1
    }
  })

  const mainLicense =
    Object.entries(licenseMap).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "No License"

  return { repoCount, totalDiskUsage, mainLicense }
}
