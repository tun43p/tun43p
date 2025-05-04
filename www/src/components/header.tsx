import { useLocation } from "@solidjs/router";
import { JSX } from "solid-js";

import LinkComponent from "./link";

export default function HeaderComponent(): JSX.Element {
  const location = useLocation();

  const active = (path: string): string =>
    path === location.pathname ? "opacity-100" : "opacity-50 hover:opacity-100";

  const links = [
    {
      name: "home",
      href: "/",
    },
    {
      name: "logs",
      href: "/logs",
    },
    {
      name: "contact",
      href: "/contact",
    },
  ];

  return (
    <nav class="py-4">
      <ul class="!flex-row items-center justify-end !list-none">
        {links.map((link) => (
          <li class={`${active(link.href)}`}>
            <LinkComponent type="internal" href={link.href}>
              {link.name}
            </LinkComponent>
          </li>
        ))}
      </ul>
    </nav>
  );
}
