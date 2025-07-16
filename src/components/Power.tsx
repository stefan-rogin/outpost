import powerData from "@/lib/resources/power_map.json"
import styles from "@/components/Power.module.css"
import { Order, OrderItem } from "@/models/order"
import { ResourceId } from "@/models/resource"
import Image from "next/image"

export const Power = ({ order }: { order: Order }) => {
  const powerMap: Map<ResourceId, number> = new Map<ResourceId, number>(
    powerData as [ResourceId, number][]
  )
  const powerRequired = order
    .values()
    .reduce((acc: number, orderItem: OrderItem) => {
      const power = powerMap.get(orderItem.item.id) ?? 0
      return power < 0 ? acc + orderItem.quantity * -power : acc
    }, 0)
  const powerProduced = order
    .values()
    .reduce((acc: number, orderItem: OrderItem) => {
      const power = powerMap.get(orderItem.item.id) ?? 0
      return power > 0 ? acc + orderItem.quantity * power : acc
    }, 0)
  return (
    <div className={styles.container}>
      <div className={styles.power_row}>
        <div>
          <span>Power: </span>
          <span className={`${styles.power_value} ${styles.negative}`}>
            {powerRequired}
          </span>
          <span> / </span>
          <span className={`${styles.power_value} ${styles.positive}`}>
            {powerProduced}
          </span>
        </div>
        <div className={styles.help}>
          <Image
            priority={true}
            src="/question-mark-outline.svg"
            alt="Note that Solar and Wind power output are dependednt on planetary conditions."
            width={16}
            height={16}
          />
          <div className={styles.help_text}>
            Note that Solar and Wind power output are dependednt on planetary
            conditions. Actual values onsite may be lower or higher than shown
            here.
          </div>
        </div>
      </div>
    </div>
  )
}
