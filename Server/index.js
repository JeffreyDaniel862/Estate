import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB)
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log(err)
    });

app.listen(3000, () => {
    console.log("Server is running in port 3000!!");
});