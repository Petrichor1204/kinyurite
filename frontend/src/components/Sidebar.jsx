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

function Sidebar({ currentUser, onLogout, collapsed, hidden, onToggleCollapse, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const nav = currentUser?.role === "lead_author" ? NAV_LEAD_AUTHOR : NAV_CONTRIBUTOR
  const sidebarClasses = hidden ? "-translate-x-full md:translate-x-0" : "translate-x-0"
  const widthClasses = collapsed ? "w-20" : "w-56"

  return (
    <div className={`fixed left-0 top-0 h-full z-20 transition-all duration-300 bg-primary-600 ${widthClasses} ${sidebarClasses}`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className={`rounded-2xl bg-accent-400 flex items-center justify-center ${collapsed ? "w-12 h-12" : "w-10 h-10"}`}>
            <span className="text-primary-900 font-bold text-sm">
              {currentUser?.username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <h1 className="font-heading text-white text-xl font-semibold italic">Kinyurite</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCollapse}
            className="rounded-full p-2 text-white hover:bg-primary-700 transition"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="text-lg">{collapsed ? "→" : "≡"}</span>
          </button>
          <button
            onClick={onClose}
            className="md:hidden rounded-full p-2 text-white hover:bg-primary-700 transition"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {currentUser && (
          <div className={`px-4 py-6 ${collapsed ? "items-center text-center" : ""}`}>
            {!collapsed ? (
              <>
                <p className="text-white text-sm font-semibold">{currentUser.username}</p>
                <p className="text-primary-200 text-xs mt-1">{currentUser.role === "lead_author" ? "Lead Author" : "Contributor"}</p>
              </>
            ) : (
              <span className="sr-only">{currentUser.username}</span>
            )}
          </div>
        )}

        <nav className="px-3 py-4 space-y-1">
          {nav.map(item => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 ${collapsed ? "justify-center" : "justify-start"} px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  active ? "bg-white text-primary-600" : "text-primary-100 hover:bg-primary-700"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {!collapsed && item.label}
              </button>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-primary-700">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 ${collapsed ? "justify-center" : "justify-start"} px-3 py-2.5 rounded-2xl text-sm font-medium text-primary-200 hover:bg-primary-700 transition-all`}
          >
            <span>→</span>
            {!collapsed && "Sign out"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
