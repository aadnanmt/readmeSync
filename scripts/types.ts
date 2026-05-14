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
  owner: {
    login: string;
  };
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
  // the authenticated user (used with the 'viewer' query)
  viewer?: GitHubUser;

  // a specific user (used with the 'user(login: "...")' query)
  user?: GitHubUser;
}
