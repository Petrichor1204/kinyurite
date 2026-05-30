import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

const FEATURES = [
    {
        icon: "🌿",
        title: "Branch, don't block",
        desc: "Contributors fork any chapter and write their own version. No more waiting your turn or stepping on each other's prose.",
    },
    {
        icon: "🔀",
        title: "Compare & merge",
        desc: "Lead authors review branches side by side with a clean diff, then merge the version that fits the story best.",
    },
    {
        icon: "📖",
        title: "Stories that grow",
        desc: "Every story is a living tree of chapters and ideas — collaborative, versioned, and always moving forward.",
    },
]

function Landing() {
    const navigate = useNavigate()
    const hasToken = !!localStorage.getItem("token")

    return (
        <div className="min-h-screen bg-ink-50 flex flex-col">
            {/* ── Top bar ── */}
            <header className="flex items-center justify-between px-6 py-5 md:px-10">
                <h1 className="font-heading text-2xl font-semibold italic text-ink-900">Kinyurite</h1>
                <div className="flex items-center gap-2">
                    {hasToken ? (
                        <Button onClick={() => navigate("/stories")}>Go to app</Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => navigate("/login")}>
                                Log in
                            </Button>
                            <Button onClick={() => navigate("/register")}>Sign up</Button>
                        </>
                    )}
                </div>
            </header>

            {/* ── Hero ── */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="max-w-2xl">
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary-600 bg-primary-100 px-3 py-1 rounded-full mb-6">
                        Collaborative storytelling
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-semibold text-ink-900 leading-tight mb-5">
                        Where stories are built in branches, not isolation.
                    </h2>
                    <p className="text-ink-500 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                        Kinyurite lets writers fork, branch, and merge chapters like code. Start a story,
                        invite contributors, and weave the best ideas together — one branch at a time.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {!hasToken && (
                            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/register")}>
                                Get started — it's free
                            </Button>
                        )}
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => navigate("/stories")}
                        >
                            {hasToken ? "Browse stories" : "Continue as guest →"}
                        </Button>
                    </div>
                    {!hasToken && (
                        <p className="text-ink-400 text-xs mt-4">
                            Browse every story as a guest. Log in anytime to start writing.
                        </p>
                    )}
                </div>
            </main>

            {/* ── Features ── */}
            <section className="px-6 py-16 md:py-20">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {FEATURES.map(f => (
                        <div
                            key={f.title}
                            className="bg-white rounded-2xl border border-ink-200 p-6 shadow-card"
                        >
                            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-xl mb-4">
                                {f.icon}
                            </div>
                            <h3 className="font-heading text-lg text-ink-900 mb-2">{f.title}</h3>
                            <p className="text-ink-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="px-6 py-8 text-center border-t border-ink-200">
                <p className="text-ink-400 text-sm">
                    Ready to write together?{" "}
                    {hasToken ? (
                        <button
                            onClick={() => navigate("/stories")}
                            className="text-primary-600 font-medium underline underline-offset-4 hover:text-primary-700"
                        >
                            Open the app
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/register")}
                            className="text-primary-600 font-medium underline underline-offset-4 hover:text-primary-700"
                        >
                            Create an account
                        </button>
                    )}
                </p>
            </footer>
        </div>
    )
}

export default Landing
