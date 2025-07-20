import { Project, UUID } from "@/models/project"
import { isConstructible, Resource, ResourceId } from "@/models/resource"
import { OrderItem } from "@/models/order"
import { v4 as uuid } from "uuid"
import { getResource } from "./resource"

export interface DehydratedProject {
  id: UUID
  name: string
  order: Record<ResourceId, number>
  deconstructed: ResourceId[]
  lastChanged: string
}

const PROJECT_STORAGE_KEY = "project"

export function getStoredProject(): Project {
  const raw = localStorage.getItem(PROJECT_STORAGE_KEY)
  let project: Project | undefined = undefined
  if (raw) {
    try {
      project = hydrateProject(deserializeProject(raw))
    } catch {
      // TODO: Enable back after defining test/dev/prod envs
      // console.log("Invalid project in storage.")
    }
  }
  return project ?? getNewProject()
}
export function storeProject(project: Project): void {
  localStorage.setItem(PROJECT_STORAGE_KEY, serializeProject(project))
}

export function getEmptyProject(): Project {
  return {
    id: "",
    name: "",
    order: new Map(),
    deconstructed: [],
    lastChanged: new Date(0)
  }
}

function getNewProject(): Project {
  return {
    ...getEmptyProject(),
    id: uuid(),
    name: "Project"
  }
}

function hydrateProject(dehydrated: DehydratedProject): Project {
  const order: Map<ResourceId, OrderItem> = Object.entries(
    dehydrated.order
  ).reduce(
    (
      acc: Map<ResourceId, OrderItem>,
      [id, quantity]: [id: ResourceId, quantity: number]
    ) => {
      const constructible: Resource | undefined = getResource(id)
      if (constructible !== undefined && isConstructible(constructible)) {
        const item: OrderItem = {
          item: constructible,
          quantity
        }
        return acc.set(id, item)
      }
      return acc
    },
    new Map()
  )
  return {
    ...dehydrated,
    order,
    lastChanged: new Date(dehydrated.lastChanged)
  }
}

function serializeProject(project: Project): string {
  const dehydratedOrder: Record<ResourceId, number> = Object.fromEntries(
    [...project.order.entries()].map(([id, { quantity }]) => [id, quantity])
  )

  const dehydrated: DehydratedProject = {
    ...project,
    order: dehydratedOrder,
    lastChanged: project.lastChanged.toISOString()
  }
  return JSON.stringify(dehydrated)
}

// This function throws parse exceptions to be caught elsewhere
function deserializeProject(raw: string): DehydratedProject {
  const parsed = JSON.parse(raw)
  if (
    typeof parsed !== "object" ||
    typeof parsed.id !== "string" ||
    typeof parsed.name !== "string" ||
    typeof parsed.order !== "object" ||
    parsed.order === null ||
    !Array.isArray(parsed.deconstructed) ||
    typeof parsed.lastChanged !== "string"
  ) {
    throw new Error("Invalid serialization.")
  }
  const parsedOrder = Object.fromEntries(
    Object.entries(parsed.order)
  ) as Record<ResourceId, number>

  const parsedDeconstructed: ResourceId[] = parsed.deconstructed.filter(
    (id: ResourceId): id is ResourceId => typeof id === "string"
  )
  return {
    id: parsed.id,
    name: parsed.name,
    order: parsedOrder,
    deconstructed: parsedDeconstructed,
    lastChanged: parsed.lastChanged
  }
}
