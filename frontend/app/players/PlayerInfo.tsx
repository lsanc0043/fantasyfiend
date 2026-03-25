import { useEffect, useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { Column } from '../components/Column'
import { Item } from '../components/Item'
import Modal from '../components/Modal'

type Player = {
  id: number
  first_name: string
  last_name: string
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div>
      {player.first_name.substring(0, 1)}. {player.last_name}
      <img
        src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`}
        alt="NBA Logo"
        style={{ width: 100 }}
      />
    </div>
  )
}

export default function PlayerInfo() {
  const [players, setPlayers] = useState<Player[]>([])
  const [tiers, setTiers] = useState({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    UNASSIGNED: [],
  })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data)
        setTiers((tiers) => ({
          ...tiers,
          UNASSIGNED: data
            .sort((a: Player, b: Player) =>
              a.last_name.localeCompare(b.last_name),
            )
            .map((p: Player) => `${p.first_name} ${p.last_name}`),
        }))
      })
  }, [])

  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)

  const loadPlayerGames = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/${id}`)
    const data = await res.json()
    setSelectedPlayer(data)
  }

  const [open, setOpen] = useState(false)

  const [fouls, setFouls] = useState<any[]>([])

  const loadPlayerFouls = async (gameId: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/players/${selectedPlayer?.parameters.PlayerID}/${gameId}`,
    )
    const data = await res.json()
    data.length > 0 &&
      setFouls((prev) => [
        ...prev,
        { gameId: gameId, fouls: data.map((foul: any) => foul.subType) },
      ])
  }

  const selectedPlayerStats = selectedPlayer?.resultSets[0].rowSet.map(
    (row: any[]) =>
      Object.fromEntries(
        selectedPlayer.resultSets[0].headers.map(
          (header: string, i: number) => [header, row[i]],
        ),
      ),
  )

  const fantasyScoring = {
    PTS: 1,
    REB: 1,
    AST: 2,
    BLK: 4,
    STL: 4,
    bonus_pt_40p: 2,
    bonus_pt_50p: 2,
    DD: 2,
    FF: -2,
    FGA: 0,
    FGM: 0,
    FTM: 0,
    FTMI: 0,
    TD: 4,
    TF: -2,
    TOV: -2,
    FG3M: 1,
  }

  return (
    <div style={{ display: 'grid', padding: 20, gap: 20 }}>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h2>
          {`${
            players.find((p) => p.id === selectedPlayer?.parameters.PlayerID)
              ?.first_name
          }
          ${
            players.find((p) => p.id === selectedPlayer?.parameters.PlayerID)
              ?.last_name
          }`}
        </h2>
        {selectedPlayerStats?.map((stat: any) => {
          // loadPlayerFouls(stat.Game_ID)
          return (
            <p key={stat.Game_ID}>
              {`fantasyPoints: ${Object.entries(fantasyScoring).reduce(
                (acc, [key, value]) => acc + (stat[key] || 0) * value,
                0,
              )}`}
            </p>
          )
        })}
        <button onClick={() => setOpen(false)}>Close</button>
        <pre style={{ marginTop: 20 }}>{JSON.stringify(fouls, null, 2)}</pre>
      </Modal>

      <DragDropProvider
        onDragOver={(event) => {
          setTiers((items) => move(items, event))
        }}
      >
        {Object.entries(tiers).map(([column, items]) => (
          <Column key={column} id={column}>
            <h1 className="tier-header">{column}</h1>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
                gap: 20,
              }}
            >
              {items.map((player, index) => {
                const p = players.find(
                  (p) => `${p.first_name} ${p.last_name}` === player,
                ) as Player
                return (
                  <Item
                    key={player}
                    id={player}
                    index={index}
                    column={column}
                    onClick={() => {
                      loadPlayerGames(p.id)
                      setOpen(true)
                    }}
                  >
                    <PlayerCard player={p} />
                  </Item>
                )
              })}
            </div>
          </Column>
        ))}
      </DragDropProvider>
    </div>
  )
}
