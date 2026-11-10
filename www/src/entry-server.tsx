// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

// runs before first paint so the stored theme never flashes; mirrors core/theme.ts
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"||t==="dark"?t:matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}catch(e){}`;

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.png" sizes="32x32" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin=""
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap"
          />
          <script innerHTML={THEME_SCRIPT} />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
