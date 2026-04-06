from fastapi import FastAPI
from app.database import engine, Base
from app.models import user, story, chapter, branch

Base.metadata.create_all(bind=engine)

app = FastAPI(title="InkFlow API")

@app.get("/")
def root():
    return {"message": "Welcome to InkFlow"}