import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import client from "../api/client"

const STATUS_STYLES = {
    draft:        "bg-ink-100 text-ink-600 border-ink-300",
    submitted:    "bg-sky-50 text-sky-700 border-sky-200",
    under_review: "bg-amber-50 text-amber-700 border-amber-200",
    merged:       "bg-green-50 text-green-700 border-green-200",
    rejected:     "bg-red-50 text-red-700 border-red-200",
}

const FILTERS = ["all", "draft", "submitted", "under_review", "merged", "rejected"]

function ContributorDashboard() {
    const [branches, setBranches] = useState([])
    const [loading,  setLoading]  = useState(true)
    const [filter,   setFilter]   = useState("all")
    const navigate = useNavigate()

    useEffect(() => {
        client.get("/review/my-branches")
            .then(res => {
                setBranches(res.data)
                setLoading(false)
            })
            .catch(() => navigate("/stories"))
    }, [])

    const filtered = filter === "all"
        ? branches
        : branches.filter(b => b.branch_status === filter)

    if (loading) return (
        <div className="min-h-screen bg-ink-50 flex items-center justify-center">
            <p className="text-ink-400 text-sm">Loading your branches…</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-ink-50">
            {/* ── Slim top nav ── */}
            <nav className="border-b border-ink-200 bg-white px-6 py-3.5">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="font-heading text-xl font-semibold italic text-ink-900">Kinyurite</h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-ink-500 hover:text-ink-800"
                        onClick={() => navigate("/stories")}
                    >
                        ← Back to stories
                    </Button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">

                {/* ── Page heading ── */}
                <div className="mb-10">
                    <h2 className="font-heading text-3xl font-semibold text-ink-900 mb-2">
                        My branches
                    </h2>
                    <p className="text-ink-400 text-sm">
                        {branches.length} {branches.length === 1 ? "branch" : "branches"} total
                    </p>
                </div>

                {/* ── Filter pills ── */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                                text-xs px-3.5 py-1.5 rounded-full border transition-all
                                ${
                                    filter === f
                                        ? "bg-ink-900 text-white border-ink-900"
                                        : "bg-white text-ink-500 border-ink-200 hover:border-ink-400 hover:text-ink-700"
                                }
                            `}
                        >
                            {f === "all" ? "All" : f.replace(/_/g, " ")}
                        </button>
                    ))}
                </div>

                <Separator className="mb-8" />

                {/* ── Empty state ── */}
                {filtered.length === 0 && (
                    <div className="text-center py-24">
                        <p className="font-heading text-xl text-ink-300">
                            {filter === "all"
                                ? "No branches yet."
                                : `No ${filter.replace(/_/g, " ")} branches.`}
                        </p>
                        {filter === "all" && (
                            <p className="text-ink-300 text-sm mt-2">
                                Find a story and start contributing.
                            </p>
                        )}
                    </div>
                )}

                {/* ── Branch cards ── */}
                <div className="space-y-4">
                    {filtered.map(branch => (
                        <Card
                            key={branch.branch_id}
                            className="bg-white border border-ink-200 shadow-card hover:shadow-card-hover transition-shadow duration-200 rounded-2xl"
                        >
                            <CardContent className="px-6 py-5">
                                {/* Title row */}
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <div className="min-w-0">
                                        <p className="font-heading text-base font-semibold text-ink-900 leading-snug">
                                            {branch.chapter_title}
                                        </p>
                                        <p className="text-xs text-ink-400 mt-1">
                                            {branch.story_title}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${STATUS_STYLES[branch.branch_status]}`}
                                    >
                                        {branch.branch_status.replace(/_/g, " ")}
                                    </span>
                                </div>

                                {/* Preview text */}
                                <p className="text-sm text-ink-500 leading-relaxed mb-4">
                                    {branch.branch_body.length > 150
                                        ? branch.branch_body.slice(0, 150) + "…"
                                        : branch.branch_body}
                                </p>

                                {/* Feedback banner */}
                                {branch.feedback && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
                                        <p className="text-xs text-amber-800">
                                            <span className="font-semibold">Feedback: </span>
                                            {branch.feedback}
                                        </p>
                                    </div>
                                )}

                                {/* Footer row */}
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-xs text-ink-300">
                                        Updated {new Date(branch.branch_updated_at).toLocaleDateString()}
                                    </span>
                                    {branch.branch_status === "draft" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs"
                                            onClick={() => navigate(`/chapters/${branch.chapter_id}/branch`, {
                                                state: {
                                                    chapter: {
                                                        id:    branch.chapter_id,
                                                        title: branch.chapter_title,
                                                        body:  branch.chapter_body,
                                                    },
                                                    storyId: branch.story_id,
                                                }
                                            })}
                                        >
                                            Continue editing →
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default ContributorDashboard