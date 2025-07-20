import { BomItem } from "@/models/bom"
import { QtyChange } from "@/models/order"
import { Project } from "@/models/project"
import { ResourceId } from "@/models/resource"
import { changeOrderQty } from "@/service/order"

export enum ProjectActionType {
  INIT = "INIT",
  CHANGE_ITEM_QTY = "CHANGE_ITEM_QTY",
  RENAME = "RENAME",
  TOGGLE_DECONSTRUCT = "TOGGLE_DECONSTRUCT"
}

export type ProjectAction =
  | { type: ProjectActionType.INIT; payload: Project }
  | { type: ProjectActionType.RENAME; payload: string }
  | {
      type: ProjectActionType.CHANGE_ITEM_QTY
      payload: { id: ResourceId; qtyChange: QtyChange }
    }
  | { type: ProjectActionType.TOGGLE_DECONSTRUCT; payload: { item: BomItem } }

export const projectReducer = (
  project: Project,
  action: ProjectAction
): Project => {
  switch (action.type) {
    case ProjectActionType.INIT:
      return action.payload
    case ProjectActionType.RENAME:
      // TODO: Implement rename
      return project
    case ProjectActionType.CHANGE_ITEM_QTY:
      const [id, qtyChange, order] = [
        action.payload.id,
        action.payload.qtyChange,
        project.order
      ]
      return {
        ...project,
        order: changeOrderQty(id, qtyChange, order),
        lastChanged: new Date()
      }
    case ProjectActionType.TOGGLE_DECONSTRUCT:
      // TODO: Implement deconstruct
      return project
    default:
      throw new Error("State change not implemented.")
  }
}
