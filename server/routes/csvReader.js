
import express from "express";
import csvReaderController from "../controllers/csvReaderController.js";
const router = express.Router();

router.post("/analyse", csvReaderController.csvAnalyser);

export default router;
