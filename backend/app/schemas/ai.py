from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ChatMessage(CamelModel):
    role: Literal["user", "assistant", "system"]
    content: str = Field(..., min_length=1, max_length=4000)


class ChatRequest(CamelModel):
    message: str = Field(..., min_length=1, max_length=4000)
    history: list[ChatMessage] | None = None
    context: dict | None = None


class ChatResponse(CamelModel):
    reply: str
