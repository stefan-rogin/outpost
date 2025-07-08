export type ResourceId = string

export interface Resource {
  id: ResourceId
  name: string
  blueprint?: Map<ResourceId, number>
}
