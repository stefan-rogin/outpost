"use client"

import styles from "./RecentProjects.module.css"
import { getRecentProjects } from "@/service/project"

export const RecentProjects = () => {
  const RECENT_LIST_SIZE = 10

  const recentProjects = getRecentProjects().toSpliced(RECENT_LIST_SIZE)
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
