import { Tier, Scarcity, Bill, BomItem } from "@/models/bom"
import { Order, OrderItem } from "@/models/order"
import {
  Constructible,
  BaseResource,
  isConstructible,
  ResourceId
} from "@/models/resource"
import { getResource } from "@/service/resource"

export function getTier(constructible: Constructible): Tier | undefined {
  const tierMatch = constructible.id.match(/^(?:Mfg_)(Tier01|Tier02|Tier03)/)
  if (!tierMatch) return undefined
  return tierMatch[1] as Tier
}

export function getScarcity(baseResource: BaseResource): Scarcity | undefined {
  const scarcityMatch = baseResource.id.match(
    /^(?:Inorg|Org)(Common|Uncommon|Rare|Exotic|Unique)/
  )
  if (!scarcityMatch) return undefined
  return scarcityMatch[1] as Scarcity
}

export function getCsvFromProject(bill: Bill, order: Order): string {
  const bomExport: string = bill
    .values()
    .reduce(
      (acc: string, billItem: BomItem): string =>
        acc + `${billItem.quantity},${billItem.item.name}\n`,
      ""
    )
  const orderExport = order
    .values()
    .reduce(
      (acc: string, orderItem: OrderItem) =>
        acc + `${orderItem.quantity}, ${orderItem.item.name}\n`,
      ""
    )
  return `${orderExport}\n${bomExport}`
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
