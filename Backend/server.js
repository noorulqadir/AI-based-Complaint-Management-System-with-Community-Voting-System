require("dotenv").config();
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Civic Desk Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
