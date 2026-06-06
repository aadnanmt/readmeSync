// scripts/lib/query.ts
export const GITHUB_QUERY = `
  query {
    viewer {
      login
      repositories(first: 100, ownerAffiliations: [OWNER, ORGANIZATION_MEMBER], isFork: false) {
        nodes {
          diskUsage
          licenseInfo {
            spdxId
          }
          owner {
            login
          }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                color
                name
              }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`
