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

app.use("/jd/user", userRouter);
app.use("/jd/auth", authRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json(
        {
            success: false,
            statusCode,
            message
        }
    )
});

app.listen(3000, () => {
    console.log("Server is running in port 3000!!");
});