import { JSX } from "solid-js";

type TitleProps = {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: string;
};

export default function TitleComponent(props: TitleProps): JSX.Element {
  const { type, children } = props;

  switch (type) {
    case "h1":
      return <h1 class="text-4xl font-bold mb-6">{children}</h1>;
    case "h2":
      return <h2 class="text-3xl font-bold mb-6">{children}</h2>;
    case "h3":
      return <h3 class="text-2xl font-bold mb-6">{children}</h3>;
    case "h4":
      return <h4 class="text-xl font-bold mb-6">{children}</h4>;
    case "h5":
      return <h5 class="text-lg font-bold mb-6">{children}</h5>;
    case "h6":
      return <h6 class="text-base font-bold mb-6">{children}</h6>;
    default:
      throw new Error("Invalid title type");
  }
}
