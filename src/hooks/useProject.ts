"use client"

import { ProjectState } from "@/models/project"
import {
  ProjectAction,
  ProjectActionType,
  projectReducer
} from "@/reducers/projectReducer"
import { useEffect, useReducer, useRef } from "react"
import {
  getEmptyProject,
  getStoredProject,
  storeProject
} from "@/service/project"
import { Bill } from "@/models/bom"
import { getAggregatedDeconstructed, getAggregatedItems } from "@/service/bom"

const initialState: ProjectState = {
  project: getEmptyProject(),
  itemBill: new Map(),
  deconstructedBill: new Map()
}

export const useProject = (): {
  state: ProjectState
  dispatch: (action: ProjectAction) => void
} => {
  const isMounted = useRef(false)
  const [state, dispatch] = useReducer(projectReducer, initialState)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const project = getStoredProject()
      const itemBill: Bill = getAggregatedItems(
        project.order,
        project.deconstructed
      )
      const deconstructedBill: Bill = getAggregatedDeconstructed(
        project.order,
        project.deconstructed
      )
      dispatch({
        type: ProjectActionType.INIT,
        payload: { project, itemBill, deconstructedBill }
      })
    }
  }, [])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    if (typeof window !== "undefined" && state.project.id) {
      storeProject(state.project)
    }
  }, [state])

  return { state, dispatch }
}
