# readmeSync

Automated GitHub Profile README sync. Built with **Bun** and **TypeScript**, leveraging **GitHub GraphQL API** for high-performance data fetching and headless templating.

## Architecture

This project uses a **Headless Templating** approach:

1. **Source**: `README.template.md` (Pure Markdown with placeholders).
2. **Logic**: Bun + TS scripts fetch data from GitHub GraphQL.
3. **Renderer**: Injects processed stats into placeholders (`{{languages}}`, `{{commit}}`).
4. **Deploy**: GitHub Actions automates the sync every 12 hours to the public profile repository.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **API**: GitHub GraphQL API v4
- **Automation**: GitHub Actions (Cron)
- **Formatting**: Prettier

## Setup & Usage

1. Clone the repository.
2. Install dependencies: `bun install`
3. Set up `GH_TOKEN` in your environment.
4. Run the generator:
   ```bash
   bun start <path-to-target-readme>
   ```

## Automation

Updates occur twice daily at **05:00 & 17:00 UTC**.
See `.github/workflows/stats.yml` for the CI/CD pipeline details.

---

_Zero-bloat. Performance-first. Scalable._
