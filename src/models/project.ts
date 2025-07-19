import { Order } from "@/models/order"
import { Bill } from "@/models/bom"

export interface Project {
  id: UUID
  name: string
  order: Order
  deconstructed: Bill
  lastChanged: Date
}

export type UUID = string
