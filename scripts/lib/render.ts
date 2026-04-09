// scripts/lib/render.ts
export function makeBar(count: number, max: number, width: number) {
  const filledLength = Math.round((count / max) * width);
  const filled = "█".repeat(Math.max(0, filledLength));
  const empty = "░".repeat(Math.max(0, width - filledLength));
  return `[${filled}${empty}]`;
}

export function renderSection(title: string, line: string[]) {
  return [
    `$ aadnanmt-stats --${title.toLowerCase().replace(/\s+/g, "-")}`,
    "-------------------------",
    ...line,
    "-------------------------",
  ].join("\n");
}

export function buildReadme(statsOutput: string, commitOutput: string): string {
  //
   return `# Adnan (@aadnanmt)
## 18yo dev n tech minimalist

> **Current Mission**: Building high-performance edge infrastructure at \`nanoo-labs\`.

### Tech environment now
- **Frontend** — TS/JS (Astro), HTML, CSS (Tailwindcss)
- **Backend** — TS (Hono) and Python (Fastapi, Flask).
- **Sql** — Sqlite and Postgresql
- **Nosql** — Redis
- **System** — Arch Linux, Hyprland, I3wm, Alpine, Debian minimal, Termux, Tmux. 
- **Editor** — Sublime (fav), Neovim, VS Code. 
- **Shell** — Fish Shell
- **Terminal** — Kitty
- **Tools** — Git, Wrangler, Vite, Docker, Podman, Bun, Pnpm.

### Dev activity
\`\`\`text
${statsOutput}

${commitOutput}
\`\`\`

---
### Focus now
- **Principles** • Performance-first. Zero-bloat. Scalable Architecture.
- **Current Grind** • Internship (PKL) @ UIN Malang - Academic Dept.

---
*Building fast, simple, and scalable apps with out-of-the-box thinking.*

[ Portfolio ](https://aadnanmt.web.id) | [ Laboratory ](https://github.com/nanoo-labs)

---
**Connect:**
[X/Twitter](https://x.com/aadnanmt) / [Instagram](https://instagram.com/aadnanmt) / [Telegram](https://t.me/aadnanmtech) / [Email](mailto:dev@nanoo.cloud)<br>

[!] This profile update automatically via custom bun n ts script.
`;
}
