import { useDraggable } from '@dnd-kit/react'

export function Draggable({ children }: { children: React.ReactNode }) {
  const { ref } = useDraggable({
    id: 'draggable',
  })

  return (
    <div ref={ref} style={{ border: 'white' }}>
      {children}
    </div>
  )
}
