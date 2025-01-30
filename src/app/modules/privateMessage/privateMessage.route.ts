import express from "express";
import { privateMessageController } from "./privateMessage.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploaderS3";

const router = express.Router();

router.get(
  "/conversation/:conversationName",
  auth(),
  privateMessageController.getAllConversationMessages
);
router
  .route("/:receiverId")
  .post(
    auth(),
    fileUploader.uploadMessageImages,
    privateMessageController.createPrivateMessage
  );

export const privateMessageRouter = router;
