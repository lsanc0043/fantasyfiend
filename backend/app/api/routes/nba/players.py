from fastapi import APIRouter
from app.services.nba_service import (
    get_player_games,
    get_active_players,
    get_play_by_play,
)

router = APIRouter()


@router.get("/")
def list_players():
    players = get_active_players()
    return players


@router.get("/{player_id}")
def player_games(player_id: int):
    return get_player_games(player_id)


@router.get("/{player_id}/{game_id}")
def play_by_play(player_id: int, game_id: str):
    return get_play_by_play(player_id, game_id)
