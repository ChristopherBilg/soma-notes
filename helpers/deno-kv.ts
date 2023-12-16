// Copyright 2023-Present Soma Notes

const DENO_KV_JWT_KEY = ["jwt-authorization-key"];

export const getJwtKey = async (): Promise<CryptoKey> => {
  // @ts-ignore Property openKv does indeed exist on type 'typeof Deno'
  let kv = await Deno.openKv();
  const keyFromKv: { value: JsonWebKey } = await kv.get(DENO_KV_JWT_KEY);
  kv.close();

  let key: CryptoKey;
  if (keyFromKv.value) {
    key = await crypto.subtle.importKey(
      "jwk",
      keyFromKv.value,
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );

    if (!key) throw new Error("Could not import key from KV");
    return key;
  }

  key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  );

  const keyForKv = await crypto.subtle.exportKey("jwk", key);
  if (!keyForKv) throw new Error("Could not export key for KV");

  // @ts-ignore Property openKv does indeed exist on type 'typeof Deno'
  kv = await Deno.openKv();
  await kv.set(DENO_KV_JWT_KEY, keyForKv, {
    expireIn: 7 * 24 * 60 * 60 * 1000,
  });
  kv.close();

  return key;
};
