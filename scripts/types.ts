// scripts/types.ts

// Language types
export interface LanguageNode {
  color: string;
  name: string;
}

export interface LanguageEdge {
  size: number;
  node: LanguageNode;
}

export interface Languages {
  edges: LanguageEdge[];
}

// Repository types
export interface RepositoryNode {
  languages: Languages;
}

export interface Repositories {
  nodes: RepositoryNode[];
}

// Contribution types
export interface ContributionDay {
  contributionCount: number;
  date: string; // ISO 8601 date string
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

// User (or Viewer) type
export interface GitHubUser {
  repositories: Repositories;
  contributionsCollection: ContributionsCollection;
}

// Full GraphQL Response type
export interface GitHubGqlResponse {
  user: GitHubUser; // if querying user(login: "...")
  // or if using viewer:
  // viewer: GitHubUser;
}
