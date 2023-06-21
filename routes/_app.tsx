import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

const App = ({ Component }: AppProps) => (
  <>
    <Head>
      <meta charSet="UTF-8" />
      <meta name="description" content="A simple, global, low-latency note keeping application" />
      <meta name="keywords" content="note, keeping, application, global, low-latency" />
      <meta name="author" content="Soma Notes" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>Soma Notes</title>
      <link rel="icon" type="image/x-icon" href={asset("/favicon_512x512.png")} />
    </Head>

    <Component />
  </>
);

export default App;
