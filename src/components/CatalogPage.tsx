import { CatalogCategory, CatalogGroup } from "@/models/catalog"
import { Arrow } from "@/components/Arrow"
import styles from "@/components/CatalogPage.module.css"
import { useState, SyntheticEvent, useEffect } from "react"
import { ResourceId } from "@/models/resource"
import { tryGetResource } from "@/lib/resources"
import { NavDirection, QtyChange } from "@/models/types"
import Image from "next/image"
import { getNavIndex } from "@/lib/navigation"

export const CatalogPage = ({
  category,
  onSelect
}: {
  category: CatalogCategory
  onSelect: (id: ResourceId, action: QtyChange) => () => void
}) => {
  const [visualCategory, setVisualCategory] = useState<VisualCategory>(
    mapCategoryToVisual(category)
  )

  const handleNewOptionFn =
    (newSelection: ResourceId) =>
    (event: SyntheticEvent): void => {
      setVisualCategory(getVisualForSelection(visualCategory, newSelection))
      event.stopPropagation()
    }

  useEffect(() => {
    setVisualCategory(mapCategoryToVisual(category))
  }, [category])

  return (
    <div className={styles.items_column}>
      {visualCategory.items.map(group => {
        const resource = tryGetResource(group.selected)
        if (!resource) return null

        return (
          <div key={group.title} className={styles.item_with_label_container}>
            <div className={styles.item_container}>
              <Image
                src={`/icons/${group.selected}.jpg`}
                alt={resource.name}
                width={100}
                height={100}
                loading={"eager"}
                onClick={onSelect(group.selected, "add")}
              />

              {group.options.length > 1 && (
                <>
                  <Arrow
                    className={styles.arrow_prev}
                    onClick={handleNewOptionFn(getNavOption(group, "prev"))}
                    aria-label="Previous option"
                  />
                  <Arrow
                    className={styles.arrow_next}
                    onClick={handleNewOptionFn(getNavOption(group, "next"))}
                    aria-label="Next option"
                  />
                </>
              )}
            </div>
            <div className={styles.item_label}>{resource.name}</div>
          </div>
        )
      })}
    </div>
  )
}

export interface VisualGroup {
  title: string
  selected: ResourceId
  options: ResourceId[]
}

export interface VisualCategory {
  title: string
  items: VisualGroup[]
}

export function getVisualForSelection(
  category: VisualCategory,
  selection: ResourceId
): VisualCategory {
  return {
    ...category,
    items: category.items.map(group =>
      group.options.includes(selection)
        ? { ...group, selected: selection }
        : group
    )
  }
}

export function mapCategoryToVisual(category: CatalogCategory): VisualCategory {
  return {
    ...category,
    items: category.items.map(group => {
      return {
        ...group,
        selected: group.options[0]
      }
    })
  }
}

export function getNavOption(
  group: VisualGroup,
  direction: NavDirection
): ResourceId {
  const currentIndex = group.options.indexOf(group.selected) || 0
  return group.options[getNavIndex(group.options, direction, currentIndex)]
}
