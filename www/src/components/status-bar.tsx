import { createMemo, JSX } from "solid-js";

import {
  EMAIL,
  GITHUB_PROFILE_URL,
  JOFNU_URL,
  LINKEDIN_PROFILE_URL,
} from "~/core/constants";

const pad = (n: number): string => String(n).padStart(2, "0");

export default function StatusBarComponent(props: {
  tick: () => number;
  window: () => string;
}): JSX.Element {
  const now = createMemo(() => (props.tick(), new Date()));
  const stamp = (d: Date): string =>
    `${pad(d.getHours())}:${pad(d.getMinutes())} ${d.getDate()}-${d.toLocaleString("en-US", { month: "short" })}-${String(d.getFullYear()).slice(2)}`;
  const ext = { target: "_blank", rel: "noopener noreferrer" };

  return (
    <nav class="bar" aria-label="links">
      <span class="px-2 hidden md:inline">[tun43p]</span>
      <a href="/" aria-current="page" class="hidden md:inline">
        0:{props.window()}*
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
