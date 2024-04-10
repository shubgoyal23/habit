import dotenv from "dotenv";
import { app } from "./app.js";
import connectDb from "./db/connectDb.js";

dotenv.config();
const port = process.env.PORT || 8000;
connectDb()
   .then((res) => {
      app.listen(port, () => {
         console.log(`server started at http://localhost:${port}`);
      });
   })
   .catch((error) => console.log(error));
