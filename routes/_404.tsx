const Error404 = () => (
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="relative bg-white p-6 rounded-lg">
      <h1 class="text-center">Error 404: Page Not Found</h1>
      <div class="flex justify-center m-2">
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

export default Error404;
