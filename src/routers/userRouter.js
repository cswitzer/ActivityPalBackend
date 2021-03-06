const express = require("express")
const mongoose = require("mongoose")
const router = new express.Router()

const User = require("../../models/userModel.js")
const auth = require("../middleware/auth.js")

// some functions will need to be async
router.post("/users/register", async (req, res) => {
  req.body._id = new mongoose.Types.ObjectId().toHexString()
  const user = new User({
    ...req.body,
  })

  // android will use these status codes to determine what to do next
  try {
    await user.save()
    res.send({ token: "", status: "Approved" })
  } catch (e) {
    console.log(e)
    res.send({ status: "Rejected" })
  }
})

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token, status: "Approved" })
  } catch (e) {
    res.status(400).send({ status: "Rejected" })
  }
})

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.token = ""
    await req.user.save()
    res.send({ token: "", status: "Approved" })
  } catch (e) {
    res.status(400).send({ status: "Rejected" })
  }
})

module.exports = router
