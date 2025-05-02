import { JSX } from "solid-js";
import { Title } from "@solidjs/meta";

import TitleComponent from "~/components/title";
import LinkComponent from "~/components/link";

export default function NotFoundRoute(): JSX.Element {
  return (
    <main>
      <Title>page not found - tun43p</Title>
      <TitleComponent type="h1">oups... page not found</TitleComponent>
      <p>
        the page you are looking for does not exist or has been moved. you can
        go back to the{" "}
        <LinkComponent type="internal" href="/">
          home
        </LinkComponent>{" "}
        or try to search for what you are looking for.
      </p>
    </main>
  );
}
