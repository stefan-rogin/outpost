import { Order } from "@/models/order"
import { ResourceId } from "./resource"

export interface Project {
  id: UUID
  name: string
  order: Order
  deconstructed: ResourceId[]
  lastChanged: Date
}

export type UUID = string
