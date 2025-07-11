import styles from "@/components/Construction.module.css"
import { Resource } from "@/models/resource"
import Image from "next/image"
import { resources } from "@/lib/resources"

export const Construction = ({
  item,
  count,
  onQtyChange
}: {
  item: Resource
  count: number
  onQtyChange: (resource: Resource, action: "add" | "remove") => () => void
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="arrow" onClick={onQtyChange(item, "remove")}></div>
        <div className={styles.counter}>{count}</div>
        <div className="arrow" onClick={onQtyChange(item, "add")}></div>
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
        {Object.entries(item.blueprint!).map(([resId, qty]) => (
          <div className={styles.res_chip} key={resId}>
            {qty * count} x {resources[resId]?.name || resId}
          </div>
        ))}
      </div>
    </div>
  )
}
