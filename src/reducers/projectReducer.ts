import { QtyChange } from "@/models/order"
import { ProjectState } from "@/models/project"
import { isConstructible, Resource, ResourceId } from "@/models/resource"
import { getAggregatedDeconstructed, getAggregatedItems } from "@/service/bom"
import { changeOrderQty } from "@/service/order"
import { getResource } from "@/service/resource"

export enum ProjectActionType {
  INIT = "INIT",
  CHANGE_ITEM_QTY = "CHANGE_ITEM_QTY",
  RENAME = "RENAME",
  TOGGLE_DECONSTRUCT = "TOGGLE_DECONSTRUCT",
  CLEAR = "CLEAR"
}

export type ProjectAction =
  | { type: ProjectActionType.INIT; payload: ProjectState }
  | { type: ProjectActionType.RENAME; payload: string }
  | {
      type: ProjectActionType.CHANGE_ITEM_QTY
      payload: { id: ResourceId; qtyChange: QtyChange }
    }
  | {
      type: ProjectActionType.TOGGLE_DECONSTRUCT
      payload: ResourceId
    }
  | { type: ProjectActionType.CLEAR }

export const projectReducer = (
  state: ProjectState,
  action: ProjectAction
): ProjectState => {
  switch (action.type) {
    case ProjectActionType.INIT:
      return action.payload
    case ProjectActionType.CLEAR:
      return {
        ...state,
        project: {
          ...state.project,
          order: new Map(),
          deconstructed: [],
          lastChanged: new Date()
        },
        itemBill: new Map(),
        deconstructedBill: new Map()
      }
    case ProjectActionType.RENAME:
      const newName = action.payload.trim()
      if (!newName) return state

      return {
        ...state,
        project: {
          ...state.project,
          name: newName
        }
      }
    case ProjectActionType.CHANGE_ITEM_QTY:
      const icOrder = changeOrderQty(
        action.payload.id,
        action.payload.qtyChange,
        state.project.order
      )
      const itemBill = getAggregatedItems(icOrder, state.project.deconstructed)
      const deconstructedBill = getAggregatedDeconstructed(
        icOrder,
        state.project.deconstructed
      )
      const newDeconstructed: ResourceId[] = state.project.deconstructed.filter(
        id => deconstructedBill.has(id)
      )
      return {
        ...state,
        project: {
          ...state.project,
          order: icOrder,
          deconstructed: newDeconstructed,
          lastChanged: new Date()
        },
        itemBill,
        deconstructedBill
      }

    case ProjectActionType.TOGGLE_DECONSTRUCT:
      const resource: Resource | undefined = getResource(action.payload)
      if (!resource || !isConstructible(resource)) return state

      const index = state.project.deconstructed.indexOf(action.payload)
      const deconstructed =
        index < 0
          ? [...state.project.deconstructed, action.payload]
          : state.project.deconstructed.toSpliced(index, 1)

      return {
        ...state,
        project: {
          ...state.project,
          deconstructed,
          lastChanged: new Date()
        },
        itemBill: getAggregatedItems(state.project.order, deconstructed),
        deconstructedBill: getAggregatedDeconstructed(
          state.project.order,
          deconstructed
        )
      }
    default:
      throw new Error("State change not implemented.")
  }
}
