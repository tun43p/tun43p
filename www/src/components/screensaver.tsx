import { JSX, onCleanup, onMount } from "solid-js";

const GLYPHS = "01<>/{}[]$#=+*tun43pアイウエオカキクケコサシスセソタチツテト";
const SIZE = 14;

// cmatrix-style rain, shown after a minute without input
export default function ScreensaverComponent(): JSX.Element {
  let canvas!: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--color-accent").trim();
    const ink = css.getPropertyValue("--color-ink").trim();
    // ponytail: 1x canvas, the rain does not need retina sharpness
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    ctx.font = `${SIZE}px ${css.getPropertyValue("--font-mono")}`;
    const drops = Array.from(
      { length: Math.ceil(canvas.width / SIZE) },
      () => Math.random() * -40,
    );

    const timer = setInterval(() => {
      // fade old glyphs into the theme background
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = accent;
      drops.forEach((y, i) => {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillText(glyph, i * SIZE, y * SIZE);
        drops[i] =
          y * SIZE > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    }, 50);
    onCleanup(() => clearInterval(timer));
  });

  return (
    <canvas
      ref={canvas}
      class="fixed inset-0 z-50 w-full h-full bg-ink"
      aria-hidden="true"
    />
  );
}
