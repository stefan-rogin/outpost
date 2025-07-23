import { Project, UUID } from "@/models/project"
import { isConstructible, Resource, ResourceId } from "@/models/resource"
import { OrderItem } from "@/models/order"
import { v4 as uuid } from "uuid"
import { getResource } from "./resource"
import { Optional, isDefined } from "@/types/common"

export interface DehydratedProject {
  id: UUID
  name: string
  order: Record<ResourceId, number>
  deconstructed: ResourceId[]
  lastChanged: string
  version: string
}

const VERSION = "1.0"
const PROJECT_STORAGE_PATTERN =
  /^o_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

export function getStoredProject(id: string): Optional<Project> {
  try {
    const raw = localStorage.getItem(id)
    if (raw) return hydrateProject(deserializeProject(raw))
  } catch {
    return undefined
  }
}

export function storeProject(project: Project): void {
  localStorage.setItem(
    getStorageKeyForId(project.id),
    serializeProject(project)
  )
}

function hydrateProject(dehydrated: DehydratedProject): Project {
  const order: Map<ResourceId, OrderItem> = Object.entries(
    dehydrated.order
  ).reduce(
    (
      acc: Map<ResourceId, OrderItem>,
      [id, quantity]: [id: ResourceId, quantity: number]
    ) => {
      const constructible: Optional<Resource> = getResource(id)
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
    id: dehydrated.id,
    name: dehydrated.name,
    order,
    deconstructed: dehydrated.deconstructed,
    lastChanged: new Date(dehydrated.lastChanged)
  }
}

export function getLatestProject(): Optional<Project> {
  try {
    const storedProjects = getRecentProjects()
    return storedProjects.length > 0
      ? hydrateProject(storedProjects[0])
      : undefined
  } catch {
    return undefined
  }
}

/**
 * @throws {Error}
 */
function getRecentProjects(): DehydratedProject[] {
  const storageKeys: string[] = listStorage()
    .filter(isDefined)
    .filter(key => PROJECT_STORAGE_PATTERN.test(key))

  const storedProjects: DehydratedProject[] = storageKeys
    .map((key: string): Optional<DehydratedProject> => {
      try {
        return deserializeProject(localStorage.getItem(key)!)
      } catch {
        return undefined
      }
    })
    .filter(isDefined)

  return storedProjects
    .sort(
      (a, b) =>
        new Date(a.lastChanged).getTime() - new Date(b.lastChanged).getTime()
    )
    .reverse()
}

function listStorage(): Optional<string>[] {
  const length = localStorage.length
  const keys: Optional<string>[] = []
  for (let i = 0; i < length; i++) {
    keys.push(localStorage.key(i) ?? undefined)
  }
  return keys
}

function serializeProject(project: Project): string {
  const dehydratedOrder: Record<ResourceId, number> = Object.fromEntries(
    [...project.order.entries()].map(([id, { quantity }]) => [id, quantity])
  )

  const dehydrated: DehydratedProject = {
    ...project,
    order: dehydratedOrder,
    lastChanged: project.lastChanged.toISOString(),
    version: VERSION
  }
  return JSON.stringify(dehydrated)
}

/**
 * @throws {Error}
 */
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
    lastChanged: parsed.lastChanged,
    version: parsed.version
  }
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

export function getNewProject(): Project {
  return {
    ...getEmptyProject(),
    id: uuid(),
    name: "Project",
    lastChanged: new Date()
  }
}

function getStorageKeyForId(id: UUID): string {
  return `o_${id}`
}
