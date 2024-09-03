import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true, limit: '16kb'})) // url data
app.use(express.static("public"))
app.use(cookieParser())
//routes

import userRouter from './routes/user.routes.js' 
import videoRouter from './routes/video.routes.js'

app.use("/api/v1/users", userRouter)  
app.use("/api/v1/videos", videoRouter) 

export {app}
// export default app