import { useLocation } from "@solidjs/router";
import { JSX } from "solid-js";

export default function Nav(): JSX.Element {
  const location = useLocation();

  const active = (path: string): string =>
    path === location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";

  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
      </ul>
    </nav>
  );
}
