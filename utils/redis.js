import { createClient } from "redis";

const redis = await createClient({
  url: process.env.REDIS_URL,
}).connect();

export async function get(key) {
  const value = await redis.get(key);
  return value;
}

export async function set(key, value) {
  await redis.set(key, value);
}

export async function del(key) {
  await redis.del(key);
}

export async function exists(key) {
  const exists = await redis.exists(key);
  return exists;
}

export async function keys(pattern) {
  const keys = await redis.keys(pattern);
  return keys;
}

export async function flush() {
  await redis.flushAll();
}

export async function close() {
  await redis.quit();
}

const redisClient = {
  get,
  set,
  del,
  exists,
  keys,
  flush,
  close,
  client: redis,
};

export default redisClient;
