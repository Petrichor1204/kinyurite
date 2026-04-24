import { useNavigate, useLocation } from "react-router-dom"

const NAV_LEAD_AUTHOR = [
  { label: "Dashboard",        path: "/stories", icon: "⊞" },
  { label: "My Stories",       path: "/stories", icon: "📖" },
  { label: "Review Dashboard", path: "/review",  icon: "✦" },
]

const NAV_CONTRIBUTOR = [
  { label: "Dashboard",      path: "/stories",    icon: "⊞" },
  { label: "Explore Stories", path: "/stories",   icon: "🌍" },
  { label: "My Branches",    path: "/my-branches", icon: "✦" },
]

function Sidebar({ currentUser, onLogout, collapsed, hidden, onToggleCollapse, onClose }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const nav       = currentUser?.role === "lead_author" ? NAV_LEAD_AUTHOR : NAV_CONTRIBUTOR
  const sidebarClasses = hidden ? "-translate-x-full md:translate-x-0" : "translate-x-0"
  const widthClasses   = collapsed ? "w-20" : "w-60"

  return (
    <div
      className={`
        fixed left-0 top-0 h-full z-20 flex flex-col
        transition-all duration-300
        bg-primary-600
        ${widthClasses} ${sidebarClasses}
      `}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-primary-700/50">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={`
              shrink-0 rounded-xl bg-accent-400
              flex items-center justify-center
              font-bold text-sm text-primary-900
              ${collapsed ? "w-11 h-11" : "w-9 h-9"}
            `}
          >
            {currentUser?.username.slice(0, 2).toUpperCase()}
          </div>

          {/* Brand + user info */}
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-heading text-white text-lg font-semibold italic leading-tight truncate">
                Kinyurite
              </h1>
              <p className="text-primary-300 text-xs truncate mt-0.5">
                {currentUser?.username}
              </p>
            </div>
          )}
        </div>

        {/* Collapse / close buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-1.5 text-primary-300 hover:text-white hover:bg-primary-500/50 transition"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="text-base leading-none">{collapsed ? "→" : "←"}</span>
          </button>
          <button
            onClick={onClose}
            className="md:hidden rounded-lg p-1.5 text-primary-300 hover:text-white hover:bg-primary-500/50 transition"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Role badge (expanded only) ── */}
      {!collapsed && currentUser && (
        <div className="px-4 pt-4 pb-1">
          <span className="inline-block text-[10px] font-semibold tracking-widest uppercase text-primary-300 bg-primary-700/40 px-2.5 py-1 rounded-full">
            {currentUser.role === "lead_author" ? "Lead Author" : "Contributor"}
          </span>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`
                w-full flex items-center gap-3
                ${collapsed ? "justify-center" : "justify-start"}
                px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${
                  active
                    ? "bg-white/95 text-primary-700 shadow-sm"
                    : "text-primary-100 hover:bg-primary-500/40 hover:text-white"
                }
              `}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* ── Sign out ── */}
      <div className="px-3 py-4 border-t border-primary-700/50">
        <button
          onClick={onLogout}
          title={collapsed ? "Sign out" : undefined}
          className={`
            w-full flex items-center gap-3
            ${collapsed ? "justify-center" : "justify-start"}
            px-3 py-2.5 rounded-xl text-sm font-medium
            text-primary-300 hover:text-white hover:bg-primary-500/40
            transition-all duration-150
          `}
        >
          <span className="text-base shrink-0">→</span>
          {!collapsed && "Sign out"}
        </button>
      </div>
    </div>
  )
}

export default Sidebar