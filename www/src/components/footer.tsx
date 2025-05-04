import { JSX } from "solid-js";

export default function FooterComponent(): JSX.Element {
  return (
    // Remove 50% of the width
    <footer class="absolute bottom-4 w-2xl mx-auto">
      <div class="flex justify-center opacity-50">
        <span>© {new Date().getFullYear()} tun43p. all rights reserved.</span>
      </div>
    </footer>
  );
}
