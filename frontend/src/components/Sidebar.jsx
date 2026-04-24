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

function Sidebar({ currentUser, onLogout }) {
    const navigate = useNavigate()
    const location = useLocation()
    const nav = currentUser?.role === "lead_author" ? NAV_LEAD_AUTHOR : NAV_CONTRIBUTOR

    return (
        <div className="fixed left-0 top-0 h-full w-56 bg-primary-600 flex flex-col z-10">
            <div className="px-5 py-6 border-b border-primary-700">
                <h1 className="font-heading text-white text-xl font-semibold italic">Kinyurite</h1>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {currentUser && (
                    <div className="px-5 py-4">
                        <div className="w-10 h-10 rounded-2xl bg-accent-400 flex items-center justify-center mb-2">
                            <span className="text-primary-900 font-bold text-sm">
                                {currentUser.username.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                        <p className="text-white text-sm font-medium">{currentUser.username}</p>
                        <p className="text-primary-200 text-xs mt-0.5">
                            {currentUser.role === "lead_author" ? "Lead Author" : "Contributor"}
                        </p>
                    </div>
                )}

                <nav className="px-3 py-4 space-y-1">
                    {nav.map(item => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                                location.pathname === item.path
                                    ? "bg-white text-primary-600"
                                    : "text-primary-100 hover:bg-primary-700"
                            }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="px-3 py-4 border-t border-primary-700">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-primary-200 hover:bg-primary-700 transition-all"
                >
                    <span>→</span> Sign out
                </button>
            </div>
        </div>
    )
}

export default Sidebar