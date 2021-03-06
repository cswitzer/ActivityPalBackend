const express = require("express")
const mongoose = require("mongoose")
const router = new express.Router()

const Activity = require("../../models/activityModel.js")
const User = require("../../models/userModel.js")
const auth = require("../middleware/auth.js")
const authHeader = require("../middleware/authHeader.js")

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
    res.status(401).send({ status: "Rejected" })
  }
})

// join an activity with the associated id
router.post("/activities/join/:id", auth, async (req, res) => {
  // :id refers to object id of activity, which will be retrievd from a hidden editText field in cardview
  try {
    // update participants in activity and joinedActivities in user
    const user = await User.findOne({ token: req.token })
    const activity = await Activity.findById(req.params.id)

    if (
      !user.joinedActivities.includes(req.params.id) ||
      !activity.participants.includes(user.email)
    ) {
      user.joinedActivities.push(req.params.id) // only push the id of each activity
      activity.participants.push(user.email)
    } else {
      throw "Error!"
    }

    await user.save()
    await activity.save()
    res.send({ status: "Joined Success" })
  } catch (e) {
    res.status(401).send({ status: "Rejected" })
  }
})

router.post("/activities/leave/:id", auth, async (req, res) => {
  try {
    // update participants in activity and joinedActivities in user
    const user = await User.findOneAndUpdate(
      {
        token: req.token,
      },
      {
        $pull: {
          joinedActivities: req.params.id,
        },
      }
    )

    const activity = await Activity.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $pull: {
          participants: req.user.email,
        },
      }
    )
    await user.save()
    await activity.save()
    res.send({ status: "Joined Success" })
  } catch (e) {
    res.status(401).send({ status: "Rejected" })
  }
})

router.patch("/activities/:id", auth, async (req, res) => {
  console.log(req.params.id)
  try {
    await Activity.findByIdAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
      }
    )
    res.send({ status: "Updated Success " })
  } catch (e) {
    console.log(e)
    res.status(401).send({ status: "Rejected" })
  }
})

// get all activities in the user's location (e.g. rexburg activities for rexburg residents)
router.get("/activities", authHeader, async (req, res) => {
  try {
    const activities = await Activity.find({
      city: req.get("city"),
    })
    // only get activities the user hasn't joined
    const filteredActivities = activities.filter((activity) => {
      if (!req.user.joinedActivities.includes(activity._id)) {
        return activity
      }
    })

    owners = []

    res.send({ activities: filteredActivities, owners })
  } catch (e) {
    res.status(500).send({ status: "Rejected" })
  }
})

// get all activities which correspond to this user
router.get("/activities/me", authHeader, async (req, res) => {
  try {
    await req.user.populate({
      path: "activities",
    })

    // get current owner for each activity
    const owners = await Promise.all(
      req.user.activities.map(async (activity) => {
        const user = await User.findById(activity.owner)
        return user
      })
    )

    res.send({ activities: req.user.activities, owners: owners })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: "Rejected" })
  }
})

// retrieve a list of all activities the user has joined
router.get("/activities/join", authHeader, async (req, res) => {
  try {
    const activities = await Promise.all(
      req.user.joinedActivities.map(
        async (activityId) => await Activity.findById(activityId)
      )
    )
    owners = []

    res.send({ activities: activities, owners: owners })
  } catch (e) {
    res.status(401).send({ status: "Rejected" })
  }
})

module.exports = router
