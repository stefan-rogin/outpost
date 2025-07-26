"use client"

import { Optional, isDefined } from "@/types/common"
import { ProjectState, Project } from "@/models/project"
import {
  ProjectAction,
  ProjectActionType,
  projectReducer
} from "@/reducers/projectReducer"
import { useEffect, useReducer, useMemo, useState } from "react"
import {
  getEmptyProject,
  storeProject,
  getLatestProject,
  getStoredProject,
  deleteProject as deleteProjectFromStorage,
  getLegacyProject,
  getProjectForSerialization,
  getNewProject
} from "@/service/project"

export const useProject = (): {
  state: ProjectState
  dispatch: (action: ProjectAction) => void
  deleteProject: () => void
  recentVersion: number
} => {
  const latestProject: Optional<Project> = useMemo(() => getLatestProject(), [])
  const legacyProject: Optional<Project> = getLegacyProject()
  const hasLegacyOrder: boolean = useMemo(
    () => !!legacyProject,
    [legacyProject]
  )

  const initialState: ProjectState = {
    project: getEmptyProject(),
    itemBill: new Map(),
    deconstructedBill: new Map(),
    isLoading: true,
    isError: false,
    isEmptyWorkspace: !isDefined(latestProject) && !hasLegacyOrder
  }
  const [state, dispatch] = useReducer(projectReducer, initialState)
  const [recentVersion, setRecentVersion] = useState<number>(0)

  const init = () => {
    // Load latest or new
    if (typeof window === "undefined") return

    dispatch({ type: ProjectActionType.INIT })
    // Legacy
    if (isDefined(legacyProject)) {
      dispatch({
        type: ProjectActionType.LOAD_OK,
        payload: legacyProject
      })
      localStorage.removeItem("order")
      return
    }
    // URL Id?
    const url = new window.URL(window.location.href)
    const id: Optional<string> = url.searchParams.get("id") ?? undefined
    const serialization: Optional<string> =
      url.searchParams.get("serialized") ?? undefined

    try {
      const fromSerialization: Optional<Project> = serialization
        ? getProjectForSerialization(atob(serialization))
        : undefined
      const fromId: Optional<Project> = id ? getStoredProject(id) : undefined
      if (
        (serialization && !isDefined(fromSerialization)) ||
        (id && !isDefined(fromId))
      ) {
        dispatch({ type: ProjectActionType.LOAD_ERR })
        return
      }
      const project: Project =
        fromSerialization ?? fromId ?? latestProject ?? getNewProject()
      dispatch({ type: ProjectActionType.LOAD_OK, payload: project })
      if (url.search) {
        history.pushState({}, "", "/")
      }
    } catch {
      dispatch({ type: ProjectActionType.LOAD_ERR })
    }
  }
  useEffect(() => init(), [latestProject, legacyProject])

  useEffect(() => {
    if (!state.isLoading && typeof window !== "undefined" && state.project.id) {
      storeProject(state.project)
      setRecentVersion(v => v + 1)
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

  return { state, dispatch, deleteProject, recentVersion }
}
