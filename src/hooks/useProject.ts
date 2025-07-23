"use client"

import { Optional, isDefined } from "@/types/common"
import { ProjectState, Project } from "@/models/project"
import {
  ProjectAction,
  ProjectActionType,
  projectReducer
} from "@/reducers/projectReducer"
import { useEffect, useReducer } from "react"
import {
  getEmptyProject,
  storeProject,
  getLatestProject
} from "@/service/project"

const initialState: ProjectState = {
  project: getEmptyProject(),
  itemBill: new Map(),
  deconstructedBill: new Map(),
  isLoading: true,
  isError: false
}

export const useProject = (): {
  state: ProjectState
  dispatch: (action: ProjectAction) => void
} => {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  useEffect(() => {
    // Load latest or new
    if (typeof window !== "undefined") {
      dispatch({ type: ProjectActionType.INIT })
      try {
        const project: Optional<Project> = getLatestProject()
        if (isDefined(project)) {
          dispatch({ type: ProjectActionType.LOAD_OK, payload: project })
        } else {
          dispatch({ type: ProjectActionType.CREATE })
        }
      } catch {
        dispatch({ type: ProjectActionType.LOAD_ERR })
      }
    }
  }, [])

  useEffect(() => {
    if (!state.isLoading && typeof window !== "undefined" && state.project.id) {
      storeProject(state.project)
    }
  }, [state.isLoading, state.project])

  return { state, dispatch }
}
