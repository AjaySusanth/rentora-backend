import express from "express";
import { 
    getUserProfile, 
    updateUserProfile, 
    deleteUserAccount, 
    getUserProperties 
} from "../controller/userController.js";

const router = express.Router();

router.get("/:user_id", getUserProfile);

router.put("/:user_id", updateUserProfile);

router.delete("/:user_id", deleteUserAccount);

router.get("/:user_id/properties", getUserProperties);

export default router;
