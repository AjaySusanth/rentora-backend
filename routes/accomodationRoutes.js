import express from "express";
import { deleteAccommodation, getAllAccommodations, registerProperty, updateAccommodation } from "../controller/accomodationController.js";

const router = express.Router();

router.post("/", registerProperty);
router.get("/",getAllAccommodations);
router.put("/:accommodation_id",updateAccommodation)
router.delete("/:accommodation_id",deleteAccommodation)

export default router;
