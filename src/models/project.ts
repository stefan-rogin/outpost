import { Order } from "@/models/order"
import { ResourceId } from "./resource"
import { Bill } from "./bom"

export interface Project {
  id: UUID
  name: string
  order: Order
  deconstructed: ResourceId[]
  lastChanged: Date
}

// TODO: Move
export interface ProjectState {
  project: Project
  itemBill: Bill
  deconstructedBill: Bill
}

export type UUID = string
