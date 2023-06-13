const LandingPage = () => (
  <div class="p-4 mx-auto max-w-screen-xlg">
    <h1 class="my-6 text-center">
      Welcome to{" "}
      <b>Soma Notes</b>, a simple, global, low-latency note keeping application.
    </h1>

    <h2 class="my-6 text-center">
      <a href="/api/login">Login</a>
    </h2>

    <h2 class="my-6 text-center">
      <a href="/api/logout">Logout</a>
    </h2>

    <h2 class="my-6 text-center">
      <a href="/notes">Notes</a>
    </h2>
  </div>
);

export default LandingPage;
