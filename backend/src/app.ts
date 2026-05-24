import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// In app.ts, before your routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api", studentRoutes);

export default app;