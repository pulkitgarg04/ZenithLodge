const express = require("express");
const router = express.Router();

let bookings = [];

// Create booking
router.post("/add", (req, res) => {
  const { userId, hotelId } = req.query;
  if (!userId || !hotelId)
    return res.status(400).send({ error: "Missing required fields" });
  bookings.push({ userId: parseInt(userId), hotelId: parseInt(hotelId) });
  res.send({ message: "Booking added successfully" });
});

// Get all bookings
router.get("/", (req, res) => {
  res.send(bookings);
});

module.exports = router;