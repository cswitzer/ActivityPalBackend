const express = require("express")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const dotenv = require("dotenv")

const userRouter = require("./routers/userRouter")
const activityRouter = require("./routers/activityRouter")

const connectDB = require("../db/mongoose.js")

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE"],
}

app.use(helmet())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(userRouter)
app.use(activityRouter)

app.listen(port, () => {
  console.log(`Server successfully started on port ${port}`)
})
