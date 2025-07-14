import { ResourceId, Resource, isConstructible } from "@/models/resource"
import { Order } from "@/models/order"
import styles from "@/components/BoM.module.css"
import { getResource } from "@/lib/resources"
import { useState, useMemo } from "react"

export interface BomItem {
  item: Resource
  quantity: number
}

export type Bill = Map<ResourceId, BomItem>

export const BoM = ({ order }: { order: Order }) => {
  const [deconstructed, setDeconstructed] = useState<Bill>(new Map())
  const bom = useMemo(
    () => aggregateBlueprints(order, deconstructed),
    [order, deconstructed]
  )

  const isDeconstructed = (id: ResourceId) => deconstructed.has(id)

  const toggleDeconstructed = (bomItem: BomItem) => (): void => {
    if (!isConstructible(bomItem.item)) return
    const id = bomItem.item.id
    const newDeconstructed = new Map<ResourceId, BomItem>(deconstructed)
    if (deconstructed.has(id)) newDeconstructed.delete(id)
    else newDeconstructed.set(id, bomItem)
    console.log(newDeconstructed)
    setDeconstructed(newDeconstructed)
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Materials</h3>
      <div className={styles.bom}>
        {[...deconstructed.values(), ...bom.values()]
          .sort(compareFn)
          .map(bomItem => {
            const className = `${styles.bom_item} ${
              isConstructible(bomItem.item) ? styles.bom_constructible : ""
            } ${
              isDeconstructed(bomItem.item.id) ? styles.bom_deconstructed : ""
            }`
            return (
              <div
                className={className}
                key={bomItem.item.id}
                onClick={toggleDeconstructed(bomItem)}
              >
                {bomItem.quantity} x {bomItem.item.name ?? bomItem.item.id}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export function compareFn(a: BomItem, b: BomItem) {
  // TODO: Introduce tiers/scarcity
  if (isConstructible(a.item) && !isConstructible(b.item)) return -1
  else if (!isConstructible(b.item) && !isConstructible(a.item)) return 1
  else return 0
}

export function aggregateBlueprints(order: Order, deconstructed: Bill): Bill {
  const result = new Map<ResourceId, BomItem>()
  for (const orderItem of order.values()) {
    const itemBom = getBomForInput(
      new Map(),
      orderItem.item.id,
      orderItem.quantity,
      deconstructed,
      true
    )
    for (const bomResource of itemBom.values()) {
      mergeResource(result, bomResource)
    }
  }
  return result
}

export function mergeResource(prev: Bill, newResource: BomItem) {
  const id = newResource.item.id
  const existing = prev.get(id)
  prev.set(id, {
    item: newResource.item,
    quantity: (existing?.quantity || 0) + newResource.quantity
  })
}

export function getBomForInput(
  prev: Bill,
  id: ResourceId,
  qty: number,
  deconstructed: Bill,
  isOrderItem = false
): Bill {
  const result = new Map(prev)
  const resource = getResource(id)

  if (resource == undefined) return result

  if (
    !isConstructible(resource) ||
    (!deconstructed.has(resource.id) && !isOrderItem)
  ) {
    mergeResource(result, {
      item: resource,
      quantity: qty
    })
    return result
  }

  for (const [blueprintId, blueprintQty] of Object.entries(
    resource.blueprint
  )) {
    const partial = getBomForInput(
      new Map(),
      blueprintId,
      blueprintQty * qty,
      deconstructed
    )
    for (const resourceFromBlueprint of partial.values()) {
      mergeResource(result, resourceFromBlueprint)
    }
  }

  return result
}
