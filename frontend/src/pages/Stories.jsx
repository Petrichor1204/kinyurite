import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Sidebar from "../components/Sidebar"
import client from "../api/client"

function Stories() {
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newStory, setNewStory] = useState({ title: "", description: "", genre: "" })
    const navigate = useNavigate()

    useEffect(() => {
        client.get("/auth/me")
            .then(res => setCurrentUser(res.data))
            .catch(() => {
                localStorage.removeItem("token")
                navigate("/login")
            })

        client.get("/stories/")
            .then(res => {
                setStories(res.data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    function handleLogout() {
        localStorage.removeItem("token")
        navigate("/login")
    }

    async function handleCreateStory(e) {
        e.preventDefault()
        try {
            const res = await client.post("/stories/", newStory)
            setStories([...stories, res.data])
            setShowCreateForm(false)
            setNewStory({ title: "", description: "", genre: "" })
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to create story")
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-ink-50 flex items-center justify-center">
            <p className="text-ink-400 text-sm">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-ink-50 flex">
            <Sidebar currentUser={currentUser} onLogout={handleLogout} />

            <main className="ml-56 flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="font-heading text-3xl text-ink-900">
                                Welcome back, {currentUser?.username} 👋
                            </h2>
                            <p className="text-ink-400 text-sm mt-1">
                                {stories.length} {stories.length === 1 ? "story" : "stories"} available
                            </p>
                        </div>
                        {currentUser?.role === "lead_author" && (
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold px-6 py-3 rounded-2xl text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
                            >
                                {showCreateForm ? "Cancel" : "+ New story"}
                            </button>
                        )}
                    </header>

                    {showCreateForm && (
                        <div className="bg-white rounded-2xl border border-ink-200 p-6 mb-8 shadow-card">
                            <h3 className="font-heading text-lg text-ink-900 mb-4">New story</h3>
                            <form onSubmit={handleCreateStory} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Title</Label>
                                    <Input
                                        value={newStory.title}
                                        onChange={e => setNewStory({ ...newStory, title: e.target.value })}
                                        placeholder="The name of your story"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Genre</Label>
                                        <Input
                                            value={newStory.genre}
                                            onChange={e => setNewStory({ ...newStory, genre: e.target.value })}
                                            placeholder="Sci-fi, Fantasy..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Description</Label>
                                    <textarea
                                        value={newStory.description}
                                        onChange={e => setNewStory({ ...newStory, description: e.target.value })}
                                        placeholder="A short description..."
                                        className="w-full min-h-[80px] px-4 py-3 rounded-2xl border border-ink-300 bg-ink-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-2xl text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
                                >
                                    Create story
                                </button>
                            </form>
                        </div>
                    )}

                    {stories.length === 0 && (
                        <div className="text-center py-20">
                            <p className="font-heading text-xl text-ink-400">No stories yet.</p>
                            <p className="text-ink-300 text-sm mt-2">Be the first to start one.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                        {stories.map(story => (
                            <div
                                key={story.id}
                                onClick={() => navigate(`/stories/${story.id}`)}
                                className="bg-white rounded-2xl border border-ink-200 p-5 cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-200 w-full max-w-sm min-h-[200px] flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                                        <span className="text-primary-600 text-lg">📖</span>
                                    </div>
                                    {story.genre && (
                                        <span className="text-xs bg-accent-100 text-accent-600 px-2.5 py-1 rounded-full font-medium">
                                            {story.genre}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-heading text-lg text-ink-900 mb-2">{story.title}</h3>
                                <div className="flex-1">
                                    {story.description && (
                                        <p className="text-ink-400 text-sm leading-relaxed line-clamp-3">
                                            {story.description}
                                        </p>
                                    )}
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs text-ink-300">
                                        {new Date(story.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-primary-600 text-sm font-medium">
                                        Read more →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Stories