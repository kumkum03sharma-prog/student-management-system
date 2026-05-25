import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { encryptData } from "../utils/crypto";

import { loginSchema } from "../validation/studentSchema";

import useRequest from "../hook/useRequest";

import "../css/student.css";

const API_URL = import.meta.env.VITE_API_URL;

type LoginFormData = z.infer<typeof loginSchema>;

const StudentLogin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { apiCall, loading, error } = useRequest<any>();

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const onSubmit = async (data: LoginFormData) => {
    const encryptedData = encryptData(data);

    const response = await apiCall(`${API_URL}/login`, "POST", {
      data: encryptedData,
    });

    if (response) {
      localStorage.setItem("token", response.token);
      alert(response.message || "Login Successful");
      navigate("/list");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Student Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Email</label>

          <input type="email" {...register("email")} />

          <p className="error-message">{errors.email?.message}</p>
        </div>

        <div className="form-group">
          <label>Password</label>

          <input type="password" {...register("password")} />

          <p className="error-message">{errors.password?.message}</p>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default StudentLogin;
