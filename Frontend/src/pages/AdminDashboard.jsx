import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
      headers: { Authorization: `Bearer ${token}` }
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
    headers: { Authorization: `Bearer ${token}` }
  });

  setUsers(response.data.users);
};

const deleteUser = async (id) => {
  const token = localStorage.getItem("token");

  await API.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  fetchUsers();
  fetchStats();
};

const updateRole = async (id, role) => {
  const token = localStorage.getItem("token");

  await API.put(`/admin/users/${id}/role`, 
    { role },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
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
    return <h1 className="text-center mt-20 text-2xl">Loading...</h1>;
  }

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Users</h2>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Complaints</h2>
            <p className="text-3xl font-bold">{stats.totalComplaints}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Pending</h2>
            <p className="text-3xl font-bold">{stats.pendingComplaints}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">In Progress</h2>
            <p className="text-3xl font-bold">{stats.inProgressComplaints}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Resolved</h2>
            <p className="text-3xl font-bold">{stats.resolvedComplaints}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Votes</h2>
            <p className="text-3xl font-bold">{stats.totalVotes}</p>
          </div>
          <div className="mt-10 bg-white p-6 rounded-xl shadow">
  <h2 className="text-2xl font-bold mb-4">Users Management</h2>

  <div className="grid gap-3">
    {users.map((user) => (
      <div key={user._id} className="flex justify-between border p-3 rounded">
        <div>
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm">Role: {user.role}</p>
        </div>
        <select
  value={user.role}
  onChange={(e) => updateRole(user._id, e.target.value)}
  className="border p-2 rounded"
>
  <option value="user">user</option>
  <option value="staff">staff</option>
  <option value="admin">admin</option>
</select>
        <button
          onClick={() => deleteUser(user._id)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    ))}
  </div>
</div>
        </div>
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
  <h2 className="text-2xl font-bold mb-4">Complaint Status Overview</h2>

  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
      </div>
    </>
  );
}

export default AdminDashboard;