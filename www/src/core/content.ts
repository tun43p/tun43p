// Everything the page says lives here.
import {
  EMAIL,
  GITHUB_PROFILE_URL,
  JOFNU_URL,
  LINKEDIN_PROFILE_URL,
  SOURCE_URL,
} from "~/core/constants";

export type Proc = {
  pid: number;
  name: string;
  cmd: string;
  user: string;
  state: "R" | "S" | "Z";
  threads: number;
  cpu: number;
  info: string;
  stack?: string;
  link?: { href: string; label: string };
};

// stacks and numbers are first guesses, edit freely
export const PROCS: Proc[] = [
  {
    pid: 1,
    name: "jofnu",
    cmd: "/sbin/init --company",
    user: "root",
    state: "S",
    threads: 1,
    cpu: 0.4,
    info: "my company. everything below runs under it: client work, products, and the odd experiment.",
    link: { href: JOFNU_URL, label: "jofnu.com" },
  },
  {
    pid: 42,
    name: "ai-workflows",
    cmd: "agents --tools --rag --evals",
    user: "tun43p",
    state: "R",
    threads: 16,
    cpu: 34,
    info: "llm pipelines that read, decide and act. agents with tools, retrieval over private data, evals and guardrails so they hold up once real users touch them.",
    stack: "python, typescript, llm apis, vector stores",
  },
  {
    pid: 43,
    name: "trading-bots",
    cmd: "bot --live --risk-limits",
    user: "tun43p",
    state: "R",
    threads: 12,
    cpu: 27,
    info: "signal and execution bots. exchange connectors, backtests, position sizing, risk limits, and alerts that wake me up before a bug costs money.",
    stack: "go, python, websockets, postgres",
  },
  {
    pid: 44,
    name: "automation",
    cmd: "cron --scrape --glue",
    user: "tun43p",
    state: "R",
    threads: 8,
    cpu: 14,
    info: "scrapers, schedulers and glue between apis. the unglamorous work that gives a team its hours back.",
    stack: "typescript, python, queues, cloudflare workers",
  },
  {
    pid: 45,
    name: "fullstack",
    cmd: "web --api --ui",
    user: "tun43p",
    state: "R",
    threads: 6,
    cpu: 11,
    info: "the interfaces on top: web apps, apis and internal dashboards, from the database to the pixels. design and ux included.",
    stack: "typescript, solid, go, postgres",
  },
  {
    pid: 46,
    name: "blockchain",
    cmd: "contracts --index",
    user: "tun43p",
    state: "S",
    threads: 4,
    cpu: 2,
    info: "smart contracts, indexers and the apps around them.",
    stack: "solidity, typescript",
  },
  {
    pid: 64,
    name: "infra",
    cmd: "cloud --docker --edge",
    user: "root",
    state: "R",
    threads: 5,
    cpu: 4,
    info: "a home server i run myself, containers everywhere, edge deploys on cloudflare. this site included.",
    stack: "linux, docker, cloudflare",
    link: { href: SOURCE_URL, label: "source of this site" },
  },
  {
    pid: 77,
    name: "zat",
    cmd: "zig build run",
    user: "tun43p",
    state: "R",
    threads: 1,
    cpu: 3,
    info: "what cat would be if it went to the gym. written in zig, and one of the few public ones.",
    stack: "zig",
    link: { href: `${GITHUB_PROFILE_URL}/zat`, label: "github.com/tun43p/zat" },
  },
  {
    pid: 101,
    name: "music",
    cmd: "practice --daily",
    user: "tun43p",
    state: "S",
    threads: 2,
    cpu: 0,
    info: "musician for more than ten years. keeps the creative side warm.",
  },
  {
    pid: 102,
    name: "outside",
    cmd: "sport --nature",
    user: "tun43p",
    state: "S",
    threads: 1,
    cpu: 0,
    info: "sport and nature, as often as possible. the best debugger there is.",
  },
  {
    pid: 404,
    name: "side-project",
    cmd: "[defunct]",
    user: "tun43p",
    state: "Z",
    threads: 0,
    cpu: 0,
    info: "every developer has a few. this one is waiting for a free weekend.",
  },
];

export const STACK: { name: string; use: number; note: string }[] = [
  { name: "typescript", use: 0.9, note: "front, back, workers" },
  { name: "python", use: 0.75, note: "ai, data" },
  { name: "go", use: 0.6, note: "services, bots" },
  { name: "docker", use: 0.6, note: "everything" },
  { name: "sql", use: 0.55, note: "postgres, sqlite" },
  { name: "zig", use: 0.3, note: "learning, zat" },
];

export const STATE = {
  R: ["running", "text-accent"],
  S: ["sleeping", "text-ash"],
  Z: ["zombie", "text-hot"],
} as const;

export const LINKS: Record<string, string> = {
  github: GITHUB_PROFILE_URL,
  linkedin: LINKEDIN_PROFILE_URL,
  jofnu: JOFNU_URL,
  mail: `mailto:${EMAIL}`,
  zat: `${GITHUB_PROFILE_URL}/zat`,
  source: SOURCE_URL,
};
