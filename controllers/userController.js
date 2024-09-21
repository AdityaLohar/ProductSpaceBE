const User = require('../models/userModel.js'); // Import your User model

const submitEnquiry = async (req, res) => {
    try {
        console.log("Entered in function");
        const { name, email, phone } = req.body; // Get data from request body
        const user = await User.findOne({ email }); // Check for existing user
        console.log("User searched");
        
        if (user) {
            return res.status(401).json({ error: "User already exists" });
        }
        
        const newUser = new User({
            name,
            email,
            phone,
        });
        
        await newUser.save();
        console.log("User saved");

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
            });
        } else {
            res.status(401).json({ error: "Invalid user data" });
        }

    } catch (err) {
        res.status(501).json({ error: err.message });
        console.log("Error in submit enquiry: ", err.message);
    }
};

module.exports = { submitEnquiry };