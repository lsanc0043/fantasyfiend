from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.nba import players
from app.api.routes.league import sleeper

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players.router, prefix="/players")
app.include_router(sleeper.router, prefix="/sleeper")


@app.get("/")
def root():
    return {"message": "NBA API Backend Running"}
