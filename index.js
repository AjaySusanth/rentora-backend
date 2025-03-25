import express from 'express'
import dotenv from "dotenv";
import cors from 'cors'
import { createUserTable } from './models/userModel.js';
import authRoutes from './routes/authRoutes.js'
import collegeRoutes from './routes/collegeRoutes.js'
import { createCollegeTable } from './models/collegeModel.js';

dotenv.config();


const app =express()
app.use(cors());
app.use(express.json());

const PORT  = process.env.PORT || 5000

app.get("/",(req,res)=>{
    res.json({message:"test"})
})

createUserTable();
createCollegeTable()

app.use("/auth", authRoutes);
app.use("/college", collegeRoutes);

app.listen(PORT,()=>{
    console.log("server running")
})