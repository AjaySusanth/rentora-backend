import { sql } from "../config/db.js";

export const getAllCollege = async(req,res) => {
    const { district, name } = req.query;
    try {
        const colleges = await sql`
            SELECT * FROM Colleges
            WHERE 1=1
            ${district ? sql`AND district ILIKE ${district} || '%'` : sql``}
            ${name ? sql`AND college_name ILIKE ${name} || '%'` : sql``}
        `
        res.status(200).json(colleges);
    } catch (error) {
        console.error("Error fetching colleges:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getCollegeById = async (req, res) => {
    const { college_id } = req.params;

    try {
        const college = await sql`SELECT * FROM Colleges WHERE college_id = ${college_id};`;

        if (college.length === 0) {
            return res.status(404).json({ error: "College not found" });
        }

        res.status(200).json(college[0]);
    } catch (error) {
        console.error("Error fetching college:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};