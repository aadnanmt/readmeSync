export function parseLanguage(data: any) {
  const langMap: Record<string, number> = {};
  
  data.user.repositories.nodes.forEach((repo: any) => {
    repo.languages.edges.forEach((edge: any) => {
      langMap[edge.node.name] = (langMap[edge.node.name] || 0) + edge.size;
    });
  });

  return Object.entries(langMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); 
}

export function parseCommit(data: any) {
  const calendar = data.user.contributionsCollection.contributionCalendar;
  return calendar.weeks
    .flatMap((w: any) => w.contributionDays)
    .slice(-7);
}
