import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async (filters = {}) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await API.get("/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });

      setComplaints(response.data.complaints);
    } catch (error) {
      alert("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/complaints/${id}/vote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchComplaints();
    } catch (error) {
      alert("Voting failed");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Public Complaints</h1>
        <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search keyword..."
            className="border p-3 rounded"
            onChange={(e) => fetchComplaints({ keyword: e.target.value })}
          />

          <select
            className="border p-3 rounded"
            onChange={(e) => fetchComplaints({ category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="Water">Water</option>
            <option value="Road">Road</option>
            <option value="Electricity">Electricity</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="General">General</option>
          </select>

          <select
            className="border p-3 rounded"
            onChange={(e) => fetchComplaints({ status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        {loading && (
          <p className="text-center text-gray-600">Loading complaints...</p>
        )}

        {!loading && complaints.length === 0 && (
          <p className="text-center text-gray-600">No complaints found.</p>
        )}
        <div className="grid gap-5">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white p-5 rounded-xl shadow">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{complaint.title}</h2>

                <button
                  onClick={() => handleVote(complaint._id)}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Vote ({complaint.votes})
                </button>
              </div>

              <p className="mt-3 text-gray-600">{complaint.description}</p>

              <div className="flex gap-5 mt-4">
                <span className="font-semibold">
                  Category: {complaint.category}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-semibold
    ${
      complaint.status === "Pending"
        ? "bg-yellow-500"
        : complaint.status === "In Progress"
          ? "bg-blue-500"
          : "bg-green-600"
    }`}
                >
                  {complaint.status}
                </span>
              </div>

              {complaint.image && (
                <img
                  src={`http://localhost:5000/uploads/${complaint.image}`}
                  alt="Complaint"
                  className="mt-4 w-60 rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
