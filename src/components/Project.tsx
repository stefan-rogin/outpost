import styles from "@/components/Project.module.css"
import { Resource } from "@/models/resource"
import { Construction } from "./Construction"

export const Project = ({
  items,
  onQtyChange
}: {
  items: Resource[]
  onQtyChange: (resource: Resource, action: "add" | "remove") => () => void // TODO: Extract to types, both props and action
}) => {
  const itemsByQty: Map<Resource, number> = items.reduce(
    (agg: Map<Resource, number>, item: Resource): Map<Resource, number> => {
      agg.set(item, (agg.get(item) || 0) + 1)
      return agg
    },
    new Map<Resource, number>()
  )
  return (
    <>
      <h3>Outpost project</h3>
      <div>
        {Array.from(itemsByQty).map(([resource, qty]) => (
          <Construction
            key={resource.id}
            item={resource}
            count={qty}
            onQtyChange={onQtyChange}
          />
        ))}
      </div>
    </>
  )
}
