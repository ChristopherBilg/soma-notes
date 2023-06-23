export interface AccessTokenResponse {
  ok: boolean;
  error: string | null;
  accessToken: string | null;
}

const NullAccessTokenResponse: AccessTokenResponse = {
  ok: false,
  error: null,
  accessToken: null,
};

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
      ...NullAccessTokenResponse,
      error: await response.text(),
    };
  }

  const data = await response.json();
  const accessToken = data?.["access_token"];
  if (!accessToken) {
    return {
      ...NullAccessTokenResponse,
      error: "Access token not found in response.",
    };
  }

  if (typeof accessToken !== "string") {
    return {
      ...NullAccessTokenResponse,
      error: "Access token is not a string.",
    };
  }

  return {
    ...NullAccessTokenResponse,
    ok: true,
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

export const NullUserDataResponse: UserDataResponse = {
  ok: false,
  error: null,
  userId: null,
  userName: null,
  avatarUrl: null,
};

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
      ...NullUserDataResponse,
      error: await response.text(),
    };
  }

  const userData = await response.json();
  if (!userData) {
    return {
      ...NullUserDataResponse,
      error: "User data not found in response.",
    };
  }

  return {
    ...NullUserDataResponse,
    ok: true,
    userId: userData.id as string,
    userName: userData.login as string,
    avatarUrl: userData["avatar_url"] as string,
  };
};
