import styles from "@/components/Construction.module.css"
import { Resource } from "@/models/resource"

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
        <div>{count}</div>
        <div className="arrow" onClick={onQtyChange(item, "add")}></div>
        <div>{item.name}</div>
      </div>
    </div>
  )
}
