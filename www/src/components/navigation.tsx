import { useLocation } from "@solidjs/router";
import { JSX } from "solid-js";
import LinkComponent from "./link";

export default function NavigationComponent(): JSX.Element {
  const location = useLocation();

  const active = (path: string): string =>
    path === location.pathname ? "opacity-100" : "opacity-50 hover:opacity-100";

  return (
    <nav class="my-4">
      <ul class="flex items-center justify-end gap-4">
        <li class={`${active("/")}`}>
          <LinkComponent type="internal" href="/">
            home
          </LinkComponent>
        </li>
        <li class={`${active("/contact")}`}>
          <LinkComponent type="internal" href="/contact">
            contact
          </LinkComponent>
        </li>
      </ul>
    </nav>
  );
}
