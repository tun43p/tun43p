import { JSX } from "solid-js";

import LinkComponent from "~/components/link";
import BaseLayout from "~/layouts/base";

import {
  EMAIL,
  DISCORD_PROFILE_URL,
  X_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
} from "~/core/constants";

export default function ContactRoute(): JSX.Element {
  return (
    <BaseLayout title="contact">
      <h1>get in touch</h1>
      <p>
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
      <ul>
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
    </BaseLayout>
  );
}
