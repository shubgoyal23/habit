import dotenv from "dotenv";

dotenv.config();

import { app } from "./app.js";
import connectDb from "./db/connectDb.js";

const port = Number(process.env.PORT) || 8000;
app.listen(port, () => {
   console.log(`server started at http://localhost:${port}`);
});
connectDb()
   .then((res) => {
   })
   .catch((error) => console.log(error));
