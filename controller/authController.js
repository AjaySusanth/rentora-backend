import { sql } from "../config/db.js";

export const registerUser = async(req,res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    try {
        const existingUser = await sql`SELECT * FROM Users WHERE email = ${email};`;
        if (existingUser.length > 0) {
            return res.status(200).json({ message: "User already exists", user: existingUser[0] });
        }

        // Insert new user into the database
        const newUser = await sql`
            INSERT INTO Users (name, email)
            VALUES (${name}, ${email})
            RETURNING *;
        `;
        res.status(201).json({ message: "User registered successfully", user: newUser[0] });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}