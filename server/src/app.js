import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))


// Routes import
import userRouter from "./routes/user.routes.js";
// import postRouter from "./routes/post.routes";

app.use("/auth", userRouter);
// app.use("/posts", postRouter);

export {app};