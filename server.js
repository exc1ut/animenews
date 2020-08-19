import express from "express";
import mongoose from "mongoose";
import { db } from "./config.js";
import bodyParser from "body-parser";
import path from "path";

//import controllers
import News from "./routes/NewsRoute.js";
import Category from "./routes/CategoryRoute.js";

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//connect to db
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

//routes
app.use("/news", News);
app.use("/category", Category);
// Server static assets if in production
// if (process.env.NODE_ENV === "production") {
// Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
// }

//server execution
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
