export interface AccessTokenResponse {
  ok: boolean;
  error: string | null;
  accessToken: string | null;
}

export const getAccessToken = async (
  code: string,
): Promise<AccessTokenResponse> => {
  const response = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      body: JSON.stringify({
        client_id: Deno.env.get("GITHUB_CLIENT_ID"),
        client_secret: Deno.env.get("GITHUB_CLIENT_SECRET"),
        code,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    return {
      ok: false,
      error: await response.text(),
      accessToken: null,
    };
  }

  const data = await response.json();
  const accessToken = data?.["access_token"];
  if (!accessToken) {
    return {
      ok: false,
      error: "Access token not found in response.",
      accessToken: null,
    };
  }

  if (typeof accessToken !== "string") {
    return {
      ok: false,
      error: "Access token is not a string.",
      accessToken: null,
    };
  }

  return {
    ok: true,
    error: null,
    accessToken,
  };
};

export interface UserDataResponse {
  ok: boolean;
  error: string | null;
  userId: string | null;
  userName: string | null;
  avatarUrl: string | null;
}

export const getUserData = async (
  accessToken: string,
): Promise<UserDataResponse> => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  if (!response.ok) {
    return {
      ok: false,
      error: await response.text(),
      userId: null,
      userName: null,
      avatarUrl: null,
    };
  }

  const userData = await response.json();
  if (!userData) {
    return {
      ok: false,
      error: "User data not found in response.",
      userId: null,
      userName: null,
      avatarUrl: null,
    };
  }

  return {
    ok: true,
    error: null,
    userId: userData.id as string,
    userName: userData.login as string,
    avatarUrl: userData["avatar_url"] as string,
  };
};
