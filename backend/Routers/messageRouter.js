const express = require("express");
const {
  allMessages,
  sendMessage,
  adminMessages,
  sendMessageAdmin
} = require("../controllers/messageControllers");
const { authMiddleware } = require("../middleware");

const router = express.Router();
router.route("/admin").get(authMiddleware, adminMessages);
router.route("/adminsend").post(authMiddleware, sendMessageAdmin);

router.route("/:chatId").get(authMiddleware, allMessages);

router.route("/").post(authMiddleware, sendMessage);

module.exports = router;