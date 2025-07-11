"use client"

import { catalog } from "@/lib/catalog"
import { useState } from "react"
import { CatalogPage } from "@/components/CatalogPage"
import Image from "next/image"
import styles from "@/app/page.module.css"
import { Resource } from "@/models/resource"
import { Project } from "@/components/Project"

export default function Home() {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [items, setItems] = useState(new Array<Resource>())

  const handlePageChange = (direction: "prev" | "next") => (): void => {
    const newCategoryIndex =
      direction === "next"
        ? (categoryIndex + 1) % catalog.length
        : (categoryIndex - 1 + catalog.length) % catalog.length
    setCategoryIndex(newCategoryIndex)
  }

  const handleQtyChange =
    (resource: Resource, action: "add" | "remove") => (): void => {
      if (action === "add") {
        setItems([...items, resource])
        return
      }
      const index = items.indexOf(resource)
      if (index !== -1) {
        setItems(items.toSpliced(index, 1))
      } else {
        console.warn(`Attempted to remove a non-existent resource.`)
      }
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
            <div
              className={`arrow ${styles.arrow_prev}`}
              onClick={handlePageChange("prev")}
            ></div>
            <div
              className={`arrow ${styles.arrow_next}`}
              onClick={handlePageChange("next")}
            ></div>
          </div>
          <CatalogPage
            category={catalog[categoryIndex]}
            onSelect={handleQtyChange}
          />
        </div>
        <div className={styles.bom_column}>
          <Project items={items} onQtyChange={handleQtyChange} />
        </div>
      </main>
      <footer className={styles.footer}>
        <small>Starfield Outpost</small>
      </footer>
    </div>
  )
}
