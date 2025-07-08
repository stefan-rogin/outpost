import { ResourceId } from "./resource"

export interface CatalogGroup {
  title: string
  options: ResourceId[]
}

export interface CatalogCategory {
  title: string
  items: CatalogGroup[]
}
