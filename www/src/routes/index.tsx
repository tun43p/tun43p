import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";

import BaseLayout from "~/layouts/base";
import {
  EMAIL,
  GITHUB_PROFILE_URL,
  JOFNU_URL,
  LINKEDIN_PROFILE_URL,
  SOURCE_URL,
} from "~/core/constants";

type Proc = {
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

// ponytail: content lives here, edit freely. stacks and numbers are first guesses
const PROCS: Proc[] = [
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
    cmd: "homelab --docker --edge",
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

const STACK: { name: string; use: number; note: string }[] = [
  { name: "typescript", use: 0.9, note: "front, back, workers" },
  { name: "python", use: 0.75, note: "ai, data" },
  { name: "go", use: 0.6, note: "services, bots" },
  { name: "docker", use: 0.6, note: "everything" },
  { name: "sql", use: 0.55, note: "postgres, sqlite" },
  { name: "zig", use: 0.3, note: "learning, zat" },
];

const STATE = {
  R: ["running", "text-accent"],
  S: ["sleeping", "text-ash"],
  Z: ["zombie", "text-hot"],
} as const;

const clamp = (v: number, lo = 0, hi = 1): number =>
  Math.min(hi, Math.max(lo, v));
const pad = (n: number): string => String(n).padStart(2, "0");
const duration = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};

export default function HomeRoute(): JSX.Element {
  const [tick, setTick] = createSignal(0);
  const [cpu, setCpu] = createSignal(PROCS.map((p) => p.cpu));
  const [sel, setSel] = createSignal(1);
  const [notice, setNotice] = createSignal("");
  const [started] = createSignal(Date.now());
  const samples: number[] = [];
  let touched = false;

  onMount(() => {
    // fake load = slow random walk + whatever the visitor is doing right now
    let base = 0.3;
    let activity = 0;
    let lastMove: { x: number; y: number } | undefined;
    const sample = (): number => {
      base = clamp(base + (Math.random() - 0.5) * 0.06, 0.3, 0.65);
      activity *= 0.92;
      return clamp(base + activity + (Math.random() - 0.5) * 0.08);
    };
    for (let i = 0; i < 400; i++) samples.push(sample());

    const timer = setInterval(() => {
      const v = sample();
      samples.push(v);
      if (samples.length > 1200) samples.shift();
      setCpu(
        PROCS.map((p) =>
          p.state === "R"
            ? Math.round(
                p.cpu * (0.5 + v * 1.6) * (0.85 + Math.random() * 0.3) * 10,
              ) / 10
            : p.cpu,
        ),
      );
      setTick((t) => t + 1);
    }, 250);

    // ponytail: walk through processes until the visitor takes over
    const tour = setInterval(() => {
      if (!touched) setSel((s) => (s + 1) % PROCS.length);
    }, 6000);

    const onMove = (e: PointerEvent): void => {
      if (lastMove) {
        const d = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y);
        activity = Math.min(0.5, activity + d / 4000);
      }
      lastMove = { x: e.clientX, y: e.clientY };
    };
    const onKey = (e: KeyboardEvent): void => {
      activity = Math.min(0.5, activity + 0.08);
      if (e.target instanceof HTMLInputElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const move = { ArrowDown: 1, j: 1, ArrowUp: -1, k: -1 }[e.key];
      if (move !== undefined) {
        e.preventDefault();
        touched = true;
        setSel((s) => (s + move + PROCS.length) % PROCS.length);
      } else if (e.key === "t") {
        const p = PROCS[sel()];
        setNotice(`kill: (${p.pid}) - operation not permitted`);
        setTimeout(() => setNotice(""), 2500);
      } else if (
        e.key === "Enter" &&
        document.activeElement === document.body
      ) {
        const link = PROCS[sel()].link;
        if (link) window.open(link.href, "_blank", "noopener");
      }
    };
    const onDown = (): void => {
      touched = true;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    onCleanup(() => {
      clearInterval(timer);
      clearInterval(tour);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    });
  });

  const running = (): number => PROCS.filter((p) => p.state === "R").length;
  const load = createMemo(() => {
    tick();
    const avg = (n: number): string => {
      const xs = samples.slice(-n);
      return ((xs.reduce((s, x) => s + x, 0) / (xs.length || 1)) * 4).toFixed(
        2,
      );
    };
    return `${avg(4)} ${avg(240)} ${avg(1200)}`;
  });

  return (
    <BaseLayout
      title="Home"
      description="tun43p, independent developer running JOFNU. I build AI workflows, trading bots and automation."
    >
      <div class="desk">
        <Shell
          select={(i) => {
            touched = true;
            setSel(i);
          }}
        />

        <section class="pane" aria-label="process monitor">
          <header>btop</header>
          <div class="top">
            <div class="box">
              <span class="label">cpu</span>
              <span class="hint">
                1 human, {running()} busy cores, up{" "}
                {(tick(), duration(Date.now() - started()))}
              </span>
              <div class="flex flex-1 min-h-0 gap-5">
                <div class="relative flex-1 min-w-0">
                  <Graph tick={tick} samples={samples} />
                </div>
                <div class="hidden sm:flex flex-col gap-1 w-72 shrink-0 overflow-hidden">
                  <Index
                    each={PROCS.filter((p) => p.state === "R").slice(0, 6)}
                  >
                    {(p) => {
                      const i = PROCS.indexOf(p());
                      return (
                        <div class="grid grid-cols-[9em_1fr_3em] items-center gap-2">
                          <span class="text-ash truncate">{p().name}</span>
                          <Meter value={cpu()[i] / 60} />
                          <span class="text-right">{cpu()[i].toFixed(0)}%</span>
                        </div>
                      );
                    }}
                  </Index>
                  <div class="mt-auto text-ash">
                    load avg <span class="text-bone">{load()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="box">
              <span class="label">mem</span>
              <span class="hint">stack</span>
              <div class="flex flex-col gap-2">
                <Index each={STACK}>
                  {(s) => (
                    <div class="grid grid-cols-[6.5em_1fr_12em] items-center gap-3">
                      <span>{s().name}</span>
                      <Meter value={s().use} />
                      <span class="text-ash text-right truncate">
                        {s().note}
                      </span>
                    </div>
                  )}
                </Index>
              </div>
            </div>

            <div class="box">
              <span class="label">proc</span>
              <span class="hint">
                <Show
                  when={notice()}
                  fallback={
                    <>
                      <span class="text-bone">↑↓</span> select{" "}
                      <span class="text-bone">t</span> terminate
                    </>
                  }
                >
                  <span class="text-hot">{notice()}</span>
                </Show>
              </span>
              <div class="grid grid-cols-[3.5em_9em_1fr_4em] md:grid-cols-[3.5em_10em_1fr_4em_5em_2em_8em] gap-x-3 px-2 pb-1 text-ash">
                <span class="text-right">pid</span>
                <span>program</span>
                <span class="hidden md:block">command</span>
                <span class="hidden md:block text-right">threads</span>
                <span class="hidden md:block">user</span>
                <span class="hidden md:block">s</span>
                <span class="text-right">cpu%</span>
              </div>
              <div
                class="flex-1 min-h-0 overflow-y-auto"
                role="listbox"
                aria-label="processes"
              >
                <Index each={PROCS}>
                  {(p, i) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={sel() === i}
                      onClick={() => setSel(i)}
                      class={`w-full grid grid-cols-[3.5em_9em_1fr_4em] md:grid-cols-[3.5em_10em_1fr_4em_5em_2em_8em] gap-x-3 px-2 text-left leading-[1.9] ${
                        sel() === i
                          ? "bg-rule text-bone"
                          : p().state === "R"
                            ? ""
                            : "text-ash"
                      }`}
                    >
                      <span class="text-right text-ash">{p().pid}</span>
                      <span class="truncate">{p().name}</span>
                      <span class="hidden md:block truncate text-ash">
                        {p().cmd}
                      </span>
                      <span class="hidden md:block text-right">
                        {p().threads}
                      </span>
                      <span class="hidden md:block text-ash">{p().user}</span>
                      <span class={`hidden md:block ${STATE[p().state][1]}`}>
                        {p().state}
                      </span>
                      <span class="flex items-center justify-end gap-2">
                        <span class="hidden md:block w-10">
                          <Meter value={cpu()[i] / 60} />
                        </span>
                        {cpu()[i].toFixed(1)}
                      </span>
                    </button>
                  )}
                </Index>
              </div>
            </div>

            <Info proc={() => PROCS[sel()]} cpu={() => cpu()[sel()]} />
          </div>
        </section>

        <StatusBar tick={tick} />
      </div>
    </BaseLayout>
  );
}

const LINKS: Record<string, string> = {
  github: GITHUB_PROFILE_URL,
  linkedin: LINKEDIN_PROFILE_URL,
  jofnu: JOFNU_URL,
  mail: `mailto:${EMAIL}`,
  zat: `${GITHUB_PROFILE_URL}/zat`,
  source: SOURCE_URL,
};

const HELP: [string, string][] = [
  ["help", "this list"],
  ["whoami", "who runs this machine"],
  ["ls", "what i work on"],
  ["cat <name>", "details about one of them"],
  ["ps", "the process table"],
  ["open <link>", Object.keys(LINKS).join(", ")],
  ["clear", "clear the screen"],
];

// kill, sudo, echo and exit work too, they are just not advertised
const COMMANDS = [
  ...HELP.map(([c]) => c.split(" ")[0]),
  "kill",
  "sudo",
  "echo",
  "exit",
];

type Entry = { cmd: string; out: () => JSX.Element };

function Card(props: { main?: boolean }): JSX.Element {
  const name =
    "text-[clamp(3rem,9vw,5.5rem)] leading-[0.85] font-extrabold [font-stretch:112.5%] tracking-[-0.04em]";
  const facts: [string, JSX.Element][] = [
    ["role", "independent developer"],
    [
      "company",
      <a href={JOFNU_URL} target="_blank" rel="noopener noreferrer">
        jofnu
      </a>,
    ],
    ["builds", "ai workflows, trading bots, automation"],
    ["contact", <a href={`mailto:${EMAIL}`}>{EMAIL}</a>],
  ];

  return (
    <div class="flex flex-col md:flex-row md:items-end gap-x-12 gap-y-4 py-1">
      <Show when={props.main} fallback={<p class={name}>tun43p</p>}>
        <h1 class={name}>tun43p</h1>
      </Show>
      <dl class="grid grid-cols-[6em_1fr] gap-x-4 text-[13px] [font-stretch:100%]">
        <Index each={facts}>
          {(f) => (
            <>
              <dt class="text-ash">{f()[0]}</dt>
              <dd>{f()[1]}</dd>
            </>
          )}
        </Index>
      </dl>
    </div>
  );
}

function Prompt(props: { children?: JSX.Element }): JSX.Element {
  return (
    <span class="text-ash shrink-0">
      <span class="text-accent">tun43p@jofnu</span> ~ % {props.children}
    </span>
  );
}

function Shell(props: { select: (_i: number) => void }): JSX.Element {
  const [entries, setEntries] = createSignal<Entry[]>([
    { cmd: "whoami", out: (): JSX.Element => <Card main /> },
  ]);
  const [value, setValue] = createSignal("");
  const history: string[] = [];
  let cursor = 0;
  let input!: HTMLInputElement;
  let screen!: HTMLDivElement;

  // side effects run now, output renders later inside the component (keeps Solid's ownership happy)
  const run = (line: string): (() => JSX.Element) => {
    const [cmd = "", ...args] = line.trim().split(/\s+/);
    const arg = args.join(" ");
    switch (cmd) {
      case "":
        return () => "";
      case "help":
        return () => (
          <dl class="grid grid-cols-[12ch_1fr] gap-x-4">
            <Index each={HELP}>
              {(h) => (
                <>
                  <dt>{h()[0]}</dt>
                  <dd class="text-ash">{h()[1]}</dd>
                </>
              )}
            </Index>
          </dl>
        );
      case "whoami":
        return () => <Card />;
      case "ls":
        return () => (
          <p class="flex flex-wrap gap-x-[2ch]">
            <Index each={PROCS}>
              {(p) => <span class={STATE[p().state][1]}>{p().name}</span>}
            </Index>
          </p>
        );
      case "cat": {
        const i = PROCS.findIndex((p) => p.name === arg);
        if (i < 0) {
          return () =>
            arg
              ? `cat: ${arg}: no such file or directory`
              : "cat: missing operand, try ls";
        }
        props.select(i);
        const p = PROCS[i];
        return () => (
          <div class="max-w-[72ch]">
            <p>{p.info}</p>
            <Show when={p.stack}>
              <p class="text-ash">stack {p.stack}</p>
            </Show>
          </div>
        );
      }
      case "ps":
        return () => (
          <div class="grid grid-cols-[4ch_2ch_14ch_1fr] gap-x-3">
            <span class="text-ash text-right">pid</span>
            <span class="text-ash">s</span>
            <span class="text-ash">name</span>
            <span class="text-ash">command</span>
            <Index each={PROCS}>
              {(p) => (
                <>
                  <span class="text-right">{p().pid}</span>
                  <span class={STATE[p().state][1]}>{p().state}</span>
                  <span>{p().name}</span>
                  <span class="text-ash truncate">{p().cmd}</span>
                </>
              )}
            </Index>
          </div>
        );
      case "open": {
        const href = LINKS[arg];
        if (href === undefined) {
          return () =>
            `open: ${arg || "missing link"}, try ${Object.keys(LINKS).join(", ")}`;
        }
        window.open(href, "_blank", "noopener");
        return () => `opening ${arg}`;
      }
      case "kill":
        return () =>
          arg === "1"
            ? "kill: (1) - nice try, that one pays the bills"
            : `kill: (${arg || "?"}) - operation not permitted`;
      case "sudo":
        return () =>
          "tun43p is not in the sudoers file. this incident will be reported.";
      case "echo":
        return () => arg;
      case "exit":
        return () => "there is no exit. try open mail.";
      default:
        return () => `zsh: command not found: ${cmd}`;
    }
  };

  const print = (cmd: string, out: () => JSX.Element): void => {
    setEntries((es) => [...es, { cmd, out }]);
    screen.scrollTop = screen.scrollHeight;
  };

  const submit = (e: SubmitEvent): void => {
    e.preventDefault();
    const line = value().trim();
    setValue("");
    if (line) history.push(line);
    cursor = history.length;
    if (line === "clear") setEntries([]);
    else print(line, run(line));
  };

  const complete = (): void => {
    const parts = value().split(" ");
    const pool =
      parts.length === 1
        ? COMMANDS
        : parts[0] === "cat"
          ? PROCS.map((p) => p.name)
          : parts[0] === "open"
            ? Object.keys(LINKS)
            : [];
    const hits = pool.filter((c) => c.startsWith(parts[parts.length - 1]));
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      setValue(parts.join(" ") + (parts.length === 1 ? " " : ""));
    } else if (hits.length > 1) {
      print(value(), () => hits.join("  "));
    }
  };

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      cursor = Math.max(
        0,
        Math.min(history.length, cursor + (e.key === "ArrowUp" ? -1 : 1)),
      );
      setValue(history[cursor] ?? "");
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setEntries([]);
    } else if (e.ctrlKey && e.key === "c") {
      print(`${value()}^C`, () => "");
      setValue("");
    } else if (e.key === "Escape") {
      input.blur();
    }
  };

  return (
    <section class="pane" aria-label="terminal">
      <header>whoami</header>
      <div
        ref={screen}
        class="px-5 py-4 flex flex-col gap-1.5 max-h-[70vh] min-[1100px]:h-[220px] overflow-y-auto"
        onClick={(e) => {
          const target = e.target as Element;
          const selected = window.getSelection()?.toString() ?? "";
          if (selected === "" && !target.closest("a")) input.focus();
        }}
      >
        <Index each={entries()}>
          {(entry) => (
            <div class="flex flex-col gap-1.5">
              <p>
                <Prompt>{entry().cmd}</Prompt>
              </p>
              <div class="whitespace-pre-wrap empty:hidden">
                {entry().out()}
              </div>
            </div>
          )}
        </Index>
        <form onSubmit={submit} class="prompt flex items-baseline">
          <Prompt />
          <span class="caret ml-[1ch]" aria-hidden="true" />
          <input
            ref={input}
            value={value()}
            onInput={(e) => setValue(e.currentTarget.value)}
            onKeyDown={onKey}
            placeholder="help"
            aria-label="terminal input, type help"
            autocomplete="off"
            autocapitalize="off"
            spellcheck={false}
            class="flex-1 min-w-0 bg-transparent outline-none text-bone placeholder:text-dim caret-bone max-md:text-[16px]"
          />
        </form>
      </div>
    </section>
  );
}

function Info(props: { proc: () => Proc; cpu: () => number }): JSX.Element {
  return (
    <div class="box" aria-live="polite">
      <span class="label">info</span>
      <span class="hint">pid {props.proc().pid}</span>
      <h2 class="text-[15px] font-semibold mb-1">{props.proc().name}</h2>
      <p class="text-ash mb-4">
        <span class={STATE[props.proc().state][1]}>
          {STATE[props.proc().state][0]}
        </span>
        , cpu {props.cpu().toFixed(1)}%, {props.proc().threads} threads,{" "}
        {props.proc().user}
      </p>
      <p class="text-[13px] [font-stretch:100%] leading-relaxed max-w-[52ch]">
        {props.proc().info}
      </p>
      <Show when={props.proc().stack}>
        {(stack) => (
          <p class="mt-4">
            <span class="text-ash">stack </span>
            {stack()}
          </p>
        )}
      </Show>
      <Show when={props.proc().link}>
        {(link) => (
          <a
            class="mt-4 self-start text-accent"
            href={link().href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link().label}
          </a>
        )}
      </Show>
    </div>
  );
}

function Meter(props: { value: number }): JSX.Element {
  const pct = (): number => Math.max(1, clamp(props.value) * 100);
  return (
    <div class="meter" aria-hidden="true">
      <span style={{ width: `${pct()}%`, "--track": `${10000 / pct()}%` }} />
    </div>
  );
}

function Graph(props: { tick: () => number; samples: number[] }): JSX.Element {
  let canvas!: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const css = getComputedStyle(document.documentElement);
    const color = (n: string): string =>
      css.getPropertyValue(`--color-${n}`).trim();
    const C = {
      accent: color("accent"),
      warn: color("warn"),
      hot: color("hot"),
      rule: color("rule"),
    };

    const draw = (): void => {
      const dpr = devicePixelRatio || 1;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== Math.round(W * dpr))
        canvas.width = Math.round(W * dpr);
      if (canvas.height !== Math.round(H * dpr))
        canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // braille-like dot matrix: one column per sample, newest on the right
      const PITCH = 3;
      const cols = Math.floor(W / PITCH);
      const rows = Math.floor(H / PITCH);
      const s = props.samples;
      for (let c = 0; c < cols; c++) {
        const v = s[s.length - cols + c] ?? 0;
        const h = Math.round(v * rows);
        for (let r = 0; r < rows; r++) {
          if (r >= h && (c % 2 || r % 2)) continue; // sparse background grid
          const f = r / rows;
          ctx.fillStyle =
            r >= h ? C.rule : f < 0.5 ? C.accent : f < 0.8 ? C.warn : C.hot;
          ctx.fillRect(c * PITCH, H - (r + 1) * PITCH, 2, 2);
        }
      }
    };

    createEffect(() => {
      props.tick();
      draw();
    });
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    onCleanup(() => ro.disconnect());
  });

  return (
    <canvas
      ref={canvas}
      class="absolute inset-0 w-full h-full"
      role="img"
      aria-label="cpu graph, it reacts to your mouse and keyboard"
    />
  );
}

function StatusBar(props: { tick: () => number }): JSX.Element {
  const now = createMemo(() => (props.tick(), new Date()));
  const stamp = (d: Date): string =>
    `${pad(d.getHours())}:${pad(d.getMinutes())} ${d.getDate()}-${d.toLocaleString("en-US", { month: "short" })}-${String(d.getFullYear()).slice(2)}`;
  const ext = { target: "_blank", rel: "noopener noreferrer" };

  return (
    <nav class="bar" aria-label="links">
      <span class="px-2 hidden md:inline">[tun43p]</span>
      <a href="/" aria-current="page" class="hidden md:inline">
        0:btop*
      </a>
      <a href={GITHUB_PROFILE_URL} {...ext}>
        1:github
      </a>
      <a href={LINKEDIN_PROFILE_URL} {...ext}>
        2:linkedin
      </a>
      <a href={JOFNU_URL} {...ext}>
        3:jofnu
      </a>
      <a href={`mailto:${EMAIL}`}>4:mail</a>
      <span class="ml-auto px-2 hidden md:inline">
        "tun43p.com" {stamp(now())}
      </span>
    </nav>
  );
}
