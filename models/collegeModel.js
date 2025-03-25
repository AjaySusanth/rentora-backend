import { sql } from "../config/db.js";

export const createCollegeTable = async() => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS Colleges (
                college_id SERIAL PRIMARY KEY,
                college_name VARCHAR(255) NOT NULL,
                district VARCHAR(100),
                address TEXT
            );
        `;
         console.log("Colleges table created successfully.");
    } catch (error) {
        console.error("Error creating college table:", error);
    }
}