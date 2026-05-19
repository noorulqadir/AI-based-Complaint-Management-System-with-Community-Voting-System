import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const linkStyle = ({ isActive }) =>
    isActive
      ? "bg-white text-black px-3 py-1 rounded"
      : "hover:text-gray-300";

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Civic Desk</h1>

      <div className="flex gap-5 items-center">
        <NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink>
        <NavLink to="/submit-complaint" className={linkStyle}>Submit</NavLink>
        <NavLink to="/my-complaints" className={linkStyle}>My Complaints</NavLink>
        <NavLink to="/notifications" className={linkStyle}>Notifications</NavLink>

        {(user?.role === "staff" || user?.role === "admin") && (
          <NavLink to="/staff" className={linkStyle}>Staff</NavLink>
        )}

        {user?.role === "admin" && (
          <NavLink to="/admin" className={linkStyle}>Admin</NavLink>
        )}

        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;