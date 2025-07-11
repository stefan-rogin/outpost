"use client"

import { catalog } from "@/lib/catalog"
import { useState } from "react"
import { CatalogPage } from "@/components/CatalogPage"
import Image from "next/image"
import styles from "@/app/page.module.css"
import { ResourceId } from "@/models/resource"
import { Project } from "@/components/Project"
import { useMappedState } from "@/hooks/useMappedState"
import { Arrow } from "@/components/Arrow"
import { NavDirection, QtyChange } from "@/models/types"

export default function Home() {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const { map, set, remove, get } = useMappedState<ResourceId, number>()

  const handlePageChangeFn = (direction: NavDirection) => (): void => {
    const newCategoryIndex =
      direction === "next"
        ? (categoryIndex + 1) % catalog.length
        : (categoryIndex - 1 + catalog.length) % catalog.length
    setCategoryIndex(newCategoryIndex)
  }

  const handleQtyChangeFn = (id: ResourceId, action: QtyChange) => (): void => {
    if (action === "add") {
      set(id, (get(id) || 0) + 1)
      return
    }
    const currentQty = get(id) || 0
    currentQty <= 1 ? remove(id) : set(id, currentQty - 1)
  }

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
            />
            <Arrow
              className={styles.arrow_next}
              onClick={handlePageChangeFn("next")}
            />
          </div>
          <CatalogPage
            category={catalog[categoryIndex]}
            onSelect={handleQtyChangeFn}
          />
        </div>
        <div className={styles.bom_column}>
          <Project items={map} onQtyChange={handleQtyChangeFn} />
        </div>
      </main>
      <footer className={styles.footer}>
        <small>Starfield Outpost</small>
      </footer>
    </div>
  )
}
