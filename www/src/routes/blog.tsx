import { JSX } from "solid-js";
import { Title } from "@solidjs/meta";

import TitleComponent from "~/components/title";

export default function BlogRoute(): JSX.Element {
  return (
    <main>
      <Title>blog - tun43p</Title>
      <TitleComponent type="h1">blog</TitleComponent>
      <p>coming soon...</p>
    </main>
  );
}
