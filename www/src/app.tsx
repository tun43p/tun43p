import { JSX, Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import HeaderComponent from "./components/header";
import FooterComponent from "./components/footer";
import BackgroundComponent from "./components/background";
import LoadingComponent from "./components/loading";

import "./app.css";

export default function App(): JSX.Element {
  return (
    <MetaProvider>
      <Router
        root={(props) => {
          return (
            <div class="w-2xl mx-auto h-screen">
              <Suspense fallback={<LoadingComponent />}>
                <BackgroundComponent />
                <HeaderComponent />
                {props.children}
                <FooterComponent />
              </Suspense>
            </div>
          );
        }}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
