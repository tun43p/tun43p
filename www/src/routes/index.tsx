import { createSignal, JSX, onCleanup, onMount } from "solid-js";

import Btop from "~/components/btop";
import Shell from "~/components/shell";
import StatusBar from "~/components/status-bar";
import { PROCS } from "~/core/content";
import BaseLayout from "~/layouts/base";

const clamp = (v: number, lo = 0, hi = 1): number =>
  Math.min(hi, Math.max(lo, v));

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

        <Btop
          tick={tick}
          cpu={cpu}
          samples={samples}
          sel={sel}
          select={setSel}
          notice={notice}
          started={started}
        />

        <StatusBar tick={tick} />
      </div>
    </BaseLayout>
  );
}
