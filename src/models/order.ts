import { Constructible, isConstructible, ResourceId } from "./resource"

export interface OrderItem {
  item: Constructible
  quantity: number
}

export type Order = Map<ResourceId, OrderItem>

function isOrderItem(obj: any): obj is OrderItem {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.quantity === "number" &&
    isConstructible(obj.item)
  )
}
