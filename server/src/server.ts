import dotenv from "dotenv";
dotenv.config();


import mongoose from "mongoose";
import app from "./app";


const PORT = process.env.PORT || 8100;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });