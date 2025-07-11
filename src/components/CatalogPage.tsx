import { CatalogCategory, CatalogGroup } from "@/models/catalog"
import styles from "@/components/CatalogPage.module.css"
import { useState, SyntheticEvent, useEffect } from "react"
import { Resource, ResourceId } from "@/models/resource"
import { resources } from "@/lib/resources"
import Image from "next/image"

interface VisualGroup {
  title: string
  selected: Resource
  options: Resource[]
}

interface VisualCategory {
  title: string
  items: VisualGroup[]
}

type CatalogPageProps = {
  category: CatalogCategory
  onSelect: (resource: Resource, action: "add" | "remove") => () => void
}

const getResource = (id: ResourceId): Resource => {
  const res = resources[id]
  if (!res) throw new Error(`Missing resource: ${id}`)
  return res
}

const mapGroupToVisual = (group: CatalogGroup): VisualGroup => {
  return {
    ...group,
    selected: getResource(group.options[0]),
    options: group.options.map(option => getResource(option))
  }
}

const getNavOption = (
  group: VisualGroup,
  direction: "prev" | "next"
): Resource => {
  const currentIndex = group.options.indexOf(group.selected) || 0
  const futureIndex =
    direction === "next"
      ? (currentIndex + 1) % group.options.length
      : (currentIndex - 1 + group.options.length) % group.options.length

  return group.options[futureIndex]
}

export const CatalogPage = ({ category, onSelect }: CatalogPageProps) => {
  const initialVisualCategory: VisualCategory = {
    ...category,
    items: category.items.map(group => mapGroupToVisual(group))
  }
  const [visualCategory, setVisualCategory] = useState(initialVisualCategory)

  const handleNewOption =
    (newSelection: Resource) =>
    (event: SyntheticEvent): void => {
      const newVisual: VisualCategory = {
        ...visualCategory,
        items: visualCategory.items.map(group => {
          return {
            ...group,
            selected: group.options.includes(newSelection)
              ? newSelection
              : group.selected
          }
        })
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
      {visualCategory.items.map(group => (
        <div key={group.title} className={styles.item_with_label_container}>
          <div key={group.title} className={styles.item_container}>
            <Image
              src={`/icons/${group.selected.id}.jpg`}
              alt={group.selected.name}
              width={100}
              height={100}
              loading={"eager"}
              onClick={onSelect(group.selected, "add")}
            />

            {group.options.length > 1 && (
              <>
                <div
                  className={`arrow ${styles.arrow_prev}`}
                  onClick={handleNewOption(getNavOption(group, "prev"))}
                ></div>
                <div
                  className={`arrow ${styles.arrow_next}`}
                  onClick={handleNewOption(getNavOption(group, "next"))}
                ></div>
              </>
            )}
          </div>
          <div className={styles.item_label}>{group.selected.name}</div>
        </div>
      ))}
    </div>
  )
}
