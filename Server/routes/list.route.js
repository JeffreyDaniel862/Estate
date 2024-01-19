import express from "express";
import { createList, deleteList } from "../controllers/list.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createList);
router.delete('/delete/:id', verifyToken, deleteList);

export default router;