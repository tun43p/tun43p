import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { JSX, Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";

export default function App(): JSX.Element {
  return (
    <Router
      root={(props) => (
        <>
          <Nav />
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
