const Error500 = () => (
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="relative bg-white p-6 rounded-lg">
      <h1 class="text-3xl text-center mb-4">Soma Notes</h1>
      <hr class="mb-4" />
      <h2 class="text-center">Error 500: Internal Server Error</h2>
      <div class="flex justify-center m-4">
        <a
          href="/"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Home
        </a>
      </div>
    </div>
  </div>
);

export default Error500;
