import { catalogConfig, mapCatalogFromConfig } from "@/service/catalog"
import { useState, useMemo } from "react"
import styles from "@/components/CatalogView.module.css"
import { getNavIndex, NavDirection } from "@/service/navigation"
import { CatalogPage } from "@/components/CatalogPage"
import { Constructible, ResourceId } from "@/models/resource"
import { Arrow } from "@/components/Arrow"
import { Catalog, CatalogGroup } from "@/models/catalog"

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
      <div className={styles.spacer}></div>
      <div className={styles.container}>
        <div className={styles.title}>{catalog[categoryIndex].title}</div>
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
