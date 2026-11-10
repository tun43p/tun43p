import { createMemo, Index, JSX, onMount } from "solid-js";

type Line = { text: string; kind: "head" | "code" | "quote" | "text" };

const URL_RE = /(https?:\/\/[^\s)>\]]+)/g;

// raw markdown, lightly colored, like less with a syntax-aware lesspipe
function parse(text: string): Line[] {
  let fenced = false;
  return text.split("\n").map((line) => {
    if (line.startsWith("```")) {
      fenced = !fenced;
      return { text: line, kind: "code" };
    }
    if (fenced) return { text: line, kind: "code" };
    if (line.startsWith("#")) return { text: line, kind: "head" };
    if (line.startsWith(">")) return { text: line, kind: "quote" };
    return { text: line, kind: "text" };
  });
}

const KIND = {
  head: "text-accent font-bold",
  code: "text-ash",
  quote: "text-ash italic",
  text: "",
} as const;

function Linkified(props: { text: string }): JSX.Element {
  return (
    <Index each={props.text.split(URL_RE)}>
      {(part, i) =>
        i % 2 ? (
          <a href={part()} target="_blank" rel="noopener noreferrer">
            {part()}
          </a>
        ) : (
          part()
        )
      }
    </Index>
  );
}

export default function PagerComponent(props: {
  title: string;
  text: string;
  onClose: () => void;
}): JSX.Element {
  let view!: HTMLDivElement;
  const lines = createMemo(() => parse(props.text));

  onMount(() => view.focus());

  const onKey = (e: KeyboardEvent): void => {
    const page = view.clientHeight - 40;
    const step = {
      j: 20,
      ArrowDown: 20,
      k: -20,
      ArrowUp: -20,
      " ": page,
      b: -page,
    }[e.key];
    if (e.key === "q" || e.key === "Escape") {
      e.preventDefault();
      props.onClose();
    } else if (e.key === "g") {
      view.scrollTop = 0;
    } else if (e.key === "G") {
      view.scrollTop = view.scrollHeight;
    } else if (step !== undefined) {
      e.preventDefault();
      view.scrollBy({ top: step });
    }
  };

  return (
    <section class="pane" aria-label={`pager: ${props.title}`}>
      <header class="flex">
        <span>less {props.title}</span>
        <span class="ml-auto text-dim">q quit, j k space scroll, g G ends</span>
      </header>
      <div
        ref={view}
        data-pager
        tabIndex={0}
        onKeyDown={onKey}
        class="flex-1 min-h-0 overflow-y-auto px-5 py-4 text-[13px] [font-stretch:100%] outline-none"
      >
        <Index each={lines()}>
          {(line) => (
            <p
              class={`whitespace-pre-wrap min-h-[1.55em] max-w-[96ch] ${KIND[line().kind]}`}
            >
              <Linkified text={line().text} />
            </p>
          )}
        </Index>
        <p class="mt-2 inline-block bg-bone text-ink px-1">(END)</p>
      </div>
    </section>
  );
}
