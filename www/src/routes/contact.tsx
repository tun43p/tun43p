import { JSX } from "solid-js";
import { Title } from "@solidjs/meta";

import LinkComponent from "~/components/link";
import TitleComponent from "~/components/title";

import {
  EMAIL,
  DISCORD_PROFILE_URL,
  X_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
} from "~/core/constants";

export default function ContactRoute(): JSX.Element {
  return (
    <main>
      <Title>contact - tun43p</Title>
      <TitleComponent type="h1">want to get in touch?</TitleComponent>
      <p class="mb-6">
        you can contact me through my{" "}
        <LinkComponent type="external" href={DISCORD_PROFILE_URL}>
          discord
        </LinkComponent>{" "}
        or{" "}
        <LinkComponent type="external" href={`mailto:${EMAIL}`}>
          email
        </LinkComponent>
        .
      </p>
      <ul class="flex flex-col gap-2">
        <li>
          <LinkComponent type="external" href={`mailto:${EMAIL}`}>
            email
          </LinkComponent>
        </li>
        <li>
          <LinkComponent type="external" href={DISCORD_PROFILE_URL}>
            discord
          </LinkComponent>
        </li>
        <li>
          <LinkComponent type="external" href={X_PROFILE_URL}>
            x
          </LinkComponent>
        </li>
        <li>
          <LinkComponent type="external" href={LINKEDIN_PROFILE_URL}>
            linkedin
          </LinkComponent>
        </li>
      </ul>
    </main>
  );
}
