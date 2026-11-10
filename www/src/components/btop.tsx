import {
  createEffect,
  createMemo,
  Index,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";

import { PROCS, type Proc, STACK, STATE } from "~/core/content";

const pad = (n: number): string => String(n).padStart(2, "0");
const duration = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};

type Props = {
  tick: () => number;
  cpu: () => number[];
  samples: number[];
  sel: () => number;
  select: (_i: number) => void;
  notice: () => string;
  started: () => number;
};

export default function BtopComponent(props: Props): JSX.Element {
  const running = (): number => PROCS.filter((p) => p.state === "R").length;
  const load = createMemo(() => {
    props.tick();
    const avg = (n: number): string => {
      const xs = props.samples.slice(-n);
      return ((xs.reduce((s, x) => s + x, 0) / (xs.length || 1)) * 4).toFixed(
        2,
      );
    };
    return `${avg(4)} ${avg(240)} ${avg(1200)}`;
  });

  return (
    <section class="pane" aria-label="process monitor">
      <header>btop</header>
      <div class="top">
        <div class="box">
          <span class="label">cpu</span>
          <span class="hint">
            1 human, {running()} busy cores, up{" "}
            {(props.tick(), duration(Date.now() - props.started()))}
          </span>
          <div class="flex flex-1 min-h-0 gap-5">
            <div class="relative flex-1 min-w-0">
              <Graph tick={props.tick} samples={props.samples} />
            </div>
            <div class="hidden sm:flex flex-col gap-1 w-72 shrink-0 overflow-hidden">
              <Index each={PROCS.filter((p) => p.state === "R").slice(0, 6)}>
                {(p) => {
                  const i = PROCS.indexOf(p());
                  return (
                    <div class="grid grid-cols-[9em_1fr_3em] items-center gap-2">
                      <span class="text-ash truncate">{p().name}</span>
                      <Meter value={props.cpu()[i] / 60} />
                      <span class="text-right">
                        {props.cpu()[i].toFixed(0)}%
                      </span>
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
                  <span class="text-ash text-right truncate">{s().note}</span>
                </div>
              )}
            </Index>
          </div>
        </div>

        <div class="box">
          <span class="label">proc</span>
          <span class="hint">
            <Show
              when={props.notice()}
              fallback={
                <>
                  <span class="text-bone">↑↓</span> select{" "}
                  <span class="text-bone">t</span> terminate
                </>
              }
            >
              <span class="text-hot">{props.notice()}</span>
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
                  aria-selected={props.sel() === i}
                  onClick={() => props.select(i)}
                  class={`w-full grid grid-cols-[3.5em_9em_1fr_4em] md:grid-cols-[3.5em_10em_1fr_4em_5em_2em_8em] gap-x-3 px-2 text-left leading-[1.9] ${
                    props.sel() === i
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
                  <span class="hidden md:block text-right">{p().threads}</span>
                  <span class="hidden md:block text-ash">{p().user}</span>
                  <span class={`hidden md:block ${STATE[p().state][1]}`}>
                    {p().state}
                  </span>
                  <span class="flex items-center justify-end gap-2">
                    <span class="hidden md:block w-10">
                      <Meter value={props.cpu()[i] / 60} />
                    </span>
                    {props.cpu()[i].toFixed(1)}
                  </span>
                </button>
              )}
            </Index>
          </div>
        </div>

        <Info
          proc={() => PROCS[props.sel()]}
          cpu={() => props.cpu()[props.sel()]}
        />
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
  const pct = (): number => Math.max(1, Math.min(1, props.value) * 100);
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
