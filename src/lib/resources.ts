import { Resource, ResourceId } from "@/models/resource"
import data from "@/resources/resources.json"

export const resources: Record<ResourceId, Resource> = Object.fromEntries(
  Object.entries(data)
)
