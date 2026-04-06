import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    order = Column(Integer, nullable=False)
    story_id = Column(UUID(as_uuid=True), ForeignKey("stories.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    story = relationship("Story", back_populates="chapters")
    branches = relationship("ChapterBranch", back_populates="chapter", cascade="all, delete-orphan")