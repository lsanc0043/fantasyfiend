import httpx
from nba_api.stats.static import players

BASE_URL = "https://api.sleeper.app/v1"

players_cache = None


async def get_league_info(league_id: str):
    url = f"{BASE_URL}/league/{league_id}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()


async def get_league_users(league_id: str):
    url = f"{BASE_URL}/league/{league_id}/users"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()


async def get_league_rosters(league_id: str):
    url = f"{BASE_URL}/league/{league_id}/rosters"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()


async def get_league_rosters_by_user(league_id: str, user_id: str):
    url = f"{BASE_URL}/league/{league_id}/rosters"
    rosters = []
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()

        rosters = [
            roster for roster in response.json() if roster["owner_id"] == user_id
        ]

        updated_rosters = []

        for roster in rosters:
            updated = roster.copy()

            if roster.get("players"):
                updated["players"] = await get_roster_player_names(
                    roster.get("players") or []
                )

            if roster.get("reserve"):
                updated["reserve"] = await get_roster_player_names(
                    roster.get("reserve") or []
                )

            if roster.get("starters"):
                updated["starters"] = await get_roster_player_names(
                    roster.get("starters") or []
                )

            updated_rosters.append(updated)

        return updated_rosters


async def get_all_nba_players():
    global players_cache
    if players_cache:
        return players_cache

    async with httpx.AsyncClient() as client:
        res = await client.get(f"{BASE_URL}/players/nba")
        res.raise_for_status()
        players_cache = res.json()
        return players_cache


async def get_roster_player_names(player_ids: list[str]):
    all_players = await get_all_nba_players()

    names = []
    for pid in player_ids:
        player = all_players.get(pid)
        if player:
            full_name = (
                f"{player.get('first_name', '')} {player.get('last_name', '')}".strip()
            )
            names.append(full_name)

    return names
