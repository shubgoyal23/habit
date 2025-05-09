import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import dotenv from "dotenv";
import connectDb from "./db/connectDb.js";
import rateLimit from "express-rate-limit";
import { ApiResponse } from "./utils/ApiResposne.js";


dotenv.config();

const app = express();

const limiter = rateLimit({
   windowMs: 60 * 60 * 1000,
   limit: 100,
   standardHeaders: "draft-8",
   legacyHeaders: false,
});
app.use(limiter);

app.use(
   cors({ origin: process.env.CORS_ORIGIN.split(";"), credentials: true })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRouter from "./routers/user.router.js";
import steakRouter from "./routers/steak.router.js";
import chatRouter from "./routers/chat.router.js";
import appRouter from "./routers/app.router.js";
import NotesRouter from "./routers/note.router.js";

app.get("/ping", (req, res) => {
   res.send("pong");
});

app.use((req, res, next) => {
   connectDb()
      .then(() => next())
      .catch(() =>
         res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"))
      );
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/steak", steakRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/app", appRouter);
app.use("/api/v1/notes", NotesRouter);

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
