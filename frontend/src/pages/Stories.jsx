import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import client from "../api/client"

function Stories() {
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        client.get("/stories/")
            .then(res => {
                setStories(res.data)
                setLoading(false)
            })
            .catch(() => {
                localStorage.removeItem("token")
                navigate("/login")
            })
    }, [])

    function handleLogout() {
        localStorage.removeItem("token")
        navigate("/login")
    }

    if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>InkFlow</h1>
                <button onClick={handleLogout}>Sign out</button>
            </div>
            <h2 style={{ fontWeight: 400, marginBottom: "1.5rem" }}>Stories</h2>
            {stories.length === 0 && <p>No stories yet.</p>}
            {stories.map(story => (
                <div key={story.id} style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: "1rem 1.25rem",
                    marginBottom: "1rem",
                    cursor: "pointer"
                }}>
                    <h3 style={{ margin: 0, marginBottom: 4 }}>{story.title}</h3>
                    <p style={{ margin: 0, color: "#888", fontSize: 14 }}>{story.genre}</p>
                    {story.description && (
                        <p style={{ margin: 0, marginTop: 8, fontSize: 14 }}>{story.description}</p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Stories