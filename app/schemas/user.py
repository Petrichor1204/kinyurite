from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: Optional[str] = "contributor"

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    username: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}