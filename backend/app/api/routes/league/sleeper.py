from fastapi import APIRouter
from app.services.sleeper_service import (
    get_league_info,
    get_league_users,
    get_league_rosters,
    get_league_rosters_by_user,
)

router = APIRouter()


@router.get("/league/{league_id}")
async def league_info(league_id: str):
    return await get_league_info(league_id=league_id)


@router.get("/league/{league_id}/users")
async def league_users(league_id: str):
    return await get_league_users(league_id=league_id)


@router.get("/league/{league_id}/rosters")
async def league_rosters(league_id: str):
    return await get_league_rosters(league_id=league_id)


@router.get("/league/{league_id}/rosters/{user_id}")
async def league_rosters_by_user(league_id: str, user_id: str):
    return await get_league_rosters_by_user(league_id=league_id, user_id=user_id)
