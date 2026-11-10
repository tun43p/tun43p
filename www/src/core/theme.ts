// Light or dark palette. "auto" follows the system; an explicit choice is remembered.
// The inline script in entry-server.tsx applies the stored choice before first paint.
export type Theme = "light" | "dark" | "auto";

export const THEMES: Theme[] = ["light", "dark", "auto"];

const KEY = "theme";

const system = (): "light" | "dark" =>
  matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

export function currentTheme(): Theme {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : "auto";
  } catch {
    return "auto";
  }
}

export function applyTheme(mode: Theme): void {
  try {
    if (mode === "auto") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, mode);
  } catch {
    // storage blocked (private mode): the choice lasts until reload
  }
  document.documentElement.dataset.theme = mode === "auto" ? system() : mode;
}

// keep "auto" in sync when the system switches; returns the cleanup
export function watchSystemTheme(): () => void {
  const mq = matchMedia("(prefers-color-scheme: light)");
  const onChange = (): void => {
    if (currentTheme() === "auto") applyTheme("auto");
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
