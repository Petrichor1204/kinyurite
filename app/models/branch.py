import uuid
import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class BranchStatus(enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    MERGED = "merged"
    REJECTED = "rejected"

VALID_TRANSITIONS = {
    BranchStatus.DRAFT: [BranchStatus.SUBMITTED],
    BranchStatus.SUBMITTED: [BranchStatus.UNDER_REVIEW],
    BranchStatus.UNDER_REVIEW: [BranchStatus.MERGED, BranchStatus.REJECTED],
    BranchStatus.MERGED: [],
    BranchStatus.REJECTED: [],
}

def is_valid_transition(current: BranchStatus, next: BranchStatus) -> bool:
    return next in VALID_TRANSITIONS[current]

class ChapterBranch(Base):
    __tablename__ = "chapter_branches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    body = Column(Text, nullable=False)
    status = Column(Enum(BranchStatus, values_callable=lambda x: [e.value for e in x]), nullable=False, default=BranchStatus.DRAFT)
    feedback = Column(Text, nullable=True)
    chapter_id = Column(UUID(as_uuid=True), ForeignKey("chapters.id"), nullable=False)
    contributor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    chapter = relationship("Chapter", back_populates="branches")
    contributor = relationship("User", backref="branches")