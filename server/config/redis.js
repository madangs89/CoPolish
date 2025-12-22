import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import IORedis from "ioredis";

export const pubClient = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // 🔥 REQUIRED for BullMQ
  tls: {},
});
export const bullClient = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // 🔥 REQUIRED for BullMQ
  tls: {},
});

export const subClient = pubClient.duplicate();

export async function connectRedis() {
  if (!pubClient.isOpen) {
    pubClient.on("connect", () => {
      console.log("Redis Pub connected");
    });

    subClient.on("connect", () => {
      console.log("Redis Sub connected");
    });
    bullClient.on("connect", () => {
      console.log("Redis Bull connected");
    });

    pubClient.on("error", (err) => {
      console.error("Redis Pub Error:", err);
    });
    pubClient.on("error", (err) => {
      console.error("Redis Pub Error:", err);
    });

    bullClient.on("error", (err) => {
      console.error("Redis Bull Error:", err);
    });

    console.log("Redis connected (pub & sub)");
  }
}
