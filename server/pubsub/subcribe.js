import dotenv from "dotenv";
dotenv.config();
import {
  mailTransporter,
  paymentSuccessTemplate,
  sendBrevoMail,
  welcomeTemplate,
} from "../config/mail.js";
import { pubClient, subClient } from "../config/redis.js";
import { getIO } from "../config/socket.js";

export const initSubscribers = async () => {
  // for resume parsing events
  await subClient.subscribe("resume:events", (err) => {
    if (err) {
      console.error("Failed to subscribe: ", err);
    } else {
      console.log("Subscribed successfully to resume:events");
    }
  });

  // for mailing events
  await subClient.subscribe("mail:events", (err) => {
    if (err) {
      console.error("Failed to subscribe: ", err);
    } else {
      console.log("Subscribed successfully to mail:events");
    }
  });

  await subClient.subscribe("job_updates", (err) => {
    if (err) {
      console.error("Failed to subscribe: ", err);
    } else {
      console.log("Subscribed successfully to job:updates");
    }
  });
  await subClient.subscribe("job_updates_linkedIn", (err) => {
    if (err) {
      console.error("Failed to subscribe: ", err);
    } else {
      console.log("Subscribed successfully to job:updates_linkedIn");
    }
  });

  subClient.on("message", async (channel, message) => {
    try {
      if (channel == "mail:events") {
        const payload = JSON.parse(message);
        const { event } = payload;
        console.log(payload);
        switch (event) {
          case "WELCOME_EMAIL": {
            const { email, name } = payload;

            // await mailTransporter.sendMail({
            //   from: `"CoPolish" <${process.env.EMAIL_FROM}>`,
            //   to: email,
            //   subject: "Welcome to CoPolish 🎉",
            //   html: template,
            // });

            await sendBrevoMail({
              to: email,
              subject: "Welcome to CoPolish 🎉",
              html: welcomeTemplate(email, name),
            });
            break;
          }
          case "PAYMENT_SUCCESS": {
            const { email, credits, totalCredits } = payload;

            // await mailTransporter.sendMail({
            //   from: `"CoPolish" <${process.env.EMAIL_FROM}>`,
            //   to: email,
            //   subject: "Payment successful 🎉",
            //   html: template,
            // });

            await sendBrevoMail({
              to: email,
              subject: "Payment successful 🎉",
              html: paymentSuccessTemplate(credits, totalCredits),
            });

            console.log("Payment success email sent to ", email);
            break;
          }
        }
      }
      if (channel === "resume:events") {
        const payload = JSON.parse(message);
        const { event, jobId, userId } = payload;
        console.log(payload);
        switch (event) {
          case "RESUME_PARSE_COMPLETED": {
            console.log("Resume parse event published");
            const io = getIO();
            const { error, isError } = payload;

            if (isError) {
              if (io) {
                const socketId = await pubClient.hget("online_users", userId);
                if (socketId) {
                  io.to(socketId).emit(
                    "resume:parsed:error",
                    JSON.stringify({ jobId, userId, event, error, isError }),
                  );
                }
              }
            } else {
              if (io) {
                const socketId = await pubClient.hget("online_users", userId);
                if (socketId) {
                  io.to(socketId).emit(
                    "resume:parsed",
                    JSON.stringify({ jobId, userId, event, error, isError }),
                  );
                }
              }
            }
            break;
          }
          case "RESUME_PARSE_AI_COMPLETED": {
            const {
              parsedNewResume,
              userUpdateCurrentResumeId,
              usage,
              error,
              isError,
              operation,
            } = payload;

            console.log({ parsedNewResume });

            console.log("Resume parse ai event published");
            const io = getIO();

            if (isError) {
              if (io) {
                const socketId = await pubClient.hget("online_users", userId);
                if (socketId) {
                  io.to(socketId).emit(
                    "resume:ai:parsed:error",
                    JSON.stringify({
                      jobId,
                      userId,
                      event,
                      parsedNewResume,
                      error,
                      isError,
                      operation,
                    }),
                  );
                }
              }
            } else {
              if (io) {
                const socketId = await pubClient.hget("online_users", userId);
                if (socketId) {
                  io.to(socketId).emit(
                    "resume:ai:parsed",
                    JSON.stringify({
                      jobId,
                      userId,
                      event,
                      parsedNewResume,
                      error,
                      isError,
                      operation,
                    }),
                  );
                }
              }
            }
            break;
          }
        }
      }
      if (channel === "job_updates") {
        const jobPayload = JSON.parse(message);
        console.log("Job update event received:", jobPayload);
        let { userId } = jobPayload;
        const io = getIO();

        if (io) {
          io.to(`user:${userId}`).emit(
            "job:update",
            JSON.stringify(jobPayload),
          );
        }
      }
      if (channel === "job_updates_linkedIn") {
        const jobPayload = JSON.parse(message);

        const { userId } = jobPayload;

        const io = getIO();

        if (io) {
          io.to(`user:${userId}`).emit(
            "job:update:linkedin",
            JSON.stringify(jobPayload),
          );
        }
      }
    } catch (error) {
      console.log("Error in subscriber:", error);
    }
  });
};
