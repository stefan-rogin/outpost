import { Resource, ResourceId } from "@/models/resource"
import styles from "@/components/BoM.module.css"
import { resources } from "@/lib/resources"

export const BoM = ({ items }: { items: Resource[] }) => {
  const bom: Map<ResourceId, number> = items.reduce(
    (acc: Map<ResourceId, number>, item: Resource) => {
      Object.entries(item.blueprint!).map(([resId, qty]) => {
        acc.set(resId, (acc.get(resId) || 0) + qty)
      }) // Only constructibles in this list
      return acc
    },
    new Map<ResourceId, number>()
  )

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Bill of materials</h3>
      <div className={styles.bom}>
        {Array.from(bom).map(([resId, qty]) => {
          return (
            <div className={styles.bom_item} key={resId}>
              {qty} x {resources[resId]?.name || resId}
            </div>
          )
        })}
      </div>
    </div>
  )
}
