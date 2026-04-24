import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models.branch import BranchStatus
from app.models.chapter import Chapter
from app.models.story import Story

TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def register_user(email: str, username: str, password: str, role: str) -> dict:
    response = client.post(
        "/auth/register",
        json={"email": email, "username": username, "password": password, "role": role},
    )
    assert response.status_code == 201
    return response.json()


def login_user(email: str, password: str) -> str:
    response = client.post(
        "/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def create_story_and_chapter(lead_author_id: uuid.UUID):
    db = TestingSessionLocal()
    story = Story(
        id=uuid.uuid4(),
        title="Test Story",
        description="A story for branches",
        genre="fantasy",
        lead_author_id=lead_author_id,
    )
    chapter = Chapter(
        id=uuid.uuid4(),
        title="Chapter 1",
        body="Chapter body",
        order=1,
        story_id=story.id,
    )
    db.add_all([story, chapter])
    db.commit()
    db.refresh(chapter)
    db.close()
    return story, chapter


def create_branch(chapter_id: uuid.UUID, token: str, body: str = "First draft") -> dict:
    response = client.post(
        f"/chapters/{chapter_id}/branches/",
        json={"body": body},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    return response.json()


def test_create_branch_as_contributor():
    contributor = register_user("contrib@example.com", "contrib", "password123", "contributor")
    token = login_user("contrib@example.com", "password123")

    lead_author = register_user("lead@example.com", "leadauthor", "password123", "lead_author")
    _, chapter = create_story_and_chapter(uuid.UUID(lead_author["id"]))

    branch = create_branch(chapter.id, token)

    assert branch["body"] == "First draft"
    assert branch["status"] == BranchStatus.DRAFT.value
    assert branch["chapter_id"] == str(chapter.id)
    assert branch["contributor_id"] == contributor["id"]


def test_create_branch_denies_lead_author():
    register_user("contrib2@example.com", "contrib2", "password123", "contributor")
    lead_author = register_user("lead2@example.com", "leadauthor2", "password123", "lead_author")
    token = login_user("lead2@example.com", "password123")

    _, chapter = create_story_and_chapter(uuid.UUID(lead_author["id"]))

    response = client.post(
        f"/chapters/{chapter.id}/branches/",
        json={"body": "Can I create this?"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Only contributors can perform this action"


def test_submit_branch_requires_owner():
    register_user("owner@example.com", "owner", "password123", "contributor")
    register_user("other@example.com", "other", "password123", "contributor")
    token_b = login_user("other@example.com", "password123")

    lead_author = register_user("lead3@example.com", "leadauthor3", "password123", "lead_author")
    _, chapter = create_story_and_chapter(uuid.UUID(lead_author["id"]))

    contributor_a_token = login_user("owner@example.com", "password123")
    branch = create_branch(chapter.id, contributor_a_token, body="Owner branch")

    response = client.patch(
        f"/chapters/{chapter.id}/branches/{branch['id']}/status",
        json={"status": BranchStatus.SUBMITTED.value},
        headers={"Authorization": f"Bearer {token_b}"},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "You can only submit your own branch"


def test_lead_author_can_move_submitted_branch_to_under_review():
    register_user("contrib3@example.com", "contrib3", "password123", "contributor")
    contributor_token = login_user("contrib3@example.com", "password123")

    lead_author = register_user("lead4@example.com", "leadauthor4", "password123", "lead_author")
    lead_token = login_user("lead4@example.com", "password123")

    _, chapter = create_story_and_chapter(uuid.UUID(lead_author["id"]))
    branch = create_branch(chapter.id, contributor_token, body="Ready for review")

    submit_response = client.patch(
        f"/chapters/{chapter.id}/branches/{branch['id']}/status",
        json={"status": BranchStatus.SUBMITTED.value},
        headers={"Authorization": f"Bearer {contributor_token}"},
    )
    assert submit_response.status_code == 200
    assert submit_response.json()["status"] == BranchStatus.SUBMITTED.value

    review_response = client.patch(
        f"/chapters/{chapter.id}/branches/{branch['id']}/status",
        json={"status": BranchStatus.UNDER_REVIEW.value, "feedback": "Looks good"},
        headers={"Authorization": f"Bearer {lead_token}"},
    )
    assert review_response.status_code == 200
    assert review_response.json()["status"] == BranchStatus.UNDER_REVIEW.value
    assert review_response.json()["feedback"] == "Looks good"


def test_get_pending_branches_returns_submitted_and_under_review():
    register_user("contrib4@example.com", "contrib4", "password123", "contributor")
    contributor_token = login_user("contrib4@example.com", "password123")

    lead_author = register_user("lead5@example.com", "leadauthor5", "password123", "lead_author")
    lead_token = login_user("lead5@example.com", "password123")

    _, chapter = create_story_and_chapter(uuid.UUID(lead_author["id"]))
    draft_branch = create_branch(chapter.id, contributor_token, body="Draft text")

    submitted_branch = client.patch(
        f"/chapters/{chapter.id}/branches/{draft_branch['id']}/status",
        json={"status": BranchStatus.SUBMITTED.value},
        headers={"Authorization": f"Bearer {contributor_token}"},
    )
    assert submitted_branch.status_code == 200

    another_branch = create_branch(chapter.id, contributor_token, body="Second draft")
    client.patch(
        f"/chapters/{chapter.id}/branches/{another_branch['id']}/status",
        json={"status": BranchStatus.SUBMITTED.value},
        headers={"Authorization": f"Bearer {contributor_token}"},
    )
    client.patch(
        f"/chapters/{chapter.id}/branches/{another_branch['id']}/status",
        json={"status": BranchStatus.UNDER_REVIEW.value},
        headers={"Authorization": f"Bearer {lead_token}"},
    )

    pending_response = client.get(
        f"/chapters/{chapter.id}/branches/review/pending",
        headers={"Authorization": f"Bearer {lead_token}"},
    )

    assert pending_response.status_code == 200
    pending = pending_response.json()
    statuses = {item["branch_status"] for item in pending}
    assert BranchStatus.SUBMITTED.value in statuses
    assert BranchStatus.UNDER_REVIEW.value in statuses
    assert all(item["chapter_id"] == str(chapter.id) for item in pending)
