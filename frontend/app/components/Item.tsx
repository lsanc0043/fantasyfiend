import { useSortable } from '@dnd-kit/react/sortable'

export function Item({
  id,
  index,
  column,
  children,
  onClick,
}: {
  id: string
  index: number
  column: string
  children: React.ReactNode
  onClick: () => void
}) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
  })

  return (
    <div
      className="item"
      ref={ref}
      data-dragging={isDragging}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
