const express = require("express")
const Activity = require("../../models/activityModel.js")
const auth = require("../middleware/auth.js")

const router = new express.Router()

const formatDate = require("../../helpers/formatDate.js")

// some functions will need to be async
router.post("/activities", auth, async (req, res) => {
  const activity = new Activity({
    ...req.body,
    owner: req.user._id, // links activity to a user
  })

  try {
    await activity.save()
    res.status(201).send({ token: "", status: "AApproved" })
  } catch (e) {
    console.log(e)
    res.status(401).send({ status: "Rejected" })
  }
})

// get all activities in the user's location (e.g. rexburg activities for rexburg residents)
router.get("/activities", auth, async (req, res) => {})

// get all activities which correspond to this user
router.get("/activities/me", auth, async (req, res) => {
  console.log("Here I am!")
  try {
    await req.user
      .populate({
        path: "activities",
      })
      .execPopulate()

    res.send({ activities: req.user.activities, status: "AApproved" })
  } catch (e) {
    res.status(500).send({ status: "Rejected" })
  }
})

module.exports = router
