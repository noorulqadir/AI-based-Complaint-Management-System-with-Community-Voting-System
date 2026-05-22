import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = message;
    setChat([...chat, { sender: "user", text: userMessage }]);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await API.post(
        "/chatbot",
        { message: userMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setChat((prev) => [
        ...prev,
        { sender: "bot", text: response.data.reply },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Chatbot failed to respond." },
      ]);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-bold mb-6">AI Chatbot</h1>

          <div className="h-96 overflow-y-auto border rounded p-4 mb-4 bg-gray-50">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              placeholder="Ask something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border p-3 rounded"
            />

            <button className="bg-black text-white px-6 rounded">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
