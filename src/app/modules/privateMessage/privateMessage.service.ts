import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { NotificationServices } from "../notifications/notification.service";
import ApiError from "../../../errors/ApiErrors";

const createPrivateMessage = async (
  payload: any,
  senderId: string,
  receiverId: string
) => {
  if (!senderId || !receiverId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid sender or receiver.");
  }
  const [participant1Id, participant2Id] = [senderId, receiverId].sort();
  const conversationName = participant1Id + participant2Id;

  const result = await prisma.$transaction(async (prisma) => {
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        name: conversationName,
      },
    });
    let newConversation;
    if (!existingConversation) {
      newConversation = await prisma.conversation.create({
        data: {
          name: conversationName,
          participant1Id,
          participant2Id,
        },
      });
    }

    const newMessage = await prisma.privateMessage.create({
      data: {
        ...payload,
        senderId,
        conversationName,
      },
    });
    return { newConversation, newMessage };
  });
  const sender = await prisma.user.findFirst({
    where: {
      id: senderId,
    },
  });
  const receiver = await prisma.user.findFirst({
    where: {
      id: receiverId,
    },
  });
  if (!sender) {
    return result;
  }
  if (!receiver) {
    return result;
  }

  const notificationBody = `${sender?.firstName} sent you a message.`;

  if (!receiver.isOnline) {
    NotificationServices.sendUnsavedNotification(
      {
        senderImage: sender?.profileImage,
        senderName: sender?.firstName,
      },
      receiverId,
      notificationBody
    );
  }
  return result;
};

const getAllConversationMessages = async (
  conversationName: string,
  userId: string
) => {
  const conversationMessages = await prisma.conversation.findFirst({
    where: {
      name: conversationName,
    },
    select: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
            },
          },
        },
      },
      participant1Id: true,
      participant2Id: true,
    },
  });

  if (!conversationMessages) {
    throw new ApiError(httpStatus.NOT_FOUND, "Conversation not found.");
  }
  if (
    conversationMessages.participant1Id !== userId &&
    conversationMessages.participant2Id !== userId
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to view this conversation."
    );
  }
  return conversationMessages;
};
export const privateMessageService = {
  createPrivateMessage,
  getAllConversationMessages,
};
