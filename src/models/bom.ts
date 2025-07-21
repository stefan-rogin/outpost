import { Resource, ResourceId } from "@/models/resource"

export interface BomItem {
  item: Resource
  quantity: number
}

export type Bill = Map<ResourceId, BomItem>

export type Scarcity = "Common" | "Uncommon" | "Rare" | "Exotic" | "Unique"
export type Tier = "Tier01" | "Tier02" | "Tier03"
