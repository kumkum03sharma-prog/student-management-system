import { useNavigate, Link } from "react-router-dom";
import "./css/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        Student Panel
      </div>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/list">Students</Link>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
