import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoute from "./routes/AuthRoute.js"
import userRoute from "./routes/UserRoute.js"
import postRoute from "./routes/PostRoute.js"

//middlewares
const app  = express();

app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(bodyParser.json({limit: "30mb", extended: true}));

dotenv.config({path: './.env'});

mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDb server connected"));

app.listen(process.env.PORT , ()=>console.log(`server is running on port: ${process.env.PORT}`));

//routes

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);