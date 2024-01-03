import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB)
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log(err)
    });

app.use("/user", userRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
    console.log("Server is running in port 3000!!");
});