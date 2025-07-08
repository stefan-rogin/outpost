"use client"

import { catalog } from "@/lib/catalog"
import { SyntheticEvent, useState } from "react"
import { CatalogPage } from "@/components/CatalogPage"
import Image from "next/image"
import styles from "@/app/page.module.css"

export default function Home() {
  const [categoryIndex, setCategoryIndex] = useState(0)

  const handlePageChange =
    (direction: "prev" | "next") =>
    (event: SyntheticEvent): void => {
      const newCategoryIndex =
        direction === "next"
          ? (categoryIndex + 1) % catalog.length
          : (categoryIndex - 1 + catalog.length) % catalog.length
      setCategoryIndex(newCategoryIndex)
    }
  return (
    <>
      <div className={styles.category_nav_container}>
        <div className={styles.category_title}>
          {catalog[categoryIndex].title}
        </div>
        <Image
          src="/left-arrow.svg"
          alt="Previous option"
          width={24}
          height={24}
          className={styles.arrow_prev}
          onClick={handlePageChange("prev")}
        />
        <Image
          src="/left-arrow.svg"
          alt="Next option"
          width={24}
          height={24}
          className={styles.arrow_next}
          onClick={handlePageChange("next")}
        />
      </div>

      <CatalogPage category={catalog[categoryIndex]} />
    </>
  )
}
