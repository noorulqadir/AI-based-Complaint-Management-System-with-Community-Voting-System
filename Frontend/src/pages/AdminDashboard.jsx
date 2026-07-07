import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(response.data.stats);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load admin stats");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const response = await API.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(response.data.users);
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");

    await API.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
    fetchStats();
  };

  const updateRole = async (id, role) => {
    const token = localStorage.getItem("token");

    await API.put(
      `/admin/users/${id}/role`,
      { role },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    fetchUsers();
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const chartData = [
    { name: "Pending", count: stats?.pendingComplaints || 0 },
    { name: "In Progress", count: stats?.inProgressComplaints || 0 },
    { name: "Resolved", count: stats?.resolvedComplaints || 0 },
  ];

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-sub bg-background-light">
        Loading...
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "group", tint: "blue" },
    { label: "Total Complaints", value: stats.totalComplaints, icon: "description", tint: "orange" },
    { label: "Pending", value: stats.pendingComplaints, icon: "hourglass_empty", tint: "gray" },
    { label: "In Progress", value: stats.inProgressComplaints, icon: "autorenew", tint: "amber" },
    { label: "Resolved", value: stats.resolvedComplaints, icon: "check_circle", tint: "green" },
    { label: "Total Votes", value: stats.totalVotes, icon: "how_to_vote", tint: "purple" },
  ];

  const tintClasses = {
    blue: "bg-blue-50 text-primary",
    orange: "bg-orange-50 text-orange-600",
    gray: "bg-gray-100 text-text-sub",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <>
      <Navbar />

      <div className="bg-background-light text-text-main min-h-screen">
        <div className="max-w-300 mx-auto px-6 py-8">
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">
            Admin Dashboard
          </h1>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white p-6 rounded-xl border border-border-light shadow-sm flex items-start justify-between"
              >
                <div>
                  <p className="text-text-sub text-sm font-semibold uppercase tracking-wider mb-1">
                    {card.label}
                  </p>
                  <h3 className="text-3xl font-bold">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${tintClasses[card.tint]}`}>
                  <span className="material-symbols-outlined text-2xl">
                    {card.icon}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Users management */}
          <div className="mt-10 bg-white p-6 rounded-xl border border-border-light shadow-sm">
            <h2 className="text-lg font-bold mb-4">Users Management</h2>

            <div className="grid gap-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border-light p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {user.name
                        ?.split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-none">
                        {user.name}
                      </h3>
                      <p className="text-text-sub text-xs mt-1">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                      className="border border-border-light bg-gray-50 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <p className="text-text-sub text-sm text-center py-6">
                  No users yet.
                </p>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="mt-10 bg-white p-6 rounded-xl border border-border-light shadow-sm">
            <h2 className="text-lg font-bold mb-4">
              Complaint Status Overview
            </h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#57738e" fontSize={12} />
                  <YAxis stroke="#57738e" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2966a3" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;