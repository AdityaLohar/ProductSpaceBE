const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("../db/connectDb.js");
const cors = require("cors");
const { submitEnquiry } = require("../controllers/userController.js");
const User = require('../models/userModel.js'); // Import your User model

dotenv.config();

connectDb();
const app = express();

const PORT = process.env.PORT || 5000;

// CORS configuration: allow only your frontend to access the backend
const allowedOrigins = [
  "https://product-space-lohar.vercel.app",
  "https://theproductspace.co.in", // Add more origins as needed
  "http://localhost:5173/", // Add more origins as needed
];

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ msg: "Hello" });
});
app.get("/api/submit-enquiry", (req, res) => {
  res.status(200).json({ msg: "Enquiry Submit" });
});

app.post("/api/submit-enquiry", async (req, res) => {
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
});


app.options("/api/submit-enquiry", (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
