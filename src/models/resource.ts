export type ResourceId = string

export type Blueprint = Record<ResourceId, number>

export interface BaseResource {
  id: ResourceId
  name: string
}

export interface Constructible extends BaseResource {
  blueprint: Blueprint
}

export type Resource = BaseResource | Constructible

export function isConstructible(resource: Resource): resource is Constructible {
  return "blueprint" in resource
}
