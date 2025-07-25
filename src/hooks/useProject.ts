"use client"

import { Optional, isDefined } from "@/types/common"
import { ProjectState, Project } from "@/models/project"
import {
  ProjectAction,
  ProjectActionType,
  projectReducer
} from "@/reducers/projectReducer"
import { useEffect, useReducer, useMemo } from "react"
import {
  getEmptyProject,
  storeProject,
  getLatestProject,
  getStoredProject,
  deleteProject as deleteProjectFromStorage,
  getLegacyOrder,
  convertLegacyOrderToV1_0
} from "@/service/project"

export const useProject = (): {
  state: ProjectState
  dispatch: (action: ProjectAction) => void
  deleteProject: () => void
} => {
  const latestProject: Optional<Project> = useMemo(() => getLatestProject(), [])

  const initialState: ProjectState = {
    project: getEmptyProject(),
    itemBill: new Map(),
    deconstructedBill: new Map(),
    isLoading: true,
    isError: false,
    isEmptyWorkspace: !isDefined(latestProject)
  }
  const [state, dispatch] = useReducer(projectReducer, initialState)

  useEffect(() => {
    // Load latest or new
    if (typeof window !== "undefined") {
      dispatch({ type: ProjectActionType.INIT })
      // Legacy
      try {
        const legacyOrder: Optional<string> = getLegacyOrder()
        if (isDefined(legacyOrder)) {
          const legacyProject: Optional<Project> =
            convertLegacyOrderToV1_0(legacyOrder)
          if (isDefined(legacyProject)) {
            dispatch({
              type: ProjectActionType.LOAD_OK,
              payload: legacyProject
            })
          }
        }
      } finally {
        localStorage.removeItem("order")
      }
      // URL Id?
      const url = new window.URL(window.location.href)
      const id: Optional<string> = url.searchParams.get("id") ?? undefined
      try {
        const project: Optional<Project> = id
          ? getStoredProject(id)
          : latestProject
        if (isDefined(project)) {
          dispatch({ type: ProjectActionType.LOAD_OK, payload: project })
        } else {
          if (id) {
            dispatch({ type: ProjectActionType.LOAD_ERR })
          } else {
            dispatch({ type: ProjectActionType.CREATE })
          }
        }
      } catch {
        dispatch({ type: ProjectActionType.LOAD_ERR })
      }
    }
  }, [latestProject])

  useEffect(() => {
    if (!state.isLoading && typeof window !== "undefined" && state.project.id) {
      storeProject(state.project)
    }
  }, [state.isLoading, state.project])

  const deleteProject = (): void => {
    deleteProjectFromStorage(state.project.id)
    const nextProject: Optional<Project> = getLatestProject()
    if (nextProject) {
      dispatch({ type: ProjectActionType.LOAD_OK, payload: nextProject })
    } else {
      dispatch({ type: ProjectActionType.CREATE })
    }
  }

  return { state, dispatch, deleteProject }
}
