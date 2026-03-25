from nba_api.stats.static import players
from nba_api.stats.endpoints import playergamelog, playbyplayv3


def get_active_players():
    return players.get_active_players()


def get_player_games(player_id: int):
    gamelog = playergamelog.PlayerGameLog(player_id=player_id)
    return gamelog.get_dict()


def get_play_by_play(player_id: int, game_id: str):
    pbp = playbyplayv3.PlayByPlayV3(
        game_id=game_id, start_period=0, end_period=0, timeout=5000
    )
    filtered_pbp = [
        action
        for action in pbp.get_dict().get("game").get("actions")
        if action["personId"] == player_id
        and (
            action["subType"] == "Technical" or action["subType"].startswith("Flagrant")
        )
    ]
    return filtered_pbp
