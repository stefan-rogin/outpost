import { Order } from "@/models/order"
import { Bill } from "@/models/bom"

export interface Project {
  name: string
  order: Order
  deconstructed: Bill
}

export interface ProjectState {
  project: Project
  isLoading: boolean
  isError: boolean
}
