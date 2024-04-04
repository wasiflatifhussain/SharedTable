import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to database!"));

const app = express();
app.use(express.json());
app.use(cors());

// forward the /api/my/user to myUserRoute
app.use("/api/my/user", myUserRoute); 

app.listen(8010, () => {
    console.log("Server started on localhost:8010");
});