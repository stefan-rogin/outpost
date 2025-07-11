import styles from "@/components/Project.module.css"
import { ResourceId } from "@/models/resource"
import { Construction } from "./Construction"
import { BoM } from "./BoM"
import { QtyChange } from "@/models/types"

export const Project = ({
  items,
  onQtyChange
}: {
  items: Map<ResourceId, number>
  onQtyChange: (id: ResourceId, action: QtyChange) => () => void // TODO: Extract to types, both props and action
}) => {
  return (
    <>
      {[...items].length < 1 ? (
        <h3 className={styles.title}>
          Start outpost project by selecting modules to build.
        </h3>
      ) : (
        <div className={styles.container}>
          <h3 className={styles.title}>Modules</h3>
          {[...items].map(([id, qty]: [id: ResourceId, qty: number]) => (
            <Construction
              key={id}
              id={id}
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
