import { sql } from "../config/db.js";

export const registerProperty = async (req, res) => {
    try {
        const { name, type, owner_id, description, college_id, distance_km, district, contact, address, rent } = req.body;

        // Basic validation
        if (!name || !type || !owner_id || !college_id || !district || !contact || !address || !distance_km) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Conditional validation for rent
        if (type !== 'hostel' && !rent) {
            return res.status(400).json({ error: "Rent is required for PG and Rented Home types" });
        }

        // For hostels, set rent to null
        const finalRent = type === 'hostel' ? null : rent;

        const [newAccommodation] = await sql`
            INSERT INTO Accommodations (
                name, type, owner_id, description, 
                college_id, distance_km, district, 
                contact, address, rent
            )
            VALUES (
                ${name}, ${type}, ${owner_id}, ${description}, 
                ${college_id}, ${distance_km}, ${district}, 
                ${contact}, ${address}, ${finalRent}
            )
            RETURNING *;
        `;

        res.status(201).json({
            message: "Property registered successfully",
            accommodation: newAccommodation,
        });
    } catch (error) {
        console.error("Error registering property:", error);
        res.status(500).json({ error: "Internal server error", message:error.message });
    }
};
/*
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

        if (accommodations.length === 0) {
            return res.status(404).json({ message: "No Accommodation found" });
        }

        res.status(200).json(accommodations);
    } catch (error) {
        console.error("Error fetching accommodations:", error);
        res.status(500).json({ error: "Internal server error" ,message:error.message});
    }
};*/

export const getAllAccommodations = async (req, res) => {
    try {
        const { type, district, college_id, name } = req.query;

        const accommodations = await sql`
            SELECT 
                A.*, 
                C.college_name 
            FROM Accommodations A
            LEFT JOIN Colleges C ON A.college_id = C.college_id
            WHERE 1=1
            ${type ? sql`AND A.type ILIKE ${type}` : sql``}
            ${district ? sql`AND A.district ILIKE ${district}` : sql``}
            ${college_id ? sql`AND A.college_id = ${college_id}` : sql``}
            ${name ? sql`AND A.name ILIKE ${name} || '%'` : sql``}
        `;

        if (accommodations.length === 0) {
            return res.status(404).json({ message: "No Accommodation found" });
        }

        res.status(200).json(accommodations);
    } catch (error) {
        console.error("Error fetching accommodations:", error);
        res.status(500).json({ error: "Internal server error" ,message:error.message});
    }
};




export const getAccommodationById = async (req, res) => {
    const { accommodation_id } = req.params;


    try {
        const [accommodation] = await sql`
            SELECT 
                a.*,
                c.college_name,
                u.name as owner_name,
                u.email as owner_email
            FROM Accommodations a
            LEFT JOIN Colleges c ON a.college_id = c.college_id
            LEFT JOIN Users u ON a.owner_id = u.supabase_id
            WHERE a.accommodation_id = ${accommodation_id};
        `;

        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
        }

        // Initialize response object with common details
        const response = {
            id: accommodation.accommodation_id,
            name: accommodation.name,
            type: accommodation.type,
            description: accommodation.description,
            college: {
                id: accommodation.college_id,
                name: accommodation.college_name
            },
            distance: accommodation.distance_km,
            district: accommodation.district,
            contact: accommodation.contact,
            address: accommodation.address,
            createdAt: accommodation.created_at,
            owner: {
                id: accommodation.owner_id,
                name: accommodation.owner_name,
                email: accommodation.owner_email,
            }
        };

        if (accommodation.type === 'hostel') {
            const roomTypes = await sql`
                SELECT 
                    room_type_id as id,
                    room_type_name as name,
                    rent,
                    available_units,
                    is_available
                FROM Room_Types
                WHERE accommodation_id = ${accommodation_id}
                ORDER BY rent ASC;
            `;

            response.roomTypes = roomTypes;
        } else {
            response.rent = accommodation.rent;
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching accommodation:", error);
        res.status(500).json({ error: "Internal server error",message:error.message});
    }
};

export const updateAccommodation = async (req, res) => {
    try {
        const { accommodation_id } = req.params;
        const { name, type, description, college_id, distance_km, district, contact, address, rent } = req.body;

        // Get existing accommodation to check current type
        const [existingAccommodation] = await sql`
            SELECT * FROM Accommodations WHERE accommodation_id = ${accommodation_id};
        `;

        if (!existingAccommodation) {
            return res.status(404).json({ error: "Property not found" });
        }

        // If changing from hostel to non-hostel, require rent
        if (existingAccommodation.type === 'hostel' && type && type !== 'hostel' && !rent) {
            return res.status(400).json({ error: "Rent is required when changing from hostel to PG/Rented Home" });
        }

        // If changing to hostel, set rent to null
        const updatedRent = type === 'hostel' ? null : 
                          (rent !== undefined ? rent : existingAccommodation.rent);

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
                address = COALESCE(${address}, address),
                rent = ${updatedRent}
            WHERE accommodation_id = ${accommodation_id}
            RETURNING *;
        `;

        res.status(200).json({ 
            message: "Property updated successfully", 
            updatedAccommodation 
        });
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

export const getAvailableDistricts = async (req, res) => {
    try {
        const districts = await sql`
            SELECT DISTINCT district 
            FROM Accommodations 
            WHERE district IS NOT NULL 
            ORDER BY district
        `;
        const districtList = districts.map(row => row.district);
        res.status(200).json(districtList);
    } catch (error) {
        console.error("Error fetching districts:", error);
        res.status(500).json({ error: "Internal server error",message:error.message });
    }
};