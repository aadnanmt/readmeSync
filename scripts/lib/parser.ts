import { GitHubUser, ContributionWeek } from "../types";

export function parseLanguage(data: GitHubUser) {
  const langMap: Record<string, number> = {};

  data.repositories.nodes.forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      langMap[edge.node.name] = (langMap[edge.node.name] || 0) + edge.size;
    });
  });

  return Object.entries(langMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
}

export function parseCommit(data: GitHubUser) {
  const calendar = data.contributionsCollection.contributionCalendar;
  return calendar.weeks
    .flatMap((w: ContributionWeek) => w.contributionDays)
    .slice(-7);
}
