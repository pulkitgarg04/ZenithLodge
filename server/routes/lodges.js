import express from "express"
import {
  getLodges,
  getLodge,
  createLodge,
  updateLodge,
  deleteLodge,
  getFeaturedLodges,
} from "../controllers/lodgeController.js"
import { getLodgeBookings, createBooking } from "../controllers/bookingController.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

// router.use("/:lodgeId/bookings", protect, createBooking)

router.route("/featured").get(getFeaturedLodges)
router.route("/").get(getLodges).post(protect, authorize("manager", "admin"), createLodge)

router
  .route("/:id")
  .get(getLodge)
  .put(protect, authorize("manager", "admin"), updateLodge)
  .delete(protect, authorize("manager", "admin"), deleteLodge)

// router
//   .route("/:lodgeId/bookings")
//   .get(protect, authorize("manager", "admin"), getLodgeBookings)
//   .post(protect, createBooking)

export default router

