import { useEffect, useState } from "react";
import useRequest from "../hook/useRequest";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStudentSchema } from "../validation/studentSchema";
import { encryptData, decryptData } from "../utils/crypto";
import "../css/studentList.css";

const API_URL = import.meta.env.VITE_API_URL;

type StudentFormData = z.infer<typeof updateStudentSchema>;

interface StudentRaw {
  _id: string;
  email: string;
  data: string;
}

interface Student {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
}

const StudentList = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(updateStudentSchema),
  });

  const { loading, error, apiCall } = useRequest<{
    students: StudentRaw[];
  }>();

  const [students, setStudents] = useState<Student[]>([]);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const fetchStudents = async () => {
    const result = await apiCall(`${API_URL}/students`, "GET");

    if (result?.students) {
      const decrypted = result.students
        .map((s: StudentRaw) => {
          try {
            const plaintext = decryptData(s.data);
            const parsed = JSON.parse(plaintext);
            return { _id: s._id, email: s.email, ...parsed } as Student;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as Student[];

      setStudents(decrypted);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openEdit = (student: Student) => {
    setEditStudent(student);
    reset({
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      dateOfBirth: student.dateOfBirth.split("T")[0],
      gender: student.gender as any,
      address: student.address,
      courseEnrolled: student.courseEnrolled,
    });
  };

  const closeEdit = () => {
    setEditStudent(null);
    reset();
  };

  const onSubmit = async (formData: StudentFormData) => {
    if (!editStudent) return;
    setSaving(true);
    try {
      const payload = { ...formData, email: editStudent.email };
      const encryptedData = encryptData(payload);

      const result = await apiCall(
        `${API_URL}/student/${editStudent._id}`,
        "PUT",
        { data: encryptedData },
      );

      if (result) {
        alert(result.message || "Student updated successfully");
        closeEdit();
        fetchStudents();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student?")) return;

    const result = await apiCall(
      `${API_URL}/student/${id}`,
      "DELETE",
    );

    if (result) {
      alert(result.message || "Student deleted successfully");
      fetchStudents();
    }
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Student List</h2>

      {loading && <p className="loading-text">Loading...</p>}

      {!loading && students.length > 0 && (
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge badge-${student.gender.toLowerCase()}`}
                    >
                      {student.gender}
                    </span>
                  </td>
                  <td>{student.courseEnrolled}</td>
                  <td>{student.address}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon edit"
                      title="Edit"
                      onClick={() => openEdit(student)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      title="Delete"
                      onClick={() => handleDelete(student._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && students.length === 0 && (
        <p className="empty-text">No students found.</p>
      )}

      {editStudent && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Student</h3>
              <button
                type="button"
                className="modal-close"
                onClick={closeEdit}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" {...register("fullName")} />
                <p className="error-message">{errors.fullName?.message}</p>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editStudent.email}
                  disabled
                  className="input-disabled"
                  {...register("email")}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" {...register("phoneNumber")} />
                <p className="error-message">{errors.phoneNumber?.message}</p>
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" {...register("dateOfBirth")} />
                <p className="error-message">{errors.dateOfBirth?.message}</p>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select {...register("gender")}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p className="error-message">{errors.gender?.message}</p>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea {...register("address")} />
                <p className="error-message">{errors.address?.message}</p>
              </div>

              <div className="form-group">
                <label>Course Enrolled</label>
                <input type="text" {...register("courseEnrolled")} />
                <p className="error-message">
                  {errors.courseEnrolled?.message}
                </p>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={closeEdit}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
