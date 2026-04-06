from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class ChapterCreate(BaseModel):
    title: str
    body: str
    order: int

class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    order: Optional[int] = None

class ChapterResponse(BaseModel):
    id: UUID
    title: str
    body: str
    order: int
    story_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}