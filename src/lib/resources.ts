import { Resource, ResourceId } from "@/models/resource"
import data from "@/resources/resources.json"

export const resources: Record<ResourceId, Resource> = Object.fromEntries(
  Object.entries(data)
)
export function getResource(id: ResourceId): Resource {
  const res = resources[id]
  if (!res) throw new Error(`Missing resource: ${id}`)
  return res
}

export function tryGetResource(id: ResourceId): Resource | undefined {
  return resources[id]
}
