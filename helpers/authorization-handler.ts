// Copyright 2023-Present Soma Notes
import { create, verify } from "djwt";
import { AuthUser } from "../signal/auth.ts";
import { getJwtKey } from "./deno-kv.ts";

export const generateJwt = async (
  user: AuthUser,
  origin: string,
): Promise<string> => {
  const key = await getJwtKey();
  const now = Date.now() / 1000;

  const jwt = await create(
    { alg: "HS512", typ: "JWT" },
    {
      iss: origin,
      aud: origin,
      sub: user.userId as string,
      nbf: now,
      iat: now,
      exp: now + (60 * 60 * 24 * 7),
      jti: Math.random().toString(36).slice(2),
      subscription: user.subscription,
    },
    key,
  );

  return jwt;
};

export const authorizationHandler = async (
  userId: string,
  jwt: string,
): Promise<boolean> => {
  try {
    const key = await getJwtKey();
    const payload = await verify(jwt, key);
    if (!payload?.sub) return false;

    return String(payload.sub) === String(userId);
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getJwtPayload = async (
  jwt: string,
): Promise<Record<string, unknown> | null> => {
  try {
    const key = await getJwtKey();
    const payload = await verify(jwt, key);

    return payload;
  } catch (e) {
    console.error(e);
    return null;
  }
};
