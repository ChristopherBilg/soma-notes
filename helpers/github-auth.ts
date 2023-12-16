// Copyright 2023-Present Soma Notes
import { AuthProvider, Subscription } from "../signal/auth.ts";
import {
  AccessTokenResponse,
  NullAccessTokenResponse,
  NullUserDataResponse,
  UserDataResponse,
} from "./authentication-handler.ts";
import { ADMIN_GITHUB_USER_IDS } from "./constants.ts";

export const getGitHubAccessToken = async (
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

export const getGitHubUserData = async (
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
    user: {
      provider: AuthProvider.GitHub,
      userId: userData.id as string,
      userName: userData.login as string,
      avatarUrl: userData["avatar_url"] as string,
      subscription: ADMIN_GITHUB_USER_IDS.includes(`${userData.id}`)
        ? Subscription.Professional
        : Subscription.Free,
    },
  };
};
