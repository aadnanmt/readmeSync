// scripts/lib/query.ts
export const GITHUB_QUERY = `
  query {
    viewer {
      login
      repositories(first: 100, ownerAffiliations: [OWNER,
         ORGANIZATION_MEMBER], isFork: false,  orderBy: {field: PUSHED_AT, direction:
         DESC}) {
        nodes {
          nameWithOwner
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
          refs(refPrefix: "refs/heads/", first: 1) {
            nodes {
              target {
                ... on Commit {
                  history(first: 1) {
                    nodes {
                      message
                      committedDate
                    }
                  }
                }
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
`;
