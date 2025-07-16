import styles from "@/components/Project.module.css"
import { ResourceId, QtyChange } from "@/models/resource"
import { OrderItemView } from "./OrderItemView"
import { BoM } from "./BoM"
import { Power } from "./Power"
import { Order } from "@/models/order"

export const Project = ({
  order,
  onQtyChange
}: {
  order: Order
  onQtyChange: (id: ResourceId, action: QtyChange) => () => void
}) => {
  return (
    <>
      {[...order].length < 1 ? (
        <h3 className={styles.title}>
          Start outpost project by selecting modules to build.
        </h3>
      ) : (
        <div className={styles.container}>
          <h3 className={styles.title}>Modules</h3>
          <Power order={order} />
          {[...order].map(([id, item]) => (
            <OrderItemView
              key={id}
              orderItem={item}
              onQtyChange={onQtyChange}
            />
          ))}
          <BoM order={order} />
        </div>
      )}
    </>
  )
}
