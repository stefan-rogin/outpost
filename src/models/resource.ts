export type ResourceId = string

export interface Resource {
  id: ResourceId
  name: string
  blueprint?: Record<ResourceId, number>
}
