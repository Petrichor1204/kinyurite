from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.chapter import Chapter
from app.models.story import Story
from app.schemas.chapter import ChapterCreate, ChapterUpdate, ChapterResponse
from typing import List
import uuid

router = APIRouter(prefix="/stories/{story_id}/chapters", tags=["Chapters"])

@router.post("/", response_model=ChapterResponse, status_code=201)
def create_chapter(story_id: uuid.UUID, chapter: ChapterCreate, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    new_chapter = Chapter(
        id=uuid.uuid4(),
        title=chapter.title,
        body=chapter.body,
        order=chapter.order,
        story_id=story_id
    )
    db.add(new_chapter)
    db.commit()
    db.refresh(new_chapter)
    return new_chapter

@router.get("/", response_model=List[ChapterResponse])
def get_chapters(story_id: uuid.UUID, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story.chapters

@router.get("/{chapter_id}", response_model=ChapterResponse)
def get_chapter(story_id: uuid.UUID, chapter_id: uuid.UUID, db: Session = Depends(get_db)):
    chapter = db.query(Chapter).filter(
        Chapter.id == chapter_id,
        Chapter.story_id == story_id
    ).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return chapter

@router.patch("/{chapter_id}", response_model=ChapterResponse)
def update_chapter(story_id: uuid.UUID, chapter_id: uuid.UUID, updates: ChapterUpdate, db: Session = Depends(get_db)):
    chapter = db.query(Chapter).filter(
        Chapter.id == chapter_id,
        Chapter.story_id == story_id
    ).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(chapter, field, value)

    db.commit()
    db.refresh(chapter)
    return chapter