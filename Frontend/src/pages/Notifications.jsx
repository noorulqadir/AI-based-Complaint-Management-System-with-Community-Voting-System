import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    const response = await API.get("/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotifications(response.data.notifications);
  };

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");

    await API.put(
      `/notifications/${id}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>

        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-white p-5 rounded-xl shadow flex justify-between"
            >
              <p>{notification.message}</p>

              {notification.isRead ? (
                <span className="text-green-600 font-semibold">Read</span>
              ) : (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Notifications;
