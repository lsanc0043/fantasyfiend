import { useEffect, useState } from 'react'

type User = {
  user_id: string
  display_name: string
}

const leagueId = '1280302405275119616'

export default function LeagueInfo() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [rosters, setRosters] = useState<any[]>([])

  const loadUsers = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sleeper/league/${leagueId}/users`,
    )
    const data = await res.json()
    setUsers(data)
  }

  const loadUserRosters = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sleeper/league/${leagueId}/rosters/${id}`,
    )
    const data = await res.json()
    setSelectedUser(data)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>NBA Players</h1>

      <ul>
        {users.map((p) => (
          <li key={p.user_id} style={{ gap: 20, display: 'flex' }}>
            {p.display_name}
            <button onClick={() => loadUserRosters(p.user_id)}>
              View Rosters
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(selectedUser, null, 2)}
        </pre>
      )}
    </div>
  )
}
