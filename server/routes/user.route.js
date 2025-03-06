const express = require("express");
const router = express.Router();

let users = [];

// Get all users
router.get("/", (req, res) => {
  res.send(users);
});

// Add new user
router.post("/add", (req, res) => {
  const { id, name } = req.body;
  if (!id || !name)
    return res.status(400).send({ error: "Missing required fields" });
  users.push({ id: parseInt(id), name });
  res.send({ message: "User added successfully" });
});

module.exports = router;