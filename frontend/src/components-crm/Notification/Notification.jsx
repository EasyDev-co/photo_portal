import React, { useState, useEffect } from "react";
import "./styles/notification.scss";

const Notification = ({ onClose, updateUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Имитируем загрузку уведомлений с сервера
      const testData = [
        { id: 1, author: "Иван Иванов", message: "Новое сообщение", read: false },
        { id: 2, author: "Мария Петрова", message: "Задача завершена", read: false },
        { id: 3, author: "Петр Сидоров", message: "Скоро встреча", read: true },
      ];
      setNotifications(testData);

      // Обновляем количество непрочитанных уведомлений в родительском компоненте
      const unreadCount = testData.filter((notification) => !notification.read).length;
      updateUnreadCount(unreadCount);
    } catch (error) {
      console.error("Ошибка при загрузке уведомлений:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Имитируем запрос на сервер для отметки уведомления как прочитанного
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );

      // Обновляем количество непрочитанных уведомлений
      const updatedUnreadCount = notifications.filter((notif) => !notif.read).length - 1;
      updateUnreadCount(updatedUnreadCount);
    } catch (error) {
      console.error("Ошибка при отметке уведомления как прочитанного:", error);
    }
  };

  return (
    <div className="notification-popup">
      <div className="notification-popup__header">
        <h3>Уведомления</h3>
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
            {!notification.read && (
              <button
                className="notification-item__mark-read"
                onClick={() => markAsRead(notification.id)}
              >
                Отметить как прочитанное
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
