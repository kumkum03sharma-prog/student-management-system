import { Request, Response } from "express";
import Student from "../models/Student";
import { firstDecrypt, secondEncrypt, secondDecrypt } from "../utils/crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in .env");
}

// REGISTER
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const frontendEncryptedData = req.body.data;

    if (!frontendEncryptedData) {
      return res.status(400).json({
        success: false,
        message: "Data is required",
      });
    }

    const plaintext = firstDecrypt(frontendEncryptedData);
    const originalData = JSON.parse(plaintext);

    const existingStudent = await Student.findOne({
      email: originalData.email,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const { password, ...safeData } = originalData;
    const backendEncryptedData = secondEncrypt(JSON.stringify(safeData));

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      data: backendEncryptedData,
      email: originalData.email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        studentId: student._id,
        email: student.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
      token,
      studentId: student._id,
    });
  } catch (error) {
    console.log("registerStudent error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// LOGIN
export const loginStudent = async (req: Request, res: Response) => {
  try {
    const frontendEncryptedData = req.body.data;

    if (!frontendEncryptedData) {
      return res.status(400).json({
        success: false,
        message: "Encrypted data required",
      });
    }

    const plaintext = firstDecrypt(frontendEncryptedData);
    const { email, password } = JSON.parse(plaintext);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password required",
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, student.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }


    const token = jwt.sign(
      { studentId: student._id, email: student.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
    });
  } catch (error) {
    console.log("loginStudent error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getStudents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const students = await Student.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const result = students.map((student) => {
      try {
    
        const l1Encrypted = secondDecrypt(student.data);

        return {
          _id: student._id,
          email: student.email,  
          data: l1Encrypted,     
        };
      } catch {
        return { _id: student._id, error: "Decryption failed" };
      }
    });

    return res.status(200).json({
      success: true,
      students: result,
      page,
      limit,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE STUDENT
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const frontendEncryptedData = req.body.data;

    if (!frontendEncryptedData) {
      return res.status(400).json({
        success: false,
        message: "Data is required",
      });
    }


    const plaintext = firstDecrypt(frontendEncryptedData);
    const updatedData = JSON.parse(plaintext);


    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: { data: secondEncrypt(JSON.stringify(updatedData)) } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Student Updated Successfully",
      studentId: updatedStudent?._id,
    });
  } catch (error) {
    console.log("updateStudent error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// DELETE STUDENT
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await Student.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Student Deleted Successfully",
      studentId: id,
    });
  } catch (error) {
    console.log("deleteStudent error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};