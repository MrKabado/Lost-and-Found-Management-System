import { useEffect, useState } from "react"
import { Bell, X } from "lucide-react"
import {
  formatDate,
  getApiError,
  getNotification,
  getNotificationCount,
  getNotifications,
  markAllNotificationsAsRead,
  type Notification,
} from "@/lib/client"

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [selected, setSelected] = useState<Notification | null>(null)
  const [error, setError] = useState("")

  const refresh = async () => {
    try {
      const [nextNotifications, nextCount] = await Promise.all([
        getNotifications(),
        getNotificationCount(),
      ])
      setNotifications(showAll ? nextNotifications : nextNotifications.slice(0, 5))
      setCount(nextCount)
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load notifications."))
    }
  }

  useEffect(() => {
    void refresh()
  }, [showAll])

  const openNotification = async (notification: Notification) => {
    try {
      setSelected(await getNotification(notification.id))
      setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, is_read: true } : item))
      setCount((current) => Math.max(current - (notification.is_read ? 0 : 1), 0))
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to open notification."))
    }
  }

  const markAllRead = async () => {
    await markAllNotificationsAsRead()
    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })))
    setCount(0)
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-label="Notifications" className="relative rounded-full p-2 text-[#092354] hover:bg-[#EFF6FF]">
        <Bell size={19} />
        {count > 0 && <span className="absolute -top-1 -right-1 min-w-4 rounded-full bg-[#2563EB] px-1 text-center text-[10px] font-bold text-white">{count}</span>}
      </button>
      {open && (
        <div className="absolute top-11 right-0 z-30 w-80 rounded-xl border border-[#D8DCEF] bg-white p-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-2 pb-2">
            <strong className="text-sm text-[#092354]">Notifications</strong>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowAll((current) => !current)} className="text-xs font-semibold text-[#2563EB]">{showAll ? "Preview" : "View all"}</button>
              <button type="button" onClick={() => void markAllRead()} className="text-xs font-semibold text-[#2563EB]">Mark all read</button>
            </div>
          </div>
          {error && <p className="px-2 py-3 text-xs text-red-700">{error}</p>}
          {!error && notifications.length === 0 && <p className="px-2 py-5 text-center text-sm text-[#6B7280]">No notifications yet.</p>}
          {notifications.map((notification) => (
            <button key={notification.id} type="button" onClick={() => void openNotification(notification)} className={`block w-full border-b border-[#F1F5F9] px-2 py-3 text-left last:border-0 hover:bg-[#F8FAFC] ${notification.is_read ? "" : "bg-[#EFF6FF]"}`}>
              <div className="flex items-start justify-between gap-2"><span className="text-sm font-semibold text-[#092354]">{notification.title}</span><span className="text-[10px] text-[#6B7280]">{formatDate(notification.created_at)}</span></div>
              <p className="mt-1 truncate text-xs text-[#61708A]">{notification.message}</p>
            </button>
          ))}
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#092354]/30 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-[#2563EB]">{selected.type}</p><h2 className="mt-1 text-xl font-semibold text-[#092354]">{selected.title}</h2></div><button type="button" onClick={() => setSelected(null)} aria-label="Close notification"><X size={19} /></button></div>
            <p className="mt-5 text-sm leading-6 text-[#374151]">{selected.message}</p>
            <p className="mt-5 text-xs text-[#6B7280]">{formatDate(selected.created_at)}</p>
            {selected.navigation_url && <a href={selected.navigation_url} onClick={() => setSelected(null)} className="mt-5 inline-block rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">View related item</a>}
          </div>
        </div>
      )}
    </div>
  )
}