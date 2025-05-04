import { JSX } from "solid-js";
import { Title } from "@solidjs/meta";

import LinkComponent from "~/components/link";
import TitleComponent from "~/components/title";

import { GITHUB_PROFILE_URL } from "~/core/constants";

export default function HomeRoute(): JSX.Element {
  return (
    <main>
      <Title>welcome - tun43p</Title>
      <TitleComponent type="h1">hi, i'm tun43p</TitleComponent>
      <div class="flex flex-col gap-2 mb-6">
        {[
          "I'm a full-stack developer passionate about building innovative, stylish, and intuitive stuff. I can build anything from a simple website like this one to a complex application like trading bots, blockchain apps, custom ai agents, and more.",
          "I also handle design and UX/UI for most of my projects, believing that user experience is key to any successful application.",
          "Outside of development, I enjoy sports, nature, and have been a musician for over 10 years—these keep me creative and balanced.",
          "If you're looking for a passionate, creative, and dedicated full-stack developer, let's connect and build something exceptional together!",
        ].map((text) => (
          <p>{text.toLowerCase()}</p>
        ))}
      </div>
      <TitleComponent type="h2">some cool stuff i made</TitleComponent>
      <p class="mb-6">
        most of my projects are on{" "}
        <LinkComponent type="external" href={GITHUB_PROFILE_URL}>
          github
        </LinkComponent>{" "}
        and most of them are private. here are some of my public projects, but
        you can find more on my{" "}
        <LinkComponent type="external" href={GITHUB_PROFILE_URL}>
          github profile
        </LinkComponent>
        .
      </p>
      <ul class="flex flex-col gap-2">
        {[
          {
            name: "tun43p",
            description:
              "some of my personal stuff like home server infrastructure and, this website, etc.",
            url: `${GITHUB_PROFILE_URL}/tun43p`,
          },
          {
            name: "python-uniswap-trading-bot",
            description: "a simple trading bot for uniswap written in python.",
            url: `${GITHUB_PROFILE_URL}/python-uniswap-trading-bot`,
          },
          {
            name: "url-shortener",
            description: "a simple url shortener written in go.",
            url: `${GITHUB_PROFILE_URL}/url-shortener`,
          },
          {
            name: "koala",
            description: "an amazing bug bounty toolkit for docker.",
            url: `${GITHUB_PROFILE_URL}/koala`,
          },
        ].map((project) => (
          <li>
            <LinkComponent type="external" href={project.url}>
              {project.name}
            </LinkComponent>
            : {project.description}
          </li>
        ))}
      </ul>
    </main>
  );
}
