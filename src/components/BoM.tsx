import { isConstructible, ResourceId } from "@/models/resource"
import styles from "@/components/BoM.module.css"
import { tryGetResource } from "@/lib/resources"

export const BoM = ({ items }: { items: Map<ResourceId, number> }) => {
  const bom: Map<ResourceId, number> = aggregateBlueprints(items)

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Materials</h3>
      <div className={styles.bom}>
        {[...bom].map(([id, qty]) => {
          return (
            <div className={styles.bom_item} key={id}>
              {qty} x {tryGetResource(id)?.name ?? id}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function aggregateBlueprints(
  constructibles: Map<ResourceId, number>
): Map<ResourceId, number> {
  return [...constructibles].reduce(
    (acc: Map<ResourceId, number>, [id, qty]) => {
      const resource = tryGetResource(id)
      if (!resource || !isConstructible(resource)) return acc
      Object.entries(resource.blueprint).map(([bpId, bpQty]) => {
        acc.set(bpId, (acc.get(bpId) || 0) + qty * bpQty)
      })
      return acc
    },
    new Map<ResourceId, number>()
  )
}
