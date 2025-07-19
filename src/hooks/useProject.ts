import { Project } from "@/models/project"
import { OrderItem } from "@/models/order"
import { BomItem } from "@/models/bom"
import { ResourceId } from "@/models/resource"
import {
  ProjectAction,
  ProjectActionType,
  projectReducer
} from "@/reducers/projectReducer"
import { useEffect, useReducer, useRef } from "react"
import { v4 as uuid } from "uuid"

const PROJECT_STORAGE_KEY = "project"

export const useProject = (): {
  project: Project
  dispatch: (action: ProjectAction) => void
} => {
  const placeholderProject: Project = {
    id: "",
    name: "",
    order: new Map(),
    deconstructed: new Map(),
    lastChanged: new Date(0)
  }
  const [state, dispatch] = useReducer(projectReducer, placeholderProject)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(PROJECT_STORAGE_KEY)
      let project: Project
      if (raw) {
        try {
          project = deserializeProject(raw)
        } catch {
          project = makeNewProject()
        }
      } else {
        project = makeNewProject()
      }
      dispatch({ type: ProjectActionType.INIT, payload: project })
    }
  }, [])

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (typeof window !== "undefined" && state.id) {
      localStorage.setItem(PROJECT_STORAGE_KEY, serializeProject(state))
    }
  }, [state])

  return { project: state, dispatch }
}

export function serializeProject(project: Project): string {
  return JSON.stringify({
    ...project,
    order: Array.from(project.order.entries()),
    deconstructed: Array.from(project.deconstructed.entries()),
    lastChanged:
      project.lastChanged instanceof Date
        ? project.lastChanged.toISOString()
        : project.lastChanged
  })
}

export function deserializeProject(raw: string): Project {
  const parsed = JSON.parse(raw)
  return {
    ...parsed,
    order: new Map<ResourceId, OrderItem>(parsed.order),
    deconstructed: new Map<ResourceId, BomItem>(parsed.deconstructed),
    lastChanged: parsed.lastChanged ? new Date(parsed.lastChanged) : new Date()
  }
}

export function getInitialProjectState(): Project {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY)
    if (raw) {
      try {
        return deserializeProject(raw)
      } catch {
        console.log("Stored project was corrupted.")
      }
    }
  }

  return {
    id: uuid(),
    name: "Project",
    order: new Map<ResourceId, OrderItem>(),
    deconstructed: new Map<ResourceId, BomItem>(),
    lastChanged: new Date()
  }
}

function makeNewProject(): Project {
  return {
    id: uuid(),
    name: "Project",
    order: new Map<ResourceId, OrderItem>(),
    deconstructed: new Map<ResourceId, BomItem>(),
    lastChanged: new Date()
  }
}
