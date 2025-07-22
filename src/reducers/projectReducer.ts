import { QtyChange } from "@/models/order"
import { ProjectState } from "@/models/project"
import { ResourceId } from "@/models/resource"
import { getAggregatedDeconstructed, getAggregatedItems } from "@/service/bom"
import { changeOrderQty } from "@/service/order"

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
      payload: { id: ResourceId }
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
      return {
        ...state,
        project: {
          ...state.project,
          name: action.payload
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
      const index = state.project.deconstructed.indexOf(action.payload.id)
      const deconstructed =
        index < 0
          ? [...state.project.deconstructed, action.payload.id]
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
