export const getLogsFromGithub = async (): Promise<
  {
    id: string;
    title: string;
    description: string;
    date: string;
    content: string;
  }[]
> => {
  const logs: {
    id: string;
    title: string;
    description: string;
    date: string;
    content: string;
  }[] = [];

  const response = await fetch(
    "https://api.github.com/repos/tun43p/tun43p/contents/logs",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    },
  );

  const data = await response.json();

  for (const log of data) {
    if (log.type !== "file") continue;

    const logResponse = await fetch(log.download_url);
    const logData = await logResponse.text();

    const id = logData.match(/<!-- ID: (.*?) -->/)?.[1];
    const title = logData.match(/<!-- Title: (.*?) -->/)?.[1];
    const description = logData.match(/<!-- Description: (.*?) -->/)?.[1];
    const date = logData.match(/<!-- Date: (.*?) -->/)?.[1];

    if (
      id === undefined ||
      title === undefined ||
      description === undefined ||
      date === undefined
    ) {
      continue;
    }

    logs.push({
      id: id,
      title: title,
      description: description,
      date: date,
      content: logData,
    });
  }

  return logs;
};
