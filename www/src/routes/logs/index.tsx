import { JSX } from "solid-js";
import BaseLayout from "~/layouts/base";

// interface Log {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   content: string;
// }

export default function LogsRoute(): JSX.Element {
  // const [loading, setLoading] = createSignal(true);
  // const [logs, setLogs] = createSignal<Log[]>([]);

  // onMount(() => {
  //   getLogsFromGithub().then((logs) => {
  //     setLogs(logs);
  //     setLoading(false);
  //   });
  // });

  return (
    <BaseLayout title="Logs">
      <h1>logs</h1>
      <p>logs are not available yet, come back later!</p>
      {/* {loading() ? (
        <p>loading...</p>
      ) : (
        <ul>
          {logs().map((log) => (
            <li>
              <LinkComponent type="internal" href={`/logs/${log.id}`}>
                {log.title.toLowerCase()}
              </LinkComponent>
            </li>
          ))}
        </ul>
      )} */}
    </BaseLayout>
  );
}
