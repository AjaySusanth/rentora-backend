import { sql } from "../config/db.js";

export const createRoomTable = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS Room_Types (
                room_type_id SERIAL PRIMARY KEY,
                accommodation_id INT REFERENCES Accommodations(accommodation_id) ON DELETE CASCADE,
                room_type_name VARCHAR(100) NOT NULL,
                rent DECIMAL(10,2) NOT NULL,
                available_units INT NOT NULL DEFAULT 1,
                is_available BOOLEAN DEFAULT TRUE
            );
        `;
        console.log("Room_Types table created successfully.");
    } catch (error) {
        console.error("Error creating Room_Types table:", error);
    }
};
