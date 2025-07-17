import {
  ResourceId,
  Resource,
  isConstructible,
  Constructible,
  BaseResource
} from "@/models/resource"
import { Order, OrderItem } from "@/models/order"
import styles from "@/components/BoM.module.css"
import { getResource } from "@/lib/resources"
import { useState, useMemo } from "react"
import Image from "next/image"

export interface BomItem {
  item: Resource
  quantity: number
}

export type Bill = Map<ResourceId, BomItem>
export type Scarcity = "Common" | "Uncommon" | "Rare" | "Exotic" | "Unique"
export type Tier = "Tier01" | "Tier02" | "Tier03"

// FIXME: BoM is getting big
export const BoM = ({ order }: { order: Order }) => {
  const [deconstructed, setDeconstructed] = useState<Bill>(new Map())
  const bom = useMemo(
    () => aggregateBlueprints(order, deconstructed),
    [order, deconstructed]
  )

  const [copied, setCopied] = useState<boolean>(false)

  const isDeconstructed = (id: ResourceId) => deconstructed.has(id)

  const toggleDeconstructed = (bomItem: BomItem) => (): void => {
    if (!isConstructible(bomItem.item)) return
    const id = bomItem.item.id
    const newDeconstructed = new Map<ResourceId, BomItem>(deconstructed)
    if (deconstructed.has(id)) newDeconstructed.delete(id)
    else newDeconstructed.set(id, bomItem)
    console.log(newDeconstructed)
    setDeconstructed(newDeconstructed)
  }

  const handleCopyClipboard = () => {
    const ANIMATION_TIMEOUT = 2000
    const text = getCsvFromProject(bom, order)
    setCopied(true)
    setTimeout(() => setCopied(false), ANIMATION_TIMEOUT)

    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text).catch(() => {
        console.error("Failed to copy text to clipboard.")
      })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Materials</h3>
        <Image
          priority={true}
          src={copied ? "/checkmark.svg" : "/clipboard-text.svg"}
          alt={copied ? "Copied." : "Copy to clipboard"}
          width={24}
          height={24}
          className={styles.power_icon}
          onClick={handleCopyClipboard}
        />
      </div>
      <div className={styles.bom}>
        {[...deconstructed.values(), ...bom.values()]
          .sort(compareFn)
          .map(bomItem => {
            const itemClassName = `${styles.bom_item} ${
              isConstructible(bomItem.item) ? styles.bom_constructible : ""
            } ${
              isDeconstructed(bomItem.item.id) ? styles.bom_deconstructed : ""
            }`
            const iconPath: string | undefined = getIconPath(bomItem.item)
            return (
              <div
                className={itemClassName}
                key={bomItem.item.id}
                onClick={toggleDeconstructed(bomItem)}
              >
                <span className={styles.quantity}>{bomItem.quantity}</span>
                <div className={styles.icon_container}>
                  {iconPath && (
                    <Image
                      src={iconPath}
                      alt="Scarcity"
                      width={16}
                      height={16}
                    />
                  )}
                </div>

                {bomItem.item.name ?? bomItem.item.id}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export function compareFn(a: BomItem, b: BomItem) {
  // TODO: Introduce tiers/scarcity
  if (isConstructible(a.item) && !isConstructible(b.item)) return -1
  else if (!isConstructible(b.item) && !isConstructible(a.item)) return 1
  else return 0
}

// TODO: Move out
export function getTier(constructible: Constructible): Tier | undefined {
  const tierMatch = constructible.id.match(/^(?:Mfg_)(Tier01|Tier02|Tier03)/)
  if (!tierMatch) return undefined
  return tierMatch[1] as Tier
}

// TODO: Move out
export function getScarcity(baseResource: BaseResource): Scarcity | undefined {
  const scarcityMatch = baseResource.id.match(
    /^(?:Inorg|Org)(Common|Uncommon|Rare|Exotic|Unique)/
  )
  if (!scarcityMatch) return undefined
  return scarcityMatch[1] as Scarcity
}

export function getIconPath(resource: Resource): string | undefined {
  if (isConstructible(resource)) {
    switch (getTier(resource)) {
      case "Tier01":
        return "/tier-1.svg"
      case "Tier02":
        return "/tier-2.svg"
      case "Tier03":
        return "/tier-3.svg"
      default:
        return undefined
    }
  } else {
    switch (getScarcity(resource)) {
      case "Uncommon":
        return "/scarcity-uncommon.svg"
      case "Rare":
        return "/scarcity-rare.svg"
      case "Exotic":
        return "/scarcity-exotic.svg"
      case "Unique":
        return "/scarcity-unique.svg"
      default:
        return undefined
    }
  }
}

export function getCsvFromProject(bill: Bill, order: Order): string {
  const bomExport: string = bill
    .values()
    .reduce(
      (acc: string, billItem: BomItem): string =>
        acc + `${billItem.quantity},${billItem.item.name}\n`,
      ""
    )
  const orderExport = order
    .values()
    .reduce(
      (acc: string, orderItem: OrderItem) =>
        acc + `${orderItem.quantity}, ${orderItem.item.name}\n`,
      ""
    )
  return `${orderExport}\n${bomExport}`
}

export function aggregateBlueprints(order: Order, deconstructed: Bill): Bill {
  const result = new Map<ResourceId, BomItem>()
  for (const orderItem of order.values()) {
    const itemBom = getBomForInput(
      new Map(),
      orderItem.item.id,
      orderItem.quantity,
      deconstructed,
      true
    )
    for (const bomResource of itemBom.values()) {
      mergeResource(result, bomResource)
    }
  }
  return result
}

export function mergeResource(prev: Bill, newResource: BomItem) {
  const id = newResource.item.id
  const existing = prev.get(id)
  prev.set(id, {
    item: newResource.item,
    quantity: (existing?.quantity || 0) + newResource.quantity
  })
}

export function getBomForInput(
  prev: Bill,
  id: ResourceId,
  qty: number,
  deconstructed: Bill,
  isOrderItem = false
): Bill {
  const result = new Map(prev)
  if (id === "Mfg_Tier03_RothiciteMagnet") {
    console.log(getResource(id))
  }
  const resource = getResource(id)

  if (resource == undefined) return result

  if (
    !isConstructible(resource) ||
    (!deconstructed.has(resource.id) && !isOrderItem)
  ) {
    mergeResource(result, {
      item: resource,
      quantity: qty
    })
    return result
  }

  for (const [blueprintId, blueprintQty] of Object.entries(
    resource.blueprint
  )) {
    const partial = getBomForInput(
      new Map(),
      blueprintId,
      blueprintQty * qty,
      deconstructed
    )
    for (const resourceFromBlueprint of partial.values()) {
      mergeResource(result, resourceFromBlueprint)
    }
  }

  return result
}
