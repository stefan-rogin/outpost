import { Arrow } from "@/components/Arrow"
import styles from "@/components/CatalogPage.module.css"
import { ResourceId } from "@/models/resource"
import Image from "next/image"
import { getNavIndex, NavDirection } from "@/service/navigation"
import { CatalogCategory, CatalogGroup } from "@/models/catalog"

export const CatalogPage = ({
  category,
  onGroupNav,
  onSelect
}: {
  category: CatalogCategory
  onGroupNav: (id: ResourceId) => () => void
  onSelect: (id: ResourceId) => () => void
}) => (
  <div className={styles.items_column}>
    {category.items.map(group => {
      return (
        <div key={group.inView.id} className={styles.item_with_label_container}>
          <div className={styles.item_container}>
            <Image
              src={`/icons/${group.inView.id}.jpg`}
              alt={group.inView.name}
              width={100}
              height={100}
              loading="eager"
              onClick={onSelect(group.inView.id)}
            />

            {group.options.length > 1 && (
              <>
                <Arrow
                  className={styles.arrow_prev}
                  onClick={onGroupNav(getNavOption(group, "prev"))}
                  aria-label="Previous option"
                />
                <Arrow
                  className={styles.arrow_next}
                  onClick={onGroupNav(getNavOption(group, "next"))}
                  aria-label="Next option"
                />
              </>
            )}
          </div>
          <div className={styles.item_label}>{group.inView.name}</div>
        </div>
      )
    })}
  </div>
)

export function getNavOption(
  group: CatalogGroup,
  direction: NavDirection
): ResourceId {
  const currentIndex = group.options.indexOf(group.inView) || 0
  return group.options[getNavIndex(group.options, direction, currentIndex)].id
}
