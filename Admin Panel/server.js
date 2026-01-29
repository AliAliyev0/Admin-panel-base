require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(require("cors")());
app.use(require("helmet")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/categories"));

app.get("/", (req, res) => {
    res.send("Admin Panel API running...");
});

// Global Error Handler
app.use(require("./middlewares/errorHandler"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
