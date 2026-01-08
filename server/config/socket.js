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

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
