# readmeSync

A minimalist tool to synchronize your GitHub Profile README. Built with **Deno**
and **TypeScript**, it uses the **GitHub GraphQL API** for fast data fetching
and headless templating.

## Architecture

This project follows a **Headless Templating** approach:

1. **Source**: `README.template.md` (Markdown with placeholders).
2. **Logic**: Deno + TS scripts fetch data from GitHub GraphQL.
3. **Renderer**: Injects stats into placeholders like `{{languages}}` and
   `{{commit}}`.
4. **Deploy**: GitHub Actions automates the sync every 12 hours to your public
   profile repository.

## Tech Stack

- **Runtime**: [Deno](https://deno.com)
- **Language**: TypeScript
- **API**: GitHub GraphQL API v4
- **Automation**: GitHub Actions (Cron)
- **Formatting**: deno fmt

## Setup & Usage

1. Clone this repository.
2. Install dependencies:
   ```bash
   deno install
   ```
3. Initialize the environment file:
   ```bash
   cp .env.example .env
   ```
4. Set up your `GH_TOKEN` in the `.env` file (see the **Authentication** section
   below).
5. Run the generator:
   ```bash
   deno run -A scripts/index.ts <path-to-target-readme>
   ```

## Authentication

This project requires a GitHub Personal Access Token (PAT). You can use either:

- **Fine-grained PAT**: (Recommended) Requires `Contents (Read/Write)`,
  `Workflows (Read/Write)`, and `Profile (Read-only)` permissions.
- **Classic PAT**: (Easier for multiple organizations) Requires `repo`,
  `workflow`, and `read:user` scopes.

## Automation

Updates happen twice a day at **05:00 & 17:00 UTC**. Check
`.github/workflows/stats.yml` for the CI/CD pipeline details.

---

_Zero-bloat. Performance-first. Scalable._
