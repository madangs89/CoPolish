import { createClient } from "redis";

export const pubClient = createClient({
  url: process.env.REDIS_URL,
});

export const subClient = pubClient.duplicate();

export async function connectRedis() {
  if (!pubClient.isOpen) {
    pubClient.on("error", (err) => console.error("Redis Pub Error:", err));
    subClient.on("error", (err) => console.error("Redis Sub Error:", err));

    await Promise.all([pubClient.connect(), subClient.connect()]);

    console.log("Redis connected (pub & sub)");
  }
}
