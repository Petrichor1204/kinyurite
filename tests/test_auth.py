import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

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

def test_register_creates_user():
    res = client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123",
        "role": "contributor"
    })
    assert res.status_code == 201
    assert res.json()["email"] == "test@example.com"
    assert res.json()["username"] == "testuser"
    assert "hashed_password" not in res.json()

def test_register_duplicate_email_fails():
    client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123",
        "role": "contributor"
    })
    res = client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser2",
        "password": "password123",
        "role": "contributor"
    })
    assert res.status_code == 400
    assert res.json()["detail"] == "Email already registered"

def test_login_returns_token():
    client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123",
        "role": "contributor"
    })
    res = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
    assert res.json()["token_type"] == "bearer"

def test_login_wrong_password_fails():
    client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123",
        "role": "contributor"
    })
    res = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 401
    assert res.json()["detail"] == "Invalid email or password"

def test_login_wrong_email_fails():
    res = client.post("/auth/login", json={
        "email": "nobody@example.com",
        "password": "password123"
    })
    assert res.status_code == 401

def test_get_me_requires_auth():
    res = client.get("/auth/me")
    assert res.status_code == 403

def test_get_me_returns_current_user():
    client.post("/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123",
        "role": "contributor"
    })
    login = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    token = login.json()["access_token"]
    res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "test@example.com"
    assert res.json()["role"] == "contributor"