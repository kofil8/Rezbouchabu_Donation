import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { privateMessageService } from "./privateMessage.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createPrivateMessage = catchAsync(async (req: Request, res: Response) => {
  const { receiverId } = req.params;
  const senderId = req.user.id;
  const payload = req.body;
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
  let fileURLs: string[] = [];

  if (files && files.chatImages) {
    fileURLs = files.chatImages.map((file: Express.Multer.File) => {
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/message/${
        file.filename
      }`;
      return fileUrl;
    });
  }

  payload.imageUrl = fileURLs;
  const message = await privateMessageService.createPrivateMessage(
    payload,
    senderId,
    receiverId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Message sent successfully.",
    data: message,
  });
});

const getAllConversationMessages = catchAsync(
  async (req: Request, res: Response) => {
    const { conversationName } = req.params;
    const userId = req.user.id;
    const conversationMessages =
      await privateMessageService.getAllConversationMessages(
        conversationName,
        userId
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All messages retrieved successfully.",
      data: conversationMessages,
    });
  }
);

export const privateMessageController = {
  createPrivateMessage,
  getAllConversationMessages,
};
