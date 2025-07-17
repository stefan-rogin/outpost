"use client"

declare global {
  interface Window {
    PayPal?: {
      Donation?: {
        Button?: (options: any) => { render: (selector: string) => void }
      }
    }
  }
}

import styles from "./Outpost.module.css"
import { CatalogView } from "@/components/CatalogView"
import { Project } from "@/components/Project"
import {
  ResourceId,
  QtyChange,
  Resource,
  isConstructible
} from "@/models/resource"
import { Order, OrderItem } from "@/models/order"
import { useState, useEffect } from "react"
import { getResource } from "@/lib/resources"
import { useLocalStorage } from "@/hooks/useLocalStorage"

export const Outpost = () => {
  const [storedOrder, setStoredOrder] = useLocalStorage("order")
  const [order, setOrder] = useState<Order>(new Map<ResourceId, OrderItem>())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const parsedOrder = JSON.parse(storedOrder || "[]")
      setOrder(new Map(parsedOrder))
    } catch {
      setOrder(new Map<ResourceId, OrderItem>())
    }
    setHydrated(true)
  }, [storedOrder])

  useEffect(() => {
    if (hydrated) {
      setStoredOrder(JSON.stringify(Array.from(order.entries())))
    }
  }, [order, hydrated, setStoredOrder])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
    script.charset = "UTF-8"
    script.onload = () => {
      if (window.PayPal?.Donation?.Button) {
        window.PayPal.Donation.Button({
          env: "production",
          hosted_button_id: "CXMVLBQ2WCZDC",
          image: {
            src: "https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif",
            alt: "Donate with PayPal button",
            title: "PayPal - The safer, easier way to pay online!"
          }
        }).render("#donate-button")
      }
    }
    document.body.appendChild(script)
  }, [])

  const handleCatalogSelect = (id: ResourceId) => (): void =>
    setOrder(changeOrderQty(id, "add", order))

  const handleQtyChange = (id: ResourceId, action: QtyChange) => (): void =>
    setOrder(changeOrderQty(id, action, order))

  const handleOnClear = () => () => {
    console.log("Clear")
    setOrder(new Map())
  }

  return (
    <>
      <div className={styles.catalog_column}>
        <div id="donate-button-container">
          <div id="donate-button"></div>
        </div>

        <CatalogView onSelect={handleCatalogSelect} />
      </div>
      <div className={styles.bom_column}>
        <Project
          onClear={handleOnClear}
          order={order}
          onQtyChange={handleQtyChange}
        />
      </div>
    </>
  )
}

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
