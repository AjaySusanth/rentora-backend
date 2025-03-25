import { sql } from "../config/db.js";

export const addRoomType = async (req, res) => {
    try {
        const { accommodation_id, room_type_name, rent, available_units, is_available } = req.body;

        const [accommodation] = await sql`
            SELECT * FROM Accommodations WHERE accommodation_id = ${accommodation_id};
        `;

        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
        }

        const [newRoom] = await sql`
            INSERT INTO Room_Types (accommodation_id, room_type_name, rent, available_units, is_available)
            VALUES (${accommodation_id}, ${room_type_name}, ${rent}, ${available_units}, ${is_available})
            RETURNING *;
        `;

        res.status(201).json({ message: "Room type added successfully", room: newRoom });
    } catch (error) {
        console.error("Error adding room type:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getRoomTypes = async (req, res) => {
    try {
        const { accommodation_id } = req.params;

        const rooms = await sql`
            SELECT * FROM Room_Types WHERE accommodation_id = ${accommodation_id};
        `;

        if (rooms.length === 0) {
            return res.status(404).json({ message: "No rooms found for this accommodation" });
        }

        res.status(200).json({ accommodation_id, rooms });
    } catch (error) {
        console.error("Error fetching room types:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const updateRoomType = async (req, res) => {
    try {
        const { room_type_id } = req.params;
        const { room_type_name, rent, available_units, is_available } = req.body;

    
        const [existingRoom] = await sql`
            SELECT * FROM Room_Types WHERE room_type_id = ${room_type_id};
        `;

        if (!existingRoom) {
            return res.status(404).json({ error: "Room type not found" });
        }


        const [updatedRoom] = await sql`
            UPDATE Room_Types
            SET 
                room_type_name = COALESCE(${room_type_name}, room_type_name),
                rent = COALESCE(${rent}, rent),
                available_units = COALESCE(${available_units}, available_units),
                is_available = COALESCE(${is_available}, is_available)
            WHERE room_type_id = ${room_type_id}
            RETURNING *;
        `;

        res.status(200).json({ message: "Room type updated successfully", updatedRoom });
    } catch (error) {
        console.error("Error updating room type:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteRoomType = async (req, res) => {
    try {
        const { room_type_id } = req.params;

        const [existingRoom] = await sql`
            SELECT * FROM Room_Types WHERE room_type_id = ${room_type_id};
        `;

        if (!existingRoom) {
            return res.status(404).json({ error: "Room type not found" });
        }

        await sql`
            DELETE FROM Room_Types WHERE room_type_id = ${room_type_id};
        `;

        res.status(200).json({ message: "Room type deleted successfully" });
    } catch (error) {
        console.error("Error deleting room type:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
