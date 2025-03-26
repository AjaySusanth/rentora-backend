import { sql } from "../config/db.js";

export const createUserTable = async() => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS Users (
                user_id SERIAL PRIMARY KEY,
                supabase_id uuid UNIQUE,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Users table created successfully.");
    } catch (error) {
        console.error("Error creating Users table:", error);
    }
}