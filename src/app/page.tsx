"use client"

import Image from "next/image"
import styles from "@/app/page.module.css"
import { CatalogView } from "@/components/CatalogView"
import { Project } from "@/components/Project"
import {
  ResourceId,
  QtyChange,
  Resource,
  isConstructible
} from "@/models/resource"
import { Order } from "@/models/order"
import { useState } from "react"
import { getResource } from "@/lib/resources"

export const Home = () => {
  const [order, setOrder] = useState<Order>(new Map())

  const handleCatalogSelect = (id: ResourceId) => (): void =>
    setOrder(changeOrderQty(id, "add", order))

  const handleQtyChange = (id: ResourceId, action: QtyChange) => (): void =>
    setOrder(changeOrderQty(id, action, order))

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
          <CatalogView onSelect={handleCatalogSelect} />
        </div>
        <div className={styles.bom_column}>
          <Project order={order} onQtyChange={handleQtyChange} />
        </div>
      </main>
      <footer className={styles.footer}>
        <small>Starfield Outpost</small>
      </footer>
    </div>
  )
}

export default Home

export function changeOrderQty(
  id: ResourceId,
  action: QtyChange,
  order: Order
): Order {
  const newOrder = new Map(order)
  const item = newOrder.get(id)
  if (action === "add") {
    if (item) {
      newOrder.set(id, { ...item, quantity: item.quantity + 1 })
    } else {
      const constructible: Resource | undefined = getResource(id)
      if (constructible && isConstructible(constructible))
        newOrder.set(id, { item: constructible, quantity: 1 })
    }
  } else if (item) {
    if (item.quantity <= 1) {
      newOrder.delete(id)
    } else {
      newOrder.set(id, { ...item, quantity: item.quantity - 1 })
    }
  }
  return newOrder
}
