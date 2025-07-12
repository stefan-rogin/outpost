export type ResourceId = string

export interface BaseResource {
  id: ResourceId
  name: string
  blueprint?: Record<ResourceId, number>
}

export interface Constructible extends BaseResource {
  blueprint: Record<ResourceId, number>
}

export type Resource = BaseResource | Constructible

export function isConstructible(resource: Resource): resource is Constructible {
  return "blueprint" in resource
}
