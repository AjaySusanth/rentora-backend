import { sql } from "../config/db.js";

export const createAccomodationTable = async() => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS Accommodations (
                accommodation_id SERIAL PRIMARY KEY,  
                name VARCHAR(255) NOT NULL,          
                type VARCHAR(50) NOT NULL,           
                owner_id INT REFERENCES Users(user_id),
                description TEXT,
                college_id INT REFERENCES Colleges(college_id),
                distance_km FLOAT,
                district VARCHAR(100),
                contact VARCHAR(20),
                address TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
         console.log("Accomodation table created successfully.");
    } catch (error) {
        console.error("Error creating Accomodation table:", error);
    }
}