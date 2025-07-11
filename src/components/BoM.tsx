import { Resource, ResourceId } from "@/models/resource"
import styles from "@/components/BoM.module.css"
import { tryGetResource } from "@/lib/resources"
// import { useEffect, useState } from "react"

interface ShadowResource extends Resource {
  deconstructed: boolean
}

// function mapItemsToShadow(items: Resource[], shadow?:ShadowResource[]) {
//   // All resources of the same Id are either deconstructed or not

//   return items.map(item => {
//     const itemShadow = shadow?.find(shadowItem => shadowItem.id === item)
//   })
// }

export const BoM = ({ items }: { items: Map<ResourceId, number> }) => {
  // const [shadow, setShadow] = useState<Map<ShadowResource, number>>(items)
  // useEffect(() => {
  //   setShadow(items)
  // }, [items])

  const bom: Map<ResourceId, number> = [...items].reduce(
    (acc: Map<ResourceId, number>, [id, qty]) => {
      const resource = tryGetResource(id)
      if (!resource?.blueprint) return acc

      Object.entries(resource.blueprint).map(([bpId, bpQty]) => {
        acc.set(bpId, (acc.get(bpId) || 0) + qty * bpQty)
      })
      return acc
    },
    new Map<ResourceId, number>()
  )

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
