const express = require("express")

const router = new express.Router()

// some functions will need to be async
router.get("/activities", (req, res) => {
  console.log("activity router working")
})

module.exports = router
