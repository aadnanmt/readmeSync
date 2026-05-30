// scripts/lib/env.ts
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

/**
 * Manual environment loader for restrict shells
 */
if (!process.env.GH_TOKEN) {
  try {
    const envPath = path.join(process.cwd(), ".env")
    if (existsSync(envPath)) {
      const lines = readFileSync(envPath, "utf-8").split("\n")
      for (const line of lines) {
        const [key, value] = line.trim().split("=")
        if (key === "GH_TOKEN") {
          process.env.GH_TOKEN = value?.trim()
          break
        }
      }
    }
  } catch (e) {
    /* Silent fail */
  }
}
