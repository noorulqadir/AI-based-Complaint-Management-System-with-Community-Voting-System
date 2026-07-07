import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      const token = localStorage.getItem("token");

      const response = await API.post("/complaints", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
      navigate("/my-complaints");
    } catch (error) {
      alert(error.response?.data?.message || "Complaint submission failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-125"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Submit Complaint
          </h1>

          <input
            type="text"
            name="title"
            placeholder="Complaint Title"
            className="w-full border p-3 rounded mb-4"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Complaint Description"
            className="w-full border p-3 rounded mb-4 h-32"
            onChange={handleChange}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full border p-3 rounded mb-4"
            onChange={handleChange}
          />

          <button className="w-full bg-black text-white p-3 rounded">
            Submit Complaint
          </button>
        </form>
      </div>
    </>
  );
}

export default SubmitComplaint;
