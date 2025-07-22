import { Constructible, isConstructible, ResourceId } from "./resource"

export interface OrderItem {
  item: Constructible
  quantity: number
}

export type Order = Map<ResourceId, OrderItem>

export function isOrderItem(obj: unknown): obj is OrderItem {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as OrderItem).quantity === "number" &&
    isConstructible((obj as OrderItem).item)
  )
}

export type QtyChange = "add" | "remove"
