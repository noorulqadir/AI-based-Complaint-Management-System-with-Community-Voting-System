import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/complaints/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComplaints(response.data.complaints);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">My Complaints</h1>

        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-xl font-bold">{complaint.title}</h2>

              <p className="text-gray-600 mt-2">{complaint.description}</p>

              <div className="mt-3 flex gap-4 items-center">
                <span>Category: {complaint.category}</span>

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

                <span>Votes: {complaint.votes}</span>
              </div>

              {complaint.image && (
                <img
                  src={`http://localhost:5000/uploads/${complaint.image}`}
                  alt="Complaint"
                  className="mt-4 w-48 rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyComplaints;
