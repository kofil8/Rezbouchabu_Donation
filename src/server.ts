import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import app from "./app";
import config from "./config";
import { PrismaClient } from "@prisma/client";
import { privateMessageService } from "./app/modules/privateMessage/privateMessage.service";
import httpStatus from "http-status";
import fs from "fs";
import path from "path";
import ApiError from "./errors/ApiErrors";

const prisma = new PrismaClient();
let wss: WebSocketServer;
const channelClients = new Map<string, Set<WebSocket>>();

function broadcastToChannel(
  channelId: string,
  data: any,
  excludeSocket: WebSocket | null = null
) {
  const clients = channelClients.get(channelId);
  if (clients) {
    clients.forEach((client) => {
      if (excludeSocket !== client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log("Server running on port", config.port);
  });

  // new WebSocket server
  wss = new WebSocketServer({ server });

  // client handle connection
  wss.on("connection", (ws) => {
    console.log("New WebSocket connection!");

    let channelId: string | null = null;
    // client received message
    ws.on("message", async (message) => {
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.type === "subscribePrivate" && parsed.channelName) {
          channelId = parsed.channelName;
          if (!channelId) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid channel Id.");
          }
          const prevMessages = await prisma.privateMessage.findMany({
            where: { conversationName: channelId },
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  profileImage: true,
                },
              },
            },
          });
          if (channelId && !channelClients.has(channelId)) {
            channelClients.set(channelId, new Set());
          }
          channelId && channelClients.get(channelId)?.add(ws);
          ws.send(
            JSON.stringify({
              type: "subscribed",
              channelId,
              loadedMessages: prevMessages,
            })
          );
        } else if (parsed.type === "privateMessage") {
          const channelId = parsed.channelName;
          const message = parsed.data;

          if (message.image) {
            const base64Image = message.image;
            const filename = `${Date.now()}.jpeg`;
            const base64Data = base64Image.replace(
              /^data:image\/\w+;base64,/,
              ""
            );
            const uploadDir = path.join(process.cwd(), `uploads/message`);
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = path.join(uploadDir, filename);
            const localFilePath = `{}uploads/message/${filename}`;
            message.imageUrl = [localFilePath];
            const buffer = Buffer.from(base64Data, "base64");

            fs.writeFile(filePath, buffer, (err) => {
              if (err) {
                console.error("Error saving image:", err);
                ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Failed to save image",
                  })
                );
              } else {
                console.log("Image saved successfully at", filePath);
                ws.send(
                  JSON.stringify({
                    type: "image",
                    message: "Image saved successfully",
                  })
                );
              }
            });
          }
          const createdMessage =
            await privateMessageService.createPrivateMessage(
              { content: message.content, imageUrl: message.imageUrl },
              message.senderId,
              message.receiverId
            );
          const newMessage = await prisma.privateMessage.findFirst({
            where: { id: createdMessage.newMessage.id },
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  profileImage: true,
                },
              },
            },
          });
          broadcastToChannel(channelId, newMessage);
        } else if (
          parsed.type === "offer" ||
          parsed.type === "answer" ||
          parsed.type === "candidate"
        ) {
          broadcastToChannel(parsed.channelName, parsed, ws);
        }
      } catch (err: any) {
        console.error("error:", err.message);
      }
    });
    ws.on("close", () => {
      if (channelId) {
        channelClients.get(channelId)?.delete(ws);
        if (channelClients.get(channelId)?.size === 0) {
          channelClients.delete(channelId);
        }
      }
      console.log("Client disconnected!");
    });
  });
}

main();
