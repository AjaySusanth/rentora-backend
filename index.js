import express from 'express'
import dotenv from "dotenv";
import cors from 'cors'
import { createUserTable } from './models/userModel.js';
import authRoutes from './routes/authRoutes.js'
import collegeRoutes from './routes/collegeRoutes.js'
import accomodationRoutes from './routes/accomodationRoutes.js'
import roomRoutes from "./routes/roomRoutes.js";
import { createCollegeTable } from './models/collegeModel.js';
import { createAccomodationTable } from './models/accomodationModel.js';
import { createRoomTable } from './models/roomModel.js';

dotenv.config();


const app =express()
app.use(cors());
app.use(express.json());

const PORT  = process.env.PORT || 5000

app.get("/",(req,res)=>{
    res.json({message:"test"})
})

createUserTable();
createCollegeTable();
createAccomodationTable();
createRoomTable();

app.use("/auth", authRoutes);
app.use("/college", collegeRoutes);
app.use("/accomodations", accomodationRoutes);
app.use("/rooms", roomRoutes);

app.listen(PORT,()=>{
    console.log("server running")
})