import dotenv from "dotenv";

dotenv.config();

import { app } from "./app.js";

const port = Number(process.env.PORT) || 8000;
app.listen(port, () => {
   console.log(`server started at http://localhost:${port}`);
});
