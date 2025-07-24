"use client"

import styles from "./Outpost.module.css"
import { CatalogView } from "@/components/CatalogView"
import { ProjectView } from "@/components/ProjectView"
import { ResourceId } from "@/models/resource"
import { QtyChange } from "@/models/order"
import { useCallback } from "react"
import { useProject } from "@/hooks/useProject"
import { ProjectActionType } from "@/reducers/projectReducer"
import { Link } from "@/components/Link"
import { RecentProjects } from "./RecentProjects"

export const Outpost = () => {
  const { state, dispatch } = useProject()

  const handleCatalogSelect = useCallback(
    (id: ResourceId) => (): void =>
      dispatch({
        type: ProjectActionType.CHANGE_ITEM_QTY,
        payload: { id, qtyChange: "add" }
      }),
    [dispatch]
  )

  const handleQtyChange = useCallback(
    (id: ResourceId, qtyChange: QtyChange) => (): void =>
      dispatch({
        type: ProjectActionType.CHANGE_ITEM_QTY,
        payload: { id, qtyChange }
      }),
    [dispatch]
  )

  const handleOnRename = (name: string): void => {
    dispatch({ type: ProjectActionType.RENAME, payload: name })
  }

  const handleOnClear = (): void => {
    dispatch({ type: ProjectActionType.DELETE })
  }

  const handleOnCreate = (): void => {
    dispatch({ type: ProjectActionType.CREATE })
  }

  const handleOnToggleDeconstruct = (id: ResourceId) => (): void =>
    dispatch({
      type: ProjectActionType.TOGGLE_DECONSTRUCT,
      payload: id
    })

  return (
    <div className={styles.body}>
      <div className={styles.catalog_column}>
        <Link href="project-list" content="All projects" />

        <CatalogView onSelect={handleCatalogSelect} />
        {!state.isLoading && state.project.lastOpened && <RecentProjects />}
      </div>
      <div className={styles.bom_column}>
        {state.isLoading ? (
          <div className={styles.loading}>Loading…</div>
        ) : (
          <ProjectView
            onCreate={handleOnCreate}
            onClear={handleOnClear}
            state={state}
            onQtyChange={handleQtyChange}
            onToggleDeconstruct={handleOnToggleDeconstruct}
            onRename={handleOnRename}
          />
        )}
      </div>
    </div>
  )
}
