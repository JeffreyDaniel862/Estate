import express from 'express';
import { deleteUser, getUserDetails, updateUser, userList } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/list/:id", verifyToken, userList);
router.get("/detail/:id", verifyToken, getUserDetails);

export default router;