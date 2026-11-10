import { createSignal, Index, JSX, Show } from "solid-js";

import { EMAIL, JOFNU_URL } from "~/core/constants";
import { LINKS, PROCS, STATE } from "~/core/content";
import { NOTES } from "~/core/notes";
import { applyTheme, currentTheme, type Theme, THEMES } from "~/core/theme";

const HELP: [string, string][] = [
  ["help", "this list"],
  ["whoami", "who runs this machine"],
  ["ls", "what i work on, and my notes"],
  ["cat <name>", "details about one of them"],
  ["less <note>", "read a note"],
  ["ps", "the process table"],
  ["cowsay <text>", "let the cow say it"],
  ["sl", "for when you mistype ls"],
  ["open <link>", Object.keys(LINKS).join(", ")],
  ["theme <mode>", THEMES.join(", ")],
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

const ARGS: Record<string, string[]> = {
  cat: PROCS.map((p) => p.name),
  open: Object.keys(LINKS),
  less: Object.keys(NOTES),
  ls: ["notes"],
  theme: THEMES,
};

const TRAIN = `      _______
 ____|  |__  |________    __________    __________
|  tun43p express     |==|  []  []  |==|  []  []  |
|_____________________|  |__________|  |__________|
  (o)(o)       (o)(o)      (o)  (o)      (o)  (o)`;

const COW = `        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

function cowsay(text: string): string {
  const t = (text || "moo").slice(0, 60);
  return ` ${"_".repeat(t.length + 2)}\n< ${t} >\n ${"-".repeat(t.length + 2)}\n${COW}`;
}

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

export default function ShellComponent(props: {
  select: (_i: number) => void;
  openNote: (_name: string) => void;
}): JSX.Element {
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
          <div>
            <dl class="grid grid-cols-[14ch_1fr] gap-x-4">
              <Index each={HELP}>
                {(h) => (
                  <>
                    <dt>{h()[0]}</dt>
                    <dd class="text-ash">{h()[1]}</dd>
                  </>
                )}
              </Index>
            </dl>
            <p class="mt-2 text-ash">
              this is tmux too: <span class="text-bone">ctrl+b ?</span> lists
              the key bindings
            </p>
          </div>
        );
      case "whoami":
        return () => <Card />;
      case "ls":
        if (arg === "notes" || arg === "notes/") {
          return () => (
            <p class="flex flex-wrap gap-x-[2ch]">
              <Index each={Object.keys(NOTES)}>
                {(n) => <span>{n()}</span>}
              </Index>
            </p>
          );
        }
        if (arg) return () => `ls: ${arg}: no such file or directory`;
        return () => (
          <p class="flex flex-wrap gap-x-[2ch]">
            <Index each={PROCS}>
              {(p) => <span class={STATE[p().state][1]}>{p().name}</span>}
            </Index>
            <span class="font-bold">notes/</span>
          </p>
        );
      case "less": {
        const name = arg.replace(/^notes\//, "").replace(/\.md$/, "");
        if (!(name in NOTES)) {
          return () =>
            arg
              ? `less: ${arg}: no such file or directory`
              : "less: missing file, try ls notes";
        }
        props.openNote(name);
        return () => `opened notes/${name}.md, q to close it`;
      }
      case "cowsay":
        return () => <pre>{cowsay(arg)}</pre>;
      case "sl":
        return () => (
          <div class="overflow-hidden">
            <pre class="sl w-max">{TRAIN}</pre>
          </div>
        );
      case "cat": {
        if (arg.startsWith("notes/")) return run(`less ${arg}`);
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
      case "theme": {
        if (arg === "") {
          return () =>
            `theme: ${currentTheme()}, try theme ${THEMES.join(", ")}`;
        }
        if (!THEMES.includes(arg as Theme)) {
          return () => `theme: ${arg}: unknown, try ${THEMES.join(", ")}`;
        }
        applyTheme(arg as Theme);
        return () => `theme set to ${arg}`;
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
    const pool = parts.length === 1 ? COMMANDS : (ARGS[parts[0]] ?? []);
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
    <section class="pane" data-pane="shell" aria-label="terminal">
      <header>whoami</header>
      <div
        ref={screen}
        data-screen
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
