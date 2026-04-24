import { useState } from "react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import client from "../api/client"

function ChapterEditor() {
    const { storyId, chapterId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { chapter } = location.state || {}

    const [title, setTitle] = useState(chapter?.title || "")
    const [body, setBody] = useState(chapter?.body || "")
    const [order, setOrder] = useState(chapter?.order || 1)
    const [saving, setSaving] = useState(false)

    if (!chapter) {
        navigate(`/stories/${storyId}`)
        return null
    }

    async function handleSave(e) {
        e.preventDefault()
        setSaving(true)
        try {
            await client.patch(`/stories/${storyId}/chapters/${chapterId}`, {
                title,
                body,
                order
            })
            navigate(`/stories/${storyId}`)
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to save chapter")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-ink-50">
            <nav className="border-b border-ink-200 bg-white px-6 py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="font-heading text-2xl font-semibold text-ink-900">Kinyurite</h1>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/stories/${storyId}`)}>
                        ← Back to story
                    </Button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <h2 className="font-heading text-3xl text-ink-900 mb-8">Edit chapter</h2>
                <Card className="border-ink-200">
                    <CardHeader>
                        <CardTitle className="font-heading text-lg">Chapter {order}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Title</Label>
                                <Input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Body</Label>
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    className="w-full min-h-[300px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-ring font-body leading-relaxed"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Order</Label>
                                <Input
                                    type="number"
                                    value={order}
                                    onChange={e => setOrder(parseInt(e.target.value))}
                                    className="w-20"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" disabled={saving}>
                                    {saving ? "Saving..." : "Save changes"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(`/stories/${storyId}`)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default ChapterEditor
