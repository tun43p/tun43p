import { JSX } from "solid-js";

import LinkComponent from "~/components/link";
import BaseLayout from "~/layouts/base";
import BackgroundComponent from "~/components/background";

export default function NotFoundRoute(): JSX.Element {
  return (
    <BaseLayout title="page not found">
      <BackgroundComponent redFilter={true} />
      <h1>oups... page not found</h1>
      <p>
        the page you are looking for does not exist or has been moved. you can
        go back to the{" "}
        <LinkComponent type="internal" href="/">
          home page
        </LinkComponent>{" "}
        or try to search for what you are looking for.
      </p>
    </BaseLayout>
  );
}
