import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true}));
app.use(express.static("frontend/dist"));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRouter from "./routers/user.router.js";
import steakRouter from "./routers/steak.router.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/steak", steakRouter);


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.use("*",(_, res) => {
   res.sendFile(path.join(__dirname + '/../frontend/dist/index.html'));
 });
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
