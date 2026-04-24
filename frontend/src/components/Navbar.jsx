import { useNavigate, useLocation } from "react-router-dom"

const NAV_LEAD_AUTHOR = [
  { label: "Dashboard", path: "/stories", icon: "⊞" },
  { label: "My Stories", path: "/stories", icon: "📖" },
  { label: "Review Dashboard", path: "/review", icon: "✦" },
]

const NAV_CONTRIBUTOR = [
  { label: "Dashboard", path: "/stories", icon: "⊞" },
  { label: "Explore Stories", path: "/stories", icon: "🌍" },
  { label: "My Branches", path: "/my-branches", icon: "✦" },
]

function Navbar({ currentUser, onToggleSidebar }) {
  const navigate = useNavigate()
  const location = useLocation()
  const nav = currentUser?.role === "lead_author" ? NAV_LEAD_AUTHOR : NAV_CONTRIBUTOR

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-ink-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-2xl bg-primary-600 p-2 text-white shadow-sm hover:bg-primary-700 transition"
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div className="text-center">
          <p className="font-heading text-base text-ink-900">Kinyurite</p>
          <p className="text-xs text-ink-500">{currentUser?.username || "Guest"}</p>
        </div>
        <div className="w-8" />
      </div>
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto">
        {nav.map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`rounded-full border border-ink-200 px-3 py-2 text-xs font-medium transition ${
              location.pathname === item.path
                ? "bg-primary-600 text-white"
                : "bg-ink-50 text-ink-700 hover:bg-ink-100"
            }`}
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Navbar
