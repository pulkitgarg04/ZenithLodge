import mongoose from "mongoose"

const LodgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  location: {
    type: String,
    required: [true, "Please add a location"],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price per night"],
  },
  capacity: {
    type: Number,
    required: [true, "Please add a capacity"],
  },
  rooms: {
    type: Number,
    required: [true, "Please add number of rooms"],
  },
  bathrooms: {
    type: Number,
    required: [true, "Please add number of bathrooms"],
  },
  amenities: {
    type: [String],
    required: [true, "Please add amenities"],
  },
  type: {
    type: String,
    required: [true, "Please add lodge type"],
    enum: ["Hotel", "Resort", "Villa", "Cabin", "Apartment", "Cottage"],
  },
  images: {
    type: [String],
    required: [true, "Please add at least one image"],
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"],
    default: 4.5,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  manager: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

LodgeSchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().split(" ").join("-")
  next()
})

export default mongoose.model("Lodge", LodgeSchema)

