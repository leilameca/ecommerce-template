const express = require("express");
const { listUsers, createUser, updateUser, deleteUser } = require("../controllers/user.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/", restrictTo("super-admin"), listUsers);
router.post("/", restrictTo("super-admin"), createUser);
router.put("/:id", updateUser); // self or super-admin (enforced in controller)
router.delete("/:id", restrictTo("super-admin"), deleteUser);

module.exports = router;
