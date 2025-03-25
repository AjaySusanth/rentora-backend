import express from "express";
import { addRoomType, deleteRoomType, getRoomTypes, updateRoomType } from "../controller/roomController.js";


const router = express.Router();

router.post("/", addRoomType);  
router.get("/:accommodation_id", getRoomTypes); 
router.put("/:room_type_id", updateRoomType);  
router.delete("/:room_type_id", deleteRoomType);
export default router;
