import { Resource, ResourceId } from "@/models/resource"

const blueprint = (inputs: [ResourceId, number][]): Map<ResourceId, number> =>
  new Map(inputs.map(([id, qty]) => [id, qty]))

export const resources = new Map<ResourceId, Resource>([])
