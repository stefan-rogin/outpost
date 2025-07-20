"use client"

import { Project } from "@/models/project"
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

export const useProject = (): {
  project: Project
  dispatch: (action: ProjectAction) => void
} => {
  const isMounted = useRef(false)
  const [project, dispatch] = useReducer(projectReducer, getEmptyProject())

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProject = getStoredProject()
      dispatch({ type: ProjectActionType.INIT, payload: storedProject })
    }
  }, [])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    if (typeof window !== "undefined" && project.id) {
      storeProject(project)
    }
  }, [project])

  return { project: project, dispatch }
}
