import { useNavigate, useLocation } from "react-router-dom"

const NAV_LEAD_AUTHOR = [
  { label: "Dashboard",        path: "/stories", icon: "⊞" },
  { label: "My Stories",       path: "/stories", icon: "📖" },
  { label: "Review Dashboard", path: "/review",  icon: "✦" },
]

const NAV_CONTRIBUTOR = [
  { label: "Dashboard",       path: "/stories",     icon: "⊞" },
  { label: "Explore Stories", path: "/stories",     icon: "🌍" },
  { label: "My Branches",     path: "/my-branches", icon: "✦" },
]

function Navbar({ currentUser, onToggleSidebar }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const nav       = currentUser?.role === "lead_author" ? NAV_LEAD_AUTHOR : NAV_CONTRIBUTOR

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-ink-200 shadow-sm">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl bg-primary-600 px-3 py-2 text-white text-sm shadow-sm hover:bg-primary-700 transition"
          aria-label="Open sidebar"
        >
          ☰
        </button>

        <div className="text-center">
          <p className="font-heading text-base font-semibold italic text-ink-900">Kinyurite</p>
          <p className="text-[11px] text-ink-400 leading-tight">{currentUser?.username || "Guest"}</p>
        </div>

        {/* Spacer to balance the hamburger */}
        <div className="w-[52px]" />
      </div>

      {/* Nav pills */}
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
        {nav.map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`
              shrink-0 flex items-center gap-1.5
              rounded-full px-3 py-1.5 text-xs font-medium
              border transition-all
              ${
                location.pathname === item.path
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-ink-50 text-ink-600 border-ink-200 hover:bg-ink-100"
              }
            `}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Navbar