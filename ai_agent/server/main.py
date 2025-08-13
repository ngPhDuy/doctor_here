from fastapi import FastAPI
from pydantic import BaseModel
from agent_core.agent_controller import handle_user_message

app = FastAPI()

class UserInput(BaseModel):
    message: str
    role: str  

@app.post("/chat")
async def chat(user_input: UserInput):
    reply = handle_user_message(user_input.message, user_input.role)
    return {"response": reply}

