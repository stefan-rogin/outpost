import { ResourceId, Resource, isConstructible } from "@/models/resource"
import { getResource } from "@/lib/resources"
import { Order, QtyChange } from "@/models/order"

export function changeOrderQty(
  id: ResourceId,
  action: QtyChange,
  order: Order
): Order {
  const newOrder = new Map(order)
  const item = newOrder.get(id)
  if (action === "add") {
    if (item) {
      newOrder.set(id, { ...item, quantity: item.quantity + 1 })
    } else {
      const constructible: Resource | undefined = getResource(id)
      if (constructible && isConstructible(constructible))
        newOrder.set(id, { item: constructible, quantity: 1 })
    }
  } else if (item) {
    if (item.quantity <= 1) {
      newOrder.delete(id)
    } else {
      newOrder.set(id, { ...item, quantity: item.quantity - 1 })
    }
  }
  return newOrder
}
