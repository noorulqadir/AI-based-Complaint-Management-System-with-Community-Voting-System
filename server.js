const notificationRoutes = require("./routes/notificationRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.send("Civic Desk Backend Running");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log(error);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});