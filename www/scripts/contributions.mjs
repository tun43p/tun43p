/* global console, fetch, URL */
// Fetches the public GitHub contribution calendar at build time, no token needed.
// ponytail: scrapes github.com/users/<user>/contributions; move to the GraphQL API with a token if the markup changes
import { writeFileSync } from "node:fs";

const USER = "tun43p";
const OUT = new URL("../src/core/contributions.json", import.meta.url);

try {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "user-agent": "tun43p.com build" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const counts = new Map();
  for (const [, id, label] of html.matchAll(
    /for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g,
  )) {
    counts.set(id, Number(label.match(/^(\d+)/)?.[1] ?? 0));
  }

  const days = [
    ...html.matchAll(
      /data-date="([\d-]+)" id="(contribution-day-component-[\d-]+)" data-level="(\d)"/g,
    ),
  ]
    .map(([, date, id, level]) => ({
      date,
      level: Number(level),
      count: counts.get(id) ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length === 0) throw new Error("no days found, markup changed?");

  const total = days.reduce((s, d) => s + d.count, 0);
  writeFileSync(OUT, JSON.stringify({ total, days }));
  console.log(`contributions: ${days.length} days, ${total} contributions`);
} catch (e) {
  // never fail the build over this; the git box shows a placeholder instead
  console.warn(`contributions: skipped (${e.message})`);
}
