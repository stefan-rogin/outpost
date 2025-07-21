import { QtyChange } from "@/models/order"
import { Project } from "@/models/project"
import { ResourceId } from "@/models/resource"
import { changeOrderQty } from "@/service/order"

export enum ProjectActionType {
  INIT = "INIT",
  CHANGE_ITEM_QTY = "CHANGE_ITEM_QTY",
  RENAME = "RENAME",
  CHANGE_DECONSTRUCT = "CHANGE_DECONSTRUCT"
}

export type ProjectAction =
  | { type: ProjectActionType.INIT; payload: Project }
  | { type: ProjectActionType.RENAME; payload: string }
  | {
      type: ProjectActionType.CHANGE_ITEM_QTY
      payload: { id: ResourceId; qtyChange: QtyChange }
    }
  | {
      type: ProjectActionType.CHANGE_DECONSTRUCT
      payload: { deconstructed: ResourceId[] }
    }

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
    case ProjectActionType.CHANGE_DECONSTRUCT:
      return {
        ...project,
        deconstructed: action.payload.deconstructed,
        lastChanged: new Date()
      }
    default:
      throw new Error("State change not implemented.")
  }
}
