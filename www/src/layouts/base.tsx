import { JSX } from "solid-js";
import { Meta, Title } from "@solidjs/meta";

type Props = {
  title: string;
  children: JSX.Element;
  ogImage?: string;
  description?: string;
};

export default function BaseLayout({
  children,
  title,
  description,
  ogImage,
}: Props): JSX.Element {
  return (
    <main>
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="theme-color" content="#000000" />

      <Title>{title.toLocaleLowerCase()} | tun43p</Title>
      <Meta name="og:title" content={title} />

      {description !== undefined && (
        <>
          <Meta name="description" content={description} />
          <Meta name="og:description" content={description} />
        </>
      )}

      <Meta name="og:type" content="website" />
      <Meta name="og:url" content="https://tun43p.com" />
      <Meta name="og:site_name" content="tun43p" />
      <Meta name="og:locale" content="en_US" />

      {ogImage !== undefined && (
        <>
          <Meta name="og:image" content={ogImage} />
          <Meta name="twitter:image" content={ogImage} />
          <Meta name="twitter:image:alt" content={title} />
        </>
      )}

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" content="@tun43p" />
      <Meta name="twitter:title" content={title} />
      <Meta name="twitter:description" content={description} />
      <Meta name="twitter:creator" content="@tun43p" />
      <Meta name="twitter:domain" content="tun43p.com" />

      {children}
    </main>
  );
}
