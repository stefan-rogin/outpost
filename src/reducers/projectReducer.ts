import { BomItem } from "@/models/bom"
import { OrderItem } from "@/models/order"
import { Project } from "@/models/project"
import { QtyChange } from "@/models/resource"

export enum ProjectActionType {
  CHANGE_ITEM_QTY = "CHANGE_ITEM_QTY",
  RENAME = "RENAME",
  LOAD_INIT = "LOAD_INIT",
  LOAD_OK = "LOAD_OK",
  LOAD_ERR = "LOAD_ERR",
  TOGGLE_DECONSTRUCT = "TOGGLE_DECONSTRUCT"
}

export type ProjectAction =
  | { type: ProjectActionType.LOAD_INIT }
  | { type: ProjectActionType.LOAD_OK; payload: Project }
  | { type: ProjectActionType.LOAD_ERR }
  | { type: ProjectActionType.LOAD_ERR; payload: string }
  | {
      type: ProjectActionType.CHANGE_ITEM_QTY
      payload: { item: OrderItem; qtyChange: QtyChange }
    }
  | { type: ProjectActionType.TOGGLE_DECONSTRUCT; payload: { item: BomItem } }
