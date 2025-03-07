import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDB from "./config/db.js"
import errorHandler from "./middleware/error.js"

dotenv.config()

connectDB()

import auth from "./routes/auth.js"
import lodges from "./routes/lodges.js"
import bookings from "./routes/bookings.js"

const app = express()

app.use(express.json())

app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)

app.use("/api/auth", auth)
app.use("/api/lodges", lodges)
app.use("/api/bookings", bookings)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})