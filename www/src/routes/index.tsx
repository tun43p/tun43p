import { createSignal, JSX, onCleanup, onMount, Show } from "solid-js";

import Btop from "~/components/btop";
import Pager from "~/components/pager";
import Screensaver from "~/components/screensaver";
import Shell from "~/components/shell";
import StatusBar from "~/components/status-bar";
import {
  EMAIL,
  GITHUB_PROFILE_URL,
  JOFNU_URL,
  LINKEDIN_PROFILE_URL,
} from "~/core/constants";
import { PROCS } from "~/core/content";
import { NOTES } from "~/core/notes";
import BaseLayout from "~/layouts/base";

type PaneId = "shell" | "main";
type Page = { title: string; text: string };

const IDLE_MS = 60_000;
const WINDOWS = [
  GITHUB_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
  JOFNU_URL,
  `mailto:${EMAIL}`,
];

const KEYS = `# tmux, prefix is ctrl+b

C-b z      zoom the active pane
C-b o      switch to the other pane
C-b d      detach
C-b 1-4    open github, linkedin, jofnu, mail
C-b ?      this list

# btop

↑ ↓ j k    select a process
t          terminate it, or try to
enter      open its link

# pager

j k space  scroll
g G        top, bottom
q          quit`;

const clamp = (v: number, lo = 0, hi = 1): number =>
  Math.min(hi, Math.max(lo, v));

const paneOf = (target: EventTarget | null): PaneId | undefined => {
  const id =
    target instanceof Element
      ? target.closest("[data-pane]")?.getAttribute("data-pane")
      : undefined;
  return id === "shell" || id === "main" ? id : undefined;
};

export default function HomeRoute(): JSX.Element {
  const [tick, setTick] = createSignal(0);
  const [cpu, setCpu] = createSignal(PROCS.map((p) => p.cpu));
  const [sel, setSel] = createSignal(1);
  const [notice, setNotice] = createSignal("");
  const [started] = createSignal(Date.now());
  const [page, setPage] = createSignal<Page>();
  const [active, setActive] = createSignal<PaneId>("main");
  const [zoom, setZoom] = createSignal(false);
  const [prefix, setPrefix] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const [detached, setDetached] = createSignal(false);
  const [idle, setIdle] = createSignal(false);
  const samples: number[] = [];
  let touched = false;
  let messageTimer: ReturnType<typeof setTimeout> | undefined;

  const flash = (text: string): void => {
    clearTimeout(messageTimer);
    setMessage(text);
    messageTimer = setTimeout(() => setMessage(""), 2500);
  };

  const openNote = (name: string): void => {
    setPage({ title: `notes/${name}.md`, text: NOTES[name] });
    setActive("main");
  };

  const focusPane = (pane: PaneId): void => {
    setActive(pane);
    const target =
      pane === "shell"
        ? document.querySelector<HTMLElement>("[data-pane=shell] input")
        : document.querySelector<HTMLElement>("[data-pager]");
    if (target) target.focus();
    else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  onMount(() => {
    // fake load = slow random walk + whatever the visitor is doing right now
    let base = 0.3;
    let activity = 0;
    let lastMove: { x: number; y: number } | undefined;
    let lastInput = Date.now();
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    const saver = setInterval(() => {
      if (!calm && !detached() && Date.now() - lastInput > IDLE_MS) {
        setIdle(true);
      }
    }, 5000);

    // returns true when this input only woke the screen up
    const wake = (): boolean => {
      lastInput = Date.now();
      if (!idle()) return false;
      setIdle(false);
      return true;
    };

    const onMove = (e: PointerEvent): void => {
      wake();
      if (lastMove) {
        const d = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y);
        activity = Math.min(0.5, activity + d / 4000);
      }
      lastMove = { x: e.clientX, y: e.clientY };
    };

    // capture phase: tmux sees keys before the shell or btop do
    const onTmux = (e: KeyboardEvent): void => {
      if (wake() || detached()) {
        e.preventDefault();
        e.stopPropagation();
        setDetached(false);
        return;
      }
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        e.stopPropagation();
        setPrefix(true);
        return;
      }
      if (!prefix() || ["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      setPrefix(false);
      const win = Number(e.key);
      if (e.key === "z") setZoom((z) => !z);
      else if (e.key === "o")
        focusPane(active() === "shell" ? "main" : "shell");
      else if (e.key === "?") setPage({ title: "list-keys", text: KEYS });
      else if (e.key === "d") setDetached(true);
      else if (win >= 1 && win <= WINDOWS.length) {
        window.open(WINDOWS[win - 1], "_blank", "noopener");
      } else if (e.key !== "Escape") flash(`unknown key: C-b ${e.key}`);
    };

    const onKey = (e: KeyboardEvent): void => {
      activity = Math.min(0.5, activity + 0.08);
      if (e.target instanceof HTMLInputElement) return;
      if (e.target instanceof Element && e.target.closest("[data-pager]")) {
        return;
      }
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
      wake();
      touched = true;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onTmux, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("wheel", wake);
    onCleanup(() => {
      clearInterval(timer);
      clearInterval(tour);
      clearInterval(saver);
      clearTimeout(messageTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onTmux, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("wheel", wake);
    });
  });

  return (
    <BaseLayout
      title="Home"
      description="tun43p, independent developer running JOFNU. I build AI workflows, trading bots and automation."
    >
      <div
        class="desk"
        data-active={active()}
        data-zoom={zoom() ? active() : undefined}
        onPointerDown={(e) => setActive(paneOf(e.target) ?? active())}
        onFocusIn={(e) => setActive(paneOf(e.target) ?? active())}
      >
        <Shell
          select={(i) => {
            touched = true;
            setSel(i);
          }}
          openNote={openNote}
        />

        <Show
          when={page()}
          fallback={
            <Btop
              tick={tick}
              cpu={cpu}
              samples={samples}
              sel={sel}
              select={setSel}
              notice={notice}
              started={started}
            />
          }
        >
          {(p) => (
            <Pager
              title={p().title}
              text={p().text}
              onClose={() => setPage(undefined)}
            />
          )}
        </Show>

        <StatusBar
          tick={tick}
          window={() => (page() ? "less" : "btop")}
          prefix={prefix}
          zoom={zoom}
          message={message}
        />
      </div>

      <Show when={detached()}>
        <div
          class="fixed inset-0 z-50 bg-ink p-5 flex flex-col gap-2"
          onPointerDown={() => setDetached(false)}
        >
          <p>[detached (from session tun43p)]</p>
          <p class="text-ash">press any key to reattach</p>
        </div>
      </Show>

      <Show when={idle()}>
        <Screensaver />
      </Show>
    </BaseLayout>
  );
}
