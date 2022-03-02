const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const passwordRequirements = {
  minLength: 12,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
}

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email")
        }
      },
    },
    password: {
      type: String,
      required: true,
      validator(value) {
        if (!validator.isStrongPassword(value, passwordRequirements)) {
          throw new Error(
            "Password requirements: min 8 chars, min 1 lower and uppercase letters, min 1 symbol and number"
          )
        }
      },
      trim: true,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  user.token = token

  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    // console.log("User not found")
    throw new Error("Unable to login")
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    // console.log("No matches found")
    throw new Error("Unable to login")
  }
  return user
}

userSchema.pre("save", async function (next) {
  const user = this

  // only run this if password has been modified
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12)
  }

  next()
})

const User = mongoose.model("User", userSchema)
module.exports = User
