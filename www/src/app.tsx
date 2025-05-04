import { JSX, Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import HeaderComponent from "./components/header";
import FooterComponent from "./components/footer";
import VideoComponent from "./components/video";

import "./app.css";

export default function App(): JSX.Element {
  return (
    <MetaProvider>
      <Router
        root={(props) => (
          <div class="w-2xl mx-auto h-screen">
            <VideoComponent />
            <HeaderComponent />
            <Suspense>{props.children}</Suspense>
            <FooterComponent />
          </div>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
