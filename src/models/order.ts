import { Constructible, ResourceId } from "./resource"

export interface OrderItem {
  item: Constructible
  quantity: number
}

export type Order = Map<ResourceId, OrderItem>
