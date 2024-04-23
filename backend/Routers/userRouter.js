const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.route("/search").get(authMiddleware, allUsers);
router.route("/signup").post(registerUser);
router.post("/login", authUser);

module.exports = router;