"use client"

import { catalog } from "@/lib/catalog"
import { useState } from "react"
import { CatalogPage } from "@/components/CatalogPage"
import Image from "next/image"
import styles from "@/app/page.module.css"
import { ResourceId } from "@/models/resource"
import { Project } from "@/components/Project"
import { Arrow } from "@/components/Arrow"
import { NavDirection, QtyChange } from "@/models/types"
import { getNavIndex } from "@/lib/navigation"

export const Home = () => {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [items, setItems] = useState<Map<ResourceId, number>>(new Map())

  const handlePageChangeFn = (direction: NavDirection) => (): void =>
    setCategoryIndex(getNavIndex(catalog, direction, categoryIndex))

  const handleQtyChangeFn = (id: ResourceId, action: QtyChange) => (): void =>
    setItems(changeQty(id, action, items))

  return (
    <div className={styles.page_layout}>
      <header className={styles.header}>
        <div className={styles.header_title}>
          <Image
            priority={true}
            src="/starfield.svg"
            alt="Starfield Logo"
            width={120}
            height={120}
          />
          <h2>OUTPOST</h2>
          <h3>&middot; PLANNER</h3>
        </div>

        <div className={styles.header_border}>
          <div className={styles.border_bar_1}>&nbsp;</div>
          <div className={styles.border_bar_2}>&nbsp;</div>
          <div className={styles.border_bar_3}>&nbsp;</div>
          <div className={styles.border_bar_4}>&nbsp;</div>
        </div>
      </header>
      <main className={styles.body}>
        <div className={styles.catalog_column}>
          <div className={styles.category_nav_container}>
            <div className={styles.category_title}>
              {catalog[categoryIndex].title}
            </div>
            <Arrow
              className={styles.arrow_prev}
              onClick={handlePageChangeFn("prev")}
              aria-label="Previous page"
            />
            <Arrow
              className={styles.arrow_next}
              onClick={handlePageChangeFn("next")}
              aria-label="Next page"
            />
          </div>
          <CatalogPage
            category={catalog[categoryIndex]}
            onSelect={handleQtyChangeFn}
          />
        </div>
        <div className={styles.bom_column}>
          <Project items={items} onQtyChange={handleQtyChangeFn} />
        </div>
      </main>
      <footer className={styles.footer}>
        <small>Starfield Outpost</small>
      </footer>
    </div>
  )
}

export function changeQty(
  id: ResourceId,
  action: QtyChange,
  map: Map<ResourceId, number>
): Map<ResourceId, number> {
  const newMap = new Map(map)
  const currentQty = newMap.get(id) || 0
  if (action === "add") {
    newMap.set(id, currentQty + 1)
  } else {
    currentQty <= 1 ? newMap.delete(id) : newMap.set(id, currentQty - 1)
  }
  return newMap
}

export default Home
