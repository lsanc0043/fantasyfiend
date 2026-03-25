import React from 'react'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'

export function Column({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
}) {
  const { isDropTarget, ref } = useDroppable({
    id,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low,
  })
  const style = isDropTarget ? { background: '#41db2230' } : undefined

  return (
    <div className="tier" ref={ref} style={{ ...style }}>
      {children}
    </div>
  )
}
