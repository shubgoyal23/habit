import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import dotenv from "dotenv";
import connectDb from "./db/connectDb.js";
dotenv.config();

const app = express();
app.use(cors({origin: process.env.CORS_ORIGIN.split(";"), credentials: true}));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRouter from "./routers/user.router.js";
import steakRouter from "./routers/steak.router.js";

app.get("/ping", (req, res) => {
   res.send("pong");
})

app.use((req, res, next) => {
   connectDb().then(() => next()).catch((error) => console.log(error));
})

app.use("/api/v1/users", userRouter);
app.use("/api/v1/steak", steakRouter);


app.use((err, req, res, next) => {
   if (err instanceof ApiError) {
      res.status(err.statusCode).json({
         success: false,
         message: err.message,
         errors: err.errors,
      });
   } else {
      console.error(err);
      res.status(500).json({
         success: false,
         message: err.message,
      });
   }
});

export { app };
