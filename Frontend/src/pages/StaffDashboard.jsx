import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token");

    const response = await API.get("/complaints", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setComplaints(response.data.complaints);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    await API.put(
      `/complaints/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchComplaints();
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>

        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-xl font-bold">{complaint.title}</h2>
              <p className="text-gray-600 mt-2">{complaint.description}</p>

              <div className="mt-3 flex gap-4">
                <span>Category: {complaint.category}</span>
                <span>Votes: {complaint.votes}</span>
              </div>

              <select
                value={complaint.status}
                onChange={(e) => updateStatus(complaint._id, e.target.value)}
                className="border p-2 rounded mt-4"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StaffDashboard;