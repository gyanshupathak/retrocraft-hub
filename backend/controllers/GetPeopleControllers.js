const profileSchema = require("../models/ProfileModels.js");

module.exports.GetPeople = async (req, res) => {
    try{
        const people = await profileSchema.find();
        res.status(201).json({ message: "People fetched successfully", success: true, people });

    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error fetching people", success: false, error: error.message });
    }
}