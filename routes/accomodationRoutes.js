import express from "express";
import { deleteAccommodation, getAccommodationById, getAllAccommodations, getAvailableDistricts, registerProperty, updateAccommodation } from "../controller/accomodationController.js";

const router = express.Router();

router.post("/", registerProperty);
router.get("/",getAllAccommodations);
router.get("/districts",getAvailableDistricts);
router.get("/:accommodation_id",getAccommodationById);
router.put("/:accommodation_id",updateAccommodation)
router.delete("/:accommodation_id",deleteAccommodation)

export default router;
