import { sql } from "../config/db.js";

export const getUserProfile = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await sql`SELECT user_id, name, email, created_at FROM Users WHERE user_id = ${user_id}`;
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user[0]);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    const { user_id } = req.params;
    const { name, email } = req.body;

    try {
        const updatedUser = await sql`
            UPDATE Users 
            SET name = ${name}, email = ${email}
            WHERE user_id = ${user_id}
            RETURNING user_id, name, email, created_at
        `;
        if (updatedUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Profile updated successfully", user: updatedUser[0] });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUserAccount = async (req, res) => {
    const { user_id } = req.params;
    try {
        const deletedUser = await sql`DELETE FROM Users WHERE user_id = ${user_id} RETURNING *`;
        if (deletedUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserProperties = async (req, res) => {
    const { user_id } = req.params;
    try {
        const properties = await sql`
            SELECT * FROM Accommodations WHERE owner_id = ${user_id}
        `;
        res.json(properties);
    } catch (error) {
        console.error("Error fetching user properties:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
