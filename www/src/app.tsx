import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { JSX, Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import Navigation from "~/components/navigation";
import "./app.css";

export default function App(): JSX.Element {
  return (
    <MetaProvider>
      <Router
        root={(props) => (
          <div class="w-2xl mx-auto">
            <Navigation />
            <Suspense>{props.children}</Suspense>
          </div>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
