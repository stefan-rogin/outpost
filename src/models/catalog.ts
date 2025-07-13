import { ResourceId, Constructible } from "@/models/resource"

export interface CatalogConfigCategory {
  title: string
  items: ResourceId[][]
}

export interface CatalogGroup {
  inView: Constructible
  options: Constructible[]
}

export interface CatalogCategory {
  title: string
  items: CatalogGroup[]
}

export type Catalog = CatalogCategory[]
