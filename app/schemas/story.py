from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class StoryCreate(BaseModel):
    title: str
    description: Optional[str] = None
    genre: Optional[str] = None

class StoryResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    genre: Optional[str]
    is_published: bool
    lead_author_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}