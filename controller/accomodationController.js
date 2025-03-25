import { sql } from "../config/db.js";

export const registerProperty = async(req,res) => {
    try {
        const { name, type, owner_id, description, college_id, distance_km, district, contact, address } = req.body;

        if (!name || !type || !owner_id || !college_id || !district || !contact || !address) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const [newAccommodation] = await sql`
        INSERT INTO Accommodations (name, type, owner_id, description, college_id, distance_km, district, contact, address)
        VALUES (${name}, ${type}, ${owner_id}, ${description}, ${college_id}, ${distance_km}, ${district}, ${contact}, ${address})
        RETURNING *;
    `;

        res.status(201).json({
            message: "Property registered successfully",
            accommodation: newAccommodation,
        });
    } catch (error) {
        console.error("Error registering property:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

export const getAllAccommodations = async (req, res) => {
    try {
        const { type, district, college_id, name } = req.query;

        const accommodations = await sql`
            SELECT * FROM Accommodations
            WHERE 1=1
            ${type ? sql`AND type ILIKE ${type}` : sql``}
            ${district ? sql`AND district ILIKE ${district}` : sql``}
            ${college_id ? sql`AND college_id = ${college_id}` : sql``}
            ${name ? sql`AND name ILIKE ${name} || '%'` : sql``}
        `;

        if(accommodations.length === 0 ) {
            return res.status(404).json({message:"No Accomodation found"})
        }

        res.status(200).json(accommodations);
    } catch (error) {
        console.error("Error fetching accommodations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAccomodationById = async(req,res) => {
    const {accommodation_id} = req.params

    try {
        
    } catch (error) {
        
    }
}



export const updateAccommodation = async (req, res) => {
    try {
        const { accommodation_id } = req.params;
        const { name, type, description, college_id, distance_km, district, contact, address } = req.body;

        const [existingAccommodation] = await sql`
            SELECT * FROM Accommodations WHERE accommodation_id = ${accommodation_id};
        `;

        if (!existingAccommodation) {
            return res.status(404).json({ error: "Property not found" });
        }

        const [updatedAccommodation] = await sql`
            UPDATE Accommodations
            SET 
                name = COALESCE(${name}, name),
                type = COALESCE(${type}, type),
                description = COALESCE(${description}, description),
                college_id = COALESCE(${college_id}, college_id),
                distance_km = COALESCE(${distance_km}, distance_km),
                district = COALESCE(${district}, district),
                contact = COALESCE(${contact}, contact),
                address = COALESCE(${address}, address)
            WHERE accommodation_id = ${accommodation_id}
            RETURNING *;
        `;

        res.status(200).json({ message: "Property updated successfully", updatedAccommodation });
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteAccommodation = async (req, res) => {
    try {
        const { accommodation_id } = req.params;

        const [existingAccommodation] = await sql`
            SELECT * FROM Accommodations WHERE accommodation_id = ${accommodation_id};
        `;

        if (!existingAccommodation) {
            return res.status(404).json({ error: "Property not found" });
        }

        await sql`
            DELETE FROM Accommodations WHERE accommodation_id = ${accommodation_id};
        `;

        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
