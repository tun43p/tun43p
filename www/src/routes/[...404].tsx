import { JSX } from "solid-js";

import LinkComponent from "~/components/link";
import BaseLayout from "~/layouts/base";

export default function NotFoundRoute(): JSX.Element {
  return (
    <BaseLayout
      title="Page not found"
      description="The page you are looking for does not exist or has been moved."
    >
      <div>
        <h1 class="glitch-text">oups... page not found</h1>
        <p class="glitch-text">
          the page you are looking for does not exist or has been moved. you can
          go back to the{" "}
          <LinkComponent type="internal" href="/">
            home page
          </LinkComponent>{" "}
          or try to search for what you are looking for.
        </p>
      </div>
    </BaseLayout>
  );
}
