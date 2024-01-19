import express from "express";
import { createList, deleteList, getList, updateList } from "../controllers/list.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createList);
router.delete('/delete/:id', verifyToken, deleteList);
router.patch("/update/:id", verifyToken, updateList);
router.get("/view/:id", getList);

export default router;