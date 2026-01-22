import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./redis.js";

let io;

export function initSocket(httpServer, url = process.env.CLIENT_URL) {
  io = new Server(httpServer, {
    cors: {
      origin: url,
      credentials: true,
    },
  });

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", async (socket) => {
    const id = socket.handshake.auth._id;
    console.log("Authenticated user ID:", id, "on socket:", socket.id);
    await pubClient.hset("online_users", id, socket.id);

    socket.join(`user:${id}`);

    //disconnect
    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);
      await pubClient.hdel("online_users", id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
