import React from "react";
import "./styles/notification.scss";
import {localUrl} from "../../constants/constants";

const Notification = ({ notifications, onClose, fetchNotifications }) => {
  const accessToken = localStorage.getItem("access");
  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${localUrl}/api/crm/v1/notifications/${id}/read/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при отметке уведомления как прочитанного");
      }
      await fetchNotifications();
    } catch (error) {
      console.error("Ошибка при отметке уведомления как прочитанного:", error);
    }
  };

  return (
    <div className="notification-popup">
      <div className="notification-popup__header">
        <h3 className="notification-popup__header-title">Уведомления</h3>
        <button onClick={onClose} className="notification-popup__close">
          ✕
        </button>
      </div>
      <div className="notification-popup__content">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${
              notification.read ? "notification-item--read" : ""
            }`}
          >
            <div className="notification-item__header">
              <span className="notification-item__author">
                {notification.author}
              </span>
            </div>
            <div className="notification-item__message">
              {notification.message}
            </div>
            {!notification.is_read && (
              <button
                className="notification-item__mark-read"
                onClick={() => markAsRead(notification.id)}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
