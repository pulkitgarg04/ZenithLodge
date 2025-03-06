const express = require("express");
const bodyParser = require("body-parser");

const hotelRoutes = require("./routes/hotel.route");
const userRoutes = require("./routes/user.route");
const bookingRoutes = require("./routes/booking.route");

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.use("/api/hotels", hotelRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res, next) => {
  res.status(404).send({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log("Server is connected to the PORT: " + PORT);
});
