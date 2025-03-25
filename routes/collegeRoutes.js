import express from "express";
import { getAllCollege, getCollegeById } from "../controller/collegeController.js";

const router = express.Router();

router.get("/",getAllCollege);
router.get("/:college_id", getCollegeById);

export default router;
