import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { studentSchema } from "../validation/studentSchema";
import useRequest from "../hook/useRequest";

import { encryptData } from "../utils/crypto";

import "../css/student.css";

const API_URL = import.meta.env.VITE_API_URL;

type StudentFormData = z.infer<
  typeof studentSchema
>;

const StudentForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),

    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: undefined,
      address: "",
      courseEnrolled: "",
      password: "",
    },
  });

  const { apiCall, loading, error } =
    useRequest<any>();

  const onSubmit = async (
    data: StudentFormData
  ) => {
    console.log(data);

    const encryptedData =
      encryptData(data);

    const response = await apiCall(
      `${API_URL}/register`,
      "POST",
      {
        data: encryptedData,
      }
    );

    if (response) {
      console.log(response);

       localStorage.setItem(
        "token",
        response.token
      );


      alert("Student Registered");

      navigate("/list");

      reset();
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        Student Registration Form
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Full Name */}
        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            {...register("fullName")}
          />

          <p className="error-message">
            {errors.fullName?.message}
          </p>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            {...register("email")}
          />

          <p className="error-message">
            {errors.email?.message}
          </p>
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number</label>

          <input
            type="text"
            {...register(
              "phoneNumber"
            )}
          />

          <p className="error-message">
            {
              errors.phoneNumber
                ?.message
            }
          </p>
        </div>

        {/* DOB */}
        <div className="form-group">
          <label>Date of Birth</label>

          <input
            type="date"
            {...register(
              "dateOfBirth"
            )}
          />

          <p className="error-message">
            {
              errors.dateOfBirth
                ?.message
            }
          </p>
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>

          <select
            {...register("gender")}
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          <p className="error-message">
            {errors.gender?.message}
          </p>
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>

          <textarea
            {...register("address")}
          />

          <p className="error-message">
            {errors.address?.message}
          </p>
        </div>

        {/* Course */}
        <div className="form-group">
          <label>
            Course Enrolled
          </label>

          <input
            type="text"
            {...register(
              "courseEnrolled"
            )}
          />

          <p className="error-message">
            {
              errors.courseEnrolled
                ?.message
            }
          </p>
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            {...register("password")}
          />

          <p className="error-message">
            {errors.password?.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading
            ? "Loading..."
            : "Register Student"}
        </button>

        {error && (
          <p className="api-error">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default StudentForm;