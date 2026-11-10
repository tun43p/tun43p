import { JSX } from "solid-js";
import { useLocation } from "@solidjs/router";

import BaseLayout from "~/layouts/base";

export default function NotFoundRoute(): JSX.Element {
  const location = useLocation();

  return (
    <BaseLayout title="Not found" description="This page does not exist.">
      <div class="min-h-dvh grid place-content-center gap-3 p-6">
        <p class="text-ash">can't find window: {location.pathname}</p>
        <a href="/" class="text-accent">
          back to btop
        </a>
      </div>
    </BaseLayout>
  );
}
