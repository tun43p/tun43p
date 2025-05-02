import { JSX } from "solid-js";

type LinkProps = {
  type: "internal" | "external";
  children: string;
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function LinkComponent(props: LinkProps): JSX.Element {
  if (props.type === "internal") {
    return <a {...props}>{props.children}</a>;
  }

  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
}
