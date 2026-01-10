import { pubClient, subClient } from "../config/redis.js";
import { getIO } from "../config/socket.js";

export const initSubscribers = async () => {
  await subClient.subscribe("resume:events", (err) => {
    if (err) {
      console.error("Failed to subscribe: ", err);
    } else {
      console.log("Subscribed successfully to resume:events");
    }
  });

  subClient.on("message", async (channel, message) => {
    if (channel !== "resume:events") return;
    const payload = JSON.parse(message);
    const { event, jobId, userId } = payload;
    console.log(payload);
    switch (event) {
      case "RESUME_PARSE_COMPLETED": {
        console.log("Resume parse event published");
        const io = getIO();

        if (io) {
          const socketId = await pubClient.hget("online_users", userId);
          if (socketId) {
            io.to(socketId).emit(
              "resume:parsed",
              JSON.stringify({ jobId, userId, event })
            );
          }
        }
      }
      case "RESUME_PARSE_AI_COMPLETED": {
        const { parsedNewResume, userUpdateCurrentResumeId, usage } = payload;

        console.log("Resume parse ai event published");
        const io = getIO();

        if (io) {
          const socketId = await pubClient.hget("online_users", userId);
          if (socketId) {
            io.to(socketId).emit(
              "resume:ai:parsed",
              JSON.stringify({ jobId, userId, event, parsedNewResume })
            );
          }
        }
        break;
      }
    }
  });
};
