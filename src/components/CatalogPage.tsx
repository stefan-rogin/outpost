import { CatalogCategory, CatalogGroup } from "@/models/catalog"
import { Arrow } from "@/components/Arrow"
import styles from "@/components/CatalogPage.module.css"
import { useState, SyntheticEvent, useEffect } from "react"
import { ResourceId } from "@/models/resource"
import { tryGetResource } from "@/lib/resources"
import { NavDirection, QtyChange } from "@/models/types"
import Image from "next/image"

interface VisualGroup {
  title: string
  selected: ResourceId
  options: ResourceId[]
}

interface VisualCategory {
  title: string
  items: VisualGroup[]
}

const mapGroupToVisual = (group: CatalogGroup): VisualGroup => {
  return {
    ...group,
    selected: group.options[0]
  }
}

// TODO: Extract array wrapper from here and page
const getNavOption = (
  group: VisualGroup,
  direction: NavDirection
): ResourceId => {
  const currentIndex = group.options.indexOf(group.selected) || 0
  const futureIndex =
    direction === "next"
      ? (currentIndex + 1) % group.options.length
      : (currentIndex - 1 + group.options.length) % group.options.length

  return group.options[futureIndex]
}

// TODO: Extract Arrow component
export const CatalogPage = ({
  category,
  onSelect
}: {
  category: CatalogCategory
  onSelect: (id: ResourceId, action: QtyChange) => () => void
}) => {
  const initialVisualCategory: VisualCategory = {
    ...category,
    items: category.items.map(group => mapGroupToVisual(group))
  }
  const [visualCategory, setVisualCategory] = useState(initialVisualCategory)

  const handleNewOptionFn =
    (newSelection: ResourceId) =>
    (event: SyntheticEvent): void => {
      const newVisual: VisualCategory = {
        ...visualCategory,
        items: visualCategory.items.map(group =>
          group.options.includes(newSelection)
            ? { ...group, selected: newSelection }
            : group
        )
      }
      setVisualCategory(newVisual)
      event.stopPropagation()
    }

  useEffect(() => {
    setVisualCategory({
      ...category,
      items: category.items.map(group => mapGroupToVisual(group))
    })
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
                  />
                  <Arrow
                    className={styles.arrow_next}
                    onClick={handleNewOptionFn(getNavOption(group, "next"))}
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
