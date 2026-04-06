from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.branch import ChapterBranch, BranchStatus, is_valid_transition
from app.models.chapter import Chapter
from app.schemas.branch import BranchCreate, BranchStatusUpdate, BranchResponse
from typing import List
import uuid

router = APIRouter(prefix="/chapters/{chapter_id}/branches", tags=["Branches"])

@router.post("/", response_model=BranchResponse, status_code=201)
def create_branch(chapter_id: uuid.UUID, branch: BranchCreate, contributor_id: uuid.UUID, db: Session = Depends(get_db)):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    new_branch = ChapterBranch(
        id=uuid.uuid4(),
        body=branch.body,
        status=BranchStatus.DRAFT,
        chapter_id=chapter_id,
        contributor_id=contributor_id
    )
    db.add(new_branch)
    db.commit()
    db.refresh(new_branch)
    return new_branch

@router.get("/", response_model=List[BranchResponse])
def get_branches(chapter_id: uuid.UUID, db: Session = Depends(get_db)):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return chapter.branches

@router.patch("/{branch_id}/status", response_model=BranchResponse)
def update_branch_status(chapter_id: uuid.UUID, branch_id: uuid.UUID, update: BranchStatusUpdate, db: Session = Depends(get_db)):
    branch = db.query(ChapterBranch).filter(
        ChapterBranch.id == branch_id,
        ChapterBranch.chapter_id == chapter_id
    ).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    if not is_valid_transition(branch.status, update.status):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid transition from {branch.status.value} to {update.status.value}"
        )

    branch.status = update.status
    if update.feedback:
        branch.feedback = update.feedback

    db.commit()
    db.refresh(branch)
    return branch