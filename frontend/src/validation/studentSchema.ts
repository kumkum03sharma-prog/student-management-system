import { z } from "zod";

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]*$/;
const phoneRegex = /^[6-9]\d{9}$/;

const fullName = z
  .string()
  .trim()
  .min(3, "Full name must be at least 3 characters")
  .max(60, "Full name must be 60 characters or less")
  .regex(nameRegex, "Only letters, spaces, dots, hyphens and apostrophes");

const email = z
  .email("Enter a valid email address")
  .trim()
  .toLowerCase()
  .max(100, "Email is too long");

const phoneNumber = z
  .string()
  .trim()
  .regex(phoneRegex, "Enter a valid 10-digit mobile number (starts with 6-9)");

const dateOfBirth = z
  .string()
  .min(1, "Date of birth is required")
  .refine((v) => new Date(v) < new Date(), {
    message: "Date of birth cannot be in the future",
  });

const gender = z.enum(["Male", "Female", "Other"], {
  message: "Please select a gender",
});

const address = z
  .string()
  .trim()
  .min(5, "Address must be at least 5 characters")
  .max(200, "Address must be 200 characters or less");

const courseEnrolled = z
  .string()
  .trim()
  .min(2, "Course must be at least 2 characters")
  .max(80, "Course name is too long");

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be 64 characters or less")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/\d/, "Must contain a number")
  .regex(/[!@#$%^&*]/, "Must contain a special character (!@#$%^&*)");

export const studentSchema = z.object({
  fullName,
  email,
  phoneNumber,
  dateOfBirth,
  gender,
  address,
  courseEnrolled,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const updateStudentSchema = z.object({
  fullName,
  email: email.optional(),
  phoneNumber,
  dateOfBirth,
  gender,
  address,
  courseEnrolled,
});
