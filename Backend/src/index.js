// require('dotenv').config({path: '.env'})

// import mongoose from "mongoose";
// import {DB_NAME} from './constants'
import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`o server is running at port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MONGO db connection failed !!!", error)
})
// import express from 'express'
// const app = express()
// (async() => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", () => {
//         console.log("Err",error)
//         throw error
//        })

//        app.listen(process.env.PORT, () => {
//         console.log(`Server is running on port ${process.env.PORT}`)
//        })
//     } catch (error) {
//         console.error("Error", error)
//     }
// })()