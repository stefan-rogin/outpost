"use client"

import { ProjectState } from "@/models/project"
import {
  ProjectAction,
  ProjectActionType,
  projectReducer
} from "@/reducers/projectReducer"
import { useEffect, useReducer, useState } from "react"
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
  loaded: boolean
} => {
  const [state, dispatch] = useReducer(projectReducer, initialState)
  const [loaded, setLoaded] = useState<boolean>(false)

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
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (loaded && typeof window !== "undefined" && state.project.id) {
      storeProject(state.project)
    }
  }, [loaded, state.project])

  return { state, dispatch, loaded }
}
