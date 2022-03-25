// make sure to store the location of the event
// converting lat/lon into the place's name
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const User = require("./userModel.js")

const activitySchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    base64ImageString: {
      type: String,
      required: true,
      immutable: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: String,
        unique: false,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamp: true,
  }
)

const Activity = mongoose.model("Activity", activitySchema)
module.exports = Activity
