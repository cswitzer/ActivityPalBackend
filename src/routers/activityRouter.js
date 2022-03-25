const express = require("express")
const mongoose = require("mongoose")
const router = new express.Router()

const Activity = require("../../models/activityModel.js")
const auth = require("../middleware/auth.js")
const authHeader = require("../middleware/authHeader.js")

// some functions will need to be async
router.post("/activities", auth, async (req, res) => {
  req.body._id = new mongoose.Types.ObjectId().toHexString()
  const activity = new Activity({
    ...req.body,
    owner: req.user._id, // links activity to a user
  })

  try {
    await activity.save()
    res.status(201).send({ token: req.token, status: "AApproved" })
  } catch (e) {
    console.log(e)
    res.status(401).send({ status: "Rejected" })
  }
})

// get all activities in the user's location (e.g. rexburg activities for rexburg residents)
router.get("/activities", authHeader, async (req, res) => {
  console.log(req.get("city"))
  try {
    const activities = await Activity.find({ city: req.get("city") })
    res.send({ activities })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: "Rejected" })
  }
})

// get all activities which correspond to this user
router.get("/activities/me", authHeader, async (req, res) => {
  try {
    await req.user.populate({
      path: "activities",
    })
    console.log(req.user.activities)
    res.send({ activities: req.user.activities })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: "Rejected" })
  }
})

router.get("/activities/:id", authHeader, async (req, res) => {
  // :id refers to object id of activity, which will be retrievd from a hidden editText field in cardview
  console.log(req.params._id)
})

module.exports = router
