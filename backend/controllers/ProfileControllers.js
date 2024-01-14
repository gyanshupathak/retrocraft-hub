const profileSchema = require("../models/ProfileModels.js");
const producerProfileSchema = require("../models/ProducerProfileModels.js")
const {User}  = require("../models/UserModels.js");

module.exports.Profile = async (req, res) => {
    try {
        // Assuming you have a user object stored in req.user during authentication
        const userId = req.user.id;


        // Fetch the profile for the logged-in user
        const userProfile = await profileSchema.findOne({ userId }).populate("userId");

        if (userProfile) {
            res.status(200).json({ message: "Profile fetched successfully", success: true, profile: userProfile });
        } else {
            res.status(404).json({ message: "Profile not found", success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching profile", success: false, error: error.message });
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        // Assuming you have a user object stored in req.user during authentication
        const userId = req.user.id;

        // Fetch the profile for the logged-in user
        const userProfile = await profileSchema.findOne({ userId });

        if (userProfile) {
            // Update the profile
            const updatedProfile = await profileSchema.findOneAndUpdate({ userId }, req.body, { new: true });

            res.status(200).json({ message: "Profile updated successfully", success: true, profile: updatedProfile });
        } else {
            res.status(404).json({ message: "Profile not found", success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating profile", success: false, error: error.message });
    }

}


module.exports.getProducerProfile = async (req, res) => {
    try {
        // Assuming you have a user object stored in req.user during authentication
        const userId = req.user.id;

        // Fetch the profile for the logged-in user
        const userProfile = await User.findOne({ _id: userId});

        if (userProfile) {
            res.status(200).json({ message: "Profile fetched successfully", success: true, profile: userProfile });
        } else {
            res.status(404).json({ message: "Profile not found", success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching profile", success: false, error: error.message });
    }
};


module.exports.updateProducerProfile = async (req, res) => {
    try {
        // Assuming you have a user object stored in req.user during authentication
        const userId = req.user.id;

        // Fetch the profile for the logged-in user
        const userProfile = await producerProfileSchema.findOne({ userId });

        if (userProfile) {
            // Update the profile
            const updatedProfile = await producerProfileSchema.findOneAndUpdate({ userId }, req.body, { new: true });
            res.status(200).json({ message: "Profile updated successfully", success: true, profile: updatedProfile });
        } else {
            res.status(404).json({ message: "Profile not found", success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating profile", success: false, error: error.message });
    }

}

module.exports.createProducerProfile = async (req, res) => {
    console.log("hello");
    try {

        const{username , contact , profilePhoto} = req.body;
        // Assuming you have a user object stored in req.user during authentication
        const userId = req.user.id;

        // Fetch the profile for the logged-in user
        const userProfile = await producerProfileSchema.create({ userId, username , contact , profilePhoto,userId:userId });

            res.status(200).json({ message: "Profile created successfully", success: true, profile: userProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching profile", success: false, error: error.message });
    }
}