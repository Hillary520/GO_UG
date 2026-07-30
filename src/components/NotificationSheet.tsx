import { Bell, CheckCheck, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function NotificationSheet() {
  const {
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();

  if (!notificationsOpen) return null;

  return (
    <div
      className="sheet-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) setNotificationsOpen(false);
      }}
    >
      <section
        className="auth-sheet notification-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-title"
      >
        <button
          className="icon-button auth-sheet__close"
          onClick={() => setNotificationsOpen(false)}
          aria-label="Close notifications"
        >
          <X size={20} />
        </button>
        <span className="auth-sheet__mini-mark">
          <Bell size={16} />
          Updates
        </span>
        <div className="notification-sheet__head">
          <div>
            <p className="eyebrow">Stay in the loop</p>
            <h2 id="notification-title">Notifications</h2>
          </div>
          {notifications.some((item) => !item.read) && (
            <button className="text-button" onClick={markAllNotificationsRead}>
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>
        <div className="notification-list">
          {notifications.length ? (
            notifications.map((item) => (
              <button
                key={item.id}
                className={item.read ? "" : "is-unread"}
                onClick={() => markNotificationRead(item.id)}
              >
                <span className="notification-list__dot" />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.body}</small>
                </span>
              </button>
            ))
          ) : (
            <p className="muted">You’re all caught up.</p>
          )}
        </div>
      </section>
    </div>
  );
}
