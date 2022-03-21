const jwt = require("jsonwebtoken")
const User = require("../../models/userModel.js")

const auth = async (req, res, next) => {
  try {
    // console.log(req.body)
    const token = req.body.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, token })
    // console.log(user)

    if (!user) {
      throw new Error()
    }

    req.token = token
    req.user = user

    next()
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." })
  }
}

module.exports = auth
