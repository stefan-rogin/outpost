import styles from "./OrderItemView.module.css"
import { ResourceId } from "@/models/resource"
import { QtyChange } from "@/models/order"
import { Arrow } from "@/components/common/Arrow"
import Image from "next/image"
import { getResource } from "@/service/resource"
import { OrderItem } from "@/models/order"

export const OrderItemView = ({
  orderItem,
  onQtyChange
}: {
  orderItem: OrderItem
  onQtyChange: (id: ResourceId, action: QtyChange) => () => void
}) => {
  const item = orderItem.item
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Arrow
          onClick={onQtyChange(item.id, "remove")}
          aria-label="Decrease quantity"
        />
        <div className={styles.counter}>{orderItem.quantity}</div>
        <Arrow
          onClick={onQtyChange(item.id, "add")}
          aria-label="Increase quantity"
        />
        <Image
          src={`/icons/${item.id}.jpg`}
          alt={item.name}
          width={50}
          height={50}
          className={styles.icon}
        />
        <div>{item.name}</div>
      </div>
      <div className={styles.bom}>
        {Object.entries(item.blueprint).map(
          ([id, qty]: [id: ResourceId, qty: number]) => (
            <div className={styles.res_chip} key={id}>
              {qty * orderItem.quantity} x {getResource(id)?.name || id}
            </div>
          )
        )}
      </div>
    </div>
  )
}
