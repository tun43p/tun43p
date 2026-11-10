// Markdown notes from the repo's notes/ folder, bundled at build time.
const files = import.meta.glob("../../../notes/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// "notes/ZIG_CONVENTIONS.md" -> "zig-conventions"
export const NOTES: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, text]) => [
    (path.split("/").pop() ?? path)
      .replace(/\.md$/, "")
      .toLowerCase()
      .replaceAll("_", "-"),
    text,
  ]),
);
