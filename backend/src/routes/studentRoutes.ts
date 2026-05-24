import express from "express";
import {
  registerStudent,
  loginStudent,
  getStudents,
  updateStudent,
  deleteStudent
} from "../controllers/studentController";
import authenticateToken from '../middleware/authenticateToken'

const router = express.Router();

router.post(
  "/register",
  registerStudent
);

router.post(
  "/login",
  loginStudent
);

router.put("/student/:id",authenticateToken, updateStudent);

router.delete("/student/:id",authenticateToken, deleteStudent);

router.get("/students",authenticateToken, getStudents);

export default router;