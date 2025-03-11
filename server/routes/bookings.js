import express from "express"
import { getBookings, getBooking, updateBooking, cancelBooking } from "../controllers/bookingController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.use(protect)

router.route("/").get(getBookings)

router.route("/:id").get(getBooking).put(updateBooking)

router.route("/:id/cancel").put(cancelBooking)

export default router