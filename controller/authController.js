import { sql } from "../config/db.js";

export const registerUser = async(req, res) => {
    const { name, email, supabase_id } = req.body;
    
    // Validate required fields
    if (!name || !email || !supabase_id) {
        return res.status(400).json({ error: "Name, email, and Supabase ID are required" });
    }

    try {
        // Check if user exists by email or Supabase ID
        const existingUser = await sql`
            SELECT * FROM Users 
            WHERE email = ${email} OR supabase_id = ${supabase_id};
        `;

        if (existingUser.length > 0) {
            // If user exists, return existing user
            return res.status(200).json({ 
                message: "User already exists", 
                user: existingUser[0] 
            });
        }

        // Insert new user into the database with Supabase ID
        const newUser = await sql`
            INSERT INTO Users (name, email, supabase_id)
            VALUES (${name}, ${email}, ${supabase_id})
            RETURNING *;
        `;

        res.status(201).json({ 
            message: "User registered successfully", 
            user: newUser[0] 
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}