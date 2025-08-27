import { ResourceId, Resource, isConstructible } from "@/models/resource"
import styles from "./BoM.module.css"
import { useState } from "react"
import Image from "next/image"
import { Bill, BomItem } from "@/models/bom"
import { getTier, getScarcity, getCsvFromProject } from "../../service/bom"
import { Order } from "@/models/order"
import { getResource } from "@/service/resource"

export const BoM = ({
  order,
  itemBill,
  deconstructedBill,
  onToggleDeconstruct
}: {
  order: Order
  itemBill: Bill
  deconstructedBill: Bill
  onToggleDeconstruct: (id: ResourceId) => () => void
}) => {
  const [copied, setCopied] = useState<boolean>(false)

  const isDeconstructed = (id: ResourceId) => deconstructedBill.has(id)

  const handleCopyClipboard = () => {
    const ANIMATION_TIMEOUT = 2000
    const text = getCsvFromProject(itemBill, order)
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
          onClick={handleCopyClipboard}
        />
      </div>
      <div className={styles.bom}>
        {[...deconstructedBill.values(), ...itemBill.values()]
          .sort(compareFn)
          .map(bomItem => {
            const itemClassName = `${styles.bom_item} ${
              isConstructible(bomItem.item) ? styles.bom_constructible : ""
            } ${
              isDeconstructed(bomItem.item.id) ? styles.bom_deconstructed : ""
            }`
            const iconPath: string | undefined = getIconPath(bomItem.item)
            return (
              <div key={bomItem.item.id}>
                <div
                  className={itemClassName}
                  onClick={
                    isConstructible(bomItem.item)
                      ? onToggleDeconstruct(bomItem.item.id)
                      : undefined
                  }
                  aria-label={
                    isConstructible(bomItem.item) ? "Toggle deconstruct" : ""
                  }
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
                {isDeconstructed(bomItem.item.id) && (
                  <div className={styles.item_bom}>
                    {isConstructible(bomItem.item) &&
                      Object.entries(bomItem.item.blueprint).map(
                        ([id, qty]: [id: ResourceId, qty: number]) => (
                          <div className={styles.res_chip} key={id}>
                            {qty * bomItem.quantity} x{" "}
                            {getResource(id)?.name || id}
                          </div>
                        )
                      )}
                  </div>
                )}
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
      case "Common":
        return ""
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
