import { ResourceId } from "@/models/resource"
import { Order } from "@/models/order"
import styles from "@/components/BoM.module.css"
import { getResource } from "@/lib/resources"

export const BoM = ({ order }: { order: Order }) => {
  const bom: Map<ResourceId, number> = aggregateBlueprints(order)

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Materials</h3>
      <div className={styles.bom}>
        {[...bom].map(([id, qty]) => {
          return (
            <div className={styles.bom_item} key={id}>
              {qty} x {getResource(id)?.name ?? id}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function aggregateBlueprints(order: Order): Map<ResourceId, number> {
  const result = new Map<ResourceId, number>()

  for (const orderItem of order.values()) {
    for (const [bpId, bpQty] of Object.entries(orderItem.item.blueprint)) {
      result.set(bpId, (result.get(bpId) || 0) + orderItem.quantity * bpQty)
    }
  }

  return result
}
