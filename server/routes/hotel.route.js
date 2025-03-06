const express = require("express");
const router = express.Router();

let hotels = [];

router.get("/", (req, res) => {
  res.send(hotels);
});

router.get("/:id", (req, res) => {
  const hotel = hotels.find((h) => h.id === parseInt(req.params.id));
  if (!hotel) return res.status(404).send({ error: "Hotel not found" });
  res.send(hotel);
});

router.post("/add", (req, res) => {
  const { id, name, location } = req.query;
  if (!id || !name || !location)
    return res.status(400).send({ error: "Missing required fields" });
  hotels.push({ id: parseInt(id), name, location });
  res.send({ message: "Hotel added successfully" });
});

router.put("/update", (req, res) => {
  const { id, name, location } = req.query;
  const hotel = hotels.find((h) => h.id === parseInt(id));
  if (!hotel) return res.status(404).send({ error: "Hotel not found" });
  if (name) hotel.name = name;
  if (location) hotel.location = location;
  res.send({ message: "Hotel updated successfully" });
});

router.delete("/delete", (req, res) => {
  const { id } = req.query;
  const index = hotels.findIndex((h) => h.id === parseInt(id));
  if (index === -1) return res.status(404).send({ error: "Hotel not found" });
  hotels.splice(index, 1);
  res.send({ message: "Hotel deleted successfully" });
});

module.exports = router;