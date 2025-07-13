import { catalogConfig } from "@/lib/catalog"
import { useState, useMemo } from "react"
import styles from "@/components/CatalogView.module.css"
import { getNavIndex, NavDirection } from "@/lib/navigation"
import { CatalogPage } from "@/components/CatalogPage"
import {
  Constructible,
  isConstructible,
  Resource,
  ResourceId
} from "@/models/resource"
import { Arrow } from "@/components/Arrow"
import {
  Catalog,
  CatalogCategory,
  CatalogConfigCategory,
  CatalogGroup
} from "@/models/catalog"
import { getResource } from "@/lib/resources"

export const CatalogView = ({
  onSelect
}: {
  onSelect: (id: ResourceId) => () => void
}) => {
  const [categoryIndex, setCategoryIndex] = useState<number>(0)
  const handlePageChange = (direction: NavDirection) => (): void =>
    setCategoryIndex(getNavIndex(catalog, direction, categoryIndex))

  const initial = useMemo(() => mapCatalogFromConfig(catalogConfig), [])
  const [catalog, setCatalog] = useState<Catalog>(initial)

  const handleGroupNavFn = (id: string) => () => {
    const newState: Catalog = [...catalog]
    newState[categoryIndex].items.forEach((group: CatalogGroup): void => {
      const found: Constructible | undefined = group.options.find(
        con => con.id === id
      )
      if (found) group.inView = found
    })
    setCatalog(newState)
  }

  return (
    <div>
      <div className={styles.category_nav_container}>
        <div className={styles.category_title}>
          {catalog[categoryIndex].title}
        </div>
        <Arrow
          className={styles.arrow_prev}
          onClick={handlePageChange("prev")}
          aria-label="Previous page"
        />
        <Arrow
          className={styles.arrow_next}
          onClick={handlePageChange("next")}
          aria-label="Next page"
        />
      </div>
      <CatalogPage
        category={catalog[categoryIndex]}
        onGroupNav={handleGroupNavFn}
        onSelect={onSelect}
      />
    </div>
  )
}

export function mapCatalogFromConfig(
  catalogConfig: CatalogConfigCategory[]
): Catalog {
  return catalogConfig.map(mapCategoryFromConfig)
}

export function mapCategoryFromConfig(
  categoryConfig: CatalogConfigCategory
): CatalogCategory {
  return {
    ...categoryConfig,
    items: categoryConfig.items.map(mapGroupFromConfig)
  }
}

export function mapGroupFromConfig(groupConfig: ResourceId[]): CatalogGroup {
  const options: Constructible[] = groupConfig
    .map((id: ResourceId): Resource | undefined => getResource(id))
    .filter(
      (res: Resource | undefined) => res !== undefined && isConstructible(res)
    )
  return {
    inView: options[0], // TODO: Handle possible empty options
    options
  }
}
