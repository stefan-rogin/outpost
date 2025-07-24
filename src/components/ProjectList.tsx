"use client"

import styles from "@/components/ProjectList.module.css"
import { Link } from "@/components/Link"
import { getRecentProjects } from "@/service/project"
import { useEffect, useState } from "react"
import { ProjectInfo } from "@/models/project"
import NextLink from "next/link"

export const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectInfo[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProjects(getRecentProjects() ?? [])
    }
  }, [])

  return (
    <div className={styles.body}>
      <div className={styles.column_container}>
        <div className={styles.column1}>
          <Link href="/" content="Planner" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.project_info}>
          <div className={`${styles.time_info} ${styles.header}`}>
            Last modified
          </div>
          <div className={`${styles.name} ${styles.header}`}>Project Name</div>
        </div>

        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className={styles.project_info}>
              <div className={styles.time_info}>
                {project.lastChanged.toLocaleString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  year: "numeric",
                  month: "2-digit",
                  day: "numeric"
                })}
              </div>
              <div className={styles.name}>
                <NextLink href={`/?id=${project.id}`}>{project.name}</NextLink>
              </div>
            </div>
          ))
        ) : (
          <p>There are no saved projects yet.</p>
        )}
      </div>
    </div>
  )
}
