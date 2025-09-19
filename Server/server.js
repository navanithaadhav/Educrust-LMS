import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";


const app = express();
const PORT = process.env.PORT || 5000;

//connect to mongodb
 await connectDB();
// const allowOrigins = ["http://localhost:5173"];
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: allowOrigins , credentials: true }));
//api end point

//routes
app.get("/", (req, res) => {
  res.send("API is working🤩🤩🤩🤩🤩🤩!");
});
app.post('/clerk',express.json(),clerkWebhooks);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
