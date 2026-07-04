import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-background-light text-[#101519] min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-[#e9edf1] bg-white px-6 lg:px-40 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary w-10 h-10 rounded flex items-center justify-center text-white">
            <span className="material-symbols-outlined !text-2xl">
              account_balance
            </span>
          </div>
          <h1 className="text-[#101519] text-xl font-bold tracking-tight">
            Civic Desk
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Home
          </a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
            About
          </a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Support
          </a>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all">
            Contact Us
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-6 bg-background-light">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#d4dce3]">
            <button
              type="button"
              className="flex-1 flex flex-col items-center justify-center border-b-[3px] border-primary text-[#101519] pb-3 pt-5 font-bold transition-all"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="flex-1 flex flex-col items-center justify-center border-b-[3px] border-transparent text-[#5b748b] pb-3 pt-5 font-bold hover:text-primary transition-all"
            >
              Register
            </button>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#101519]">Welcome back</h2>
              <p className="text-sm text-[#5b748b] mt-1">
                Please enter your details to access your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col">
                <label className="text-[#101519] text-sm font-semibold pb-2">
                  Email
                </label>
                <input
                  className="form-input w-full rounded-lg border-[#d4dce3] bg-gray-50 text-[#101519] focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 text-base transition-all"
                  placeholder="e.g., john@example.com"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center pb-2">
                  <label className="text-[#101519] text-sm font-semibold">
                    Password
                  </label>
                  <a className="text-primary text-xs font-bold hover:underline" href="#">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    className="form-input w-full rounded-lg border-[#d4dce3] bg-gray-50 text-[#101519] focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 pl-4 pr-12 text-base transition-all"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b748b] hover:text-primary"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-lg font-bold text-base shadow-md shadow-primary/20 transition-all mt-4"
              >
                Login
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#d4dce3]"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#5b748b] font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 h-12 border border-[#d4dce3] rounded-lg hover:bg-gray-50 transition-all"
              >
                <img
                  alt="Google Logo"
                  className="w-5 h-5"
                  src="https://www.google.com/favicon.ico"
                />
                <span className="text-sm font-semibold text-[#101519]">Google</span>
              </button>
            </div>

            <p className="text-center mt-6 text-sm text-[#5b748b]">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#e9edf1] py-8 px-6 lg:px-40">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 w-8 h-8 rounded flex items-center justify-center text-primary/60">
              <span className="material-symbols-outlined !text-lg">
                account_balance
              </span>
            </div>
            <p className="text-sm text-[#5b748b]">© 2026 Civic Desk | All Rights Reserved</p>
          </div>
          <div className="flex gap-8">
            <a className="text-xs font-semibold text-[#5b748b] hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-xs font-semibold text-[#5b748b] hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-xs font-semibold text-[#5b748b] hover:text-primary transition-colors" href="#">
              Cookie Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;