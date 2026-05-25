import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import StudentForm from "./components/StudentForm";
import StudentLogin from "./components/StudentLogin";
import StudentList from "./components/StudentList";
import Navbar from "./navbar";

// ─── Private Route Guard ──────────────────────────────────
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// ─── Public Route Guard (redirect if already logged in) ───
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/list" replace /> : <>{children}</>;
};

const App = () => {
  return (

    <>
     <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />


        <Route
          path="/login"
          element={
            <PublicRoute>
              <StudentLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <StudentForm />
            </PublicRoute>
          }
        />


        <Route
          path="/list"
          element={
            <PrivateRoute>
              <StudentList />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </>
   
  );
};

export default App;