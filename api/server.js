const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("../db/connectDb.js");
const cors = require("cors");
const { submitEnquiry } = require("../controllers/userController.js");

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

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ msg: "Hello" });
});

app.options("/api/submit-enquiry", (req, res) => {
  res.sendStatus(200);
});
app.post("/api/submit-enquiry", submitEnquiry);
app.post("/api/formdata", submitEnquiry);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
