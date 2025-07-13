import { Resource, ResourceId } from "@/models/resource"
import data from "@/lib/resources/resources.json"

export const resources: Record<ResourceId, Resource> = Object.fromEntries(
  Object.entries(data)
)

export function getResource(id: ResourceId): Resource | undefined {
  return resources[id]
}
