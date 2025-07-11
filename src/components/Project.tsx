import styles from "@/components/Project.module.css"
import { Resource } from "@/models/resource"
import { Construction } from "./Construction"
import { BoM } from "./BoM"

export const Project = ({
  items,
  onQtyChange
}: {
  items: Resource[]
  onQtyChange: (resource: Resource, action: "add" | "remove") => () => void // TODO: Extract to types, both props and action
}) => {
  const itemsByQty: Map<Resource, number> = items.reduce(
    (acc: Map<Resource, number>, item: Resource): Map<Resource, number> => {
      acc.set(item, (acc.get(item) || 0) + 1)
      return acc
    },
    new Map<Resource, number>()
  )
  // FIXME: Preserve order
  return (
    <>
      {items.length < 1 ? (
        <h3 className={styles.title}>
          Start outpost project by selecting modules to build.
        </h3>
      ) : (
        <div className={styles.container}>
          <h3 className={styles.title}>Modules</h3>
          {Array.from(itemsByQty).map(([resource, qty]) => (
            <Construction
              key={resource.id}
              item={resource}
              count={qty}
              onQtyChange={onQtyChange}
            />
          ))}
          <BoM items={items} />
        </div>
      )}
    </>
  )
}
