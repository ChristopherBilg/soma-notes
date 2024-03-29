// Copyright 2023-Present Soma Notes
import { Head } from "$fresh/runtime.ts";
import AnchorButton from "../components/AnchorButton.tsx";

const Error500 = () => (
  <>
    <Head>
      <title>Soma Notes | Error 500</title>
    </Head>

    <div class="fixed inset-0 flex items-center justify-center">
      <div class="relative bg-white p-6 rounded-lg">
        <h1 class="text-3xl text-center mb-4">Soma Notes</h1>
        <hr class="mb-4" />
        <h2 class="text-center">Error 500: Internal Server Error</h2>
        <div class="flex justify-center m-4">
          <AnchorButton
            href="/"
            title="Home"
            rounded
          />
        </div>
      </div>
    </div>
  </>
);

export default Error500;
