import "dotenv/config";
// import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

// dotenv.config({
//   path: "./env",
// });
const app = express();

const PORT = process.env.PORT;

connectDB()
    .then(() => {
        app.listen(PORT || 3000, () => {
            console.log(`Server is running at port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Mongodb connection failed !!!", err);
    });
