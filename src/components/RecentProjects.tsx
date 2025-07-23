"use client"

import styles from "@/components/RecentProjects.module.css"
import { UUID } from "@/models/project"
import { getRecentProjects } from "@/service/project"
import { useMemo } from "react"

export const RecentProjects = ({ id }: { id: UUID }) => {
  const recentProjects = useMemo(() => getRecentProjects().toSpliced(10), [id])

  return (
    <div>
      <div className={styles.title_container}>
        <div className={styles.title}>Recent</div>
      </div>
      <div className={styles.list}>
        {recentProjects.map(p => (
          <div key={p.id} className={styles.list_element}>
            <a href={`/?id=${p.id}`}>{p.name}</a>
          </div>
        ))}
      </div>
    </div>
  )
}
