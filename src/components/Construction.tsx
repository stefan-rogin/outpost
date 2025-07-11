import styles from "@/components/Construction.module.css"
import { ResourceId } from "@/models/resource"
import { Arrow } from "@/components/Arrow"
import Image from "next/image"
import { resources, tryGetResource } from "@/lib/resources"
import { QtyChange } from "@/models/types"

export const Construction = ({
  id,
  count,
  onQtyChange
}: {
  id: ResourceId
  count: number
  onQtyChange: (id: ResourceId, action: QtyChange) => () => void
}) => {
  const resource = tryGetResource(id)
  if (!resource) return null
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Arrow onClick={onQtyChange(id, "remove")} />
        <div className={styles.counter}>{count}</div>
        <Arrow onClick={onQtyChange(id, "add")} />
        <Image
          src={`/icons/${resource.id}.jpg`}
          alt={resource.name}
          width={50}
          height={50}
          className={styles.icon}
        />
        <div>{resource.name}</div>
      </div>
      <div className={styles.bom}>
        {Object.entries(resource.blueprint!).map(
          ([id, qty]: [id: ResourceId, qty: number]) => (
            <div className={styles.res_chip} key={id}>
              {qty * count} x {resources[id]?.name || id}
            </div>
          )
        )}
      </div>
    </div>
  )
}
