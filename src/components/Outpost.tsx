"use client"

declare global {
  interface Window {
    PayPal?: {
      Donation?: {
        Button?: (options: unknown) => { render: (selector: string) => void }
      }
    }
  }
}

import styles from "./Outpost.module.css"
import { CatalogView } from "@/components/CatalogView"
import { ProjectView } from "@/components/ProjectView"
import { ResourceId } from "@/models/resource"
import { QtyChange } from "@/models/order"
import { useCallback, useEffect } from "react"
import { useProject } from "@/hooks/useProject"
import { ProjectActionType } from "@/reducers/projectReducer"
import { Link } from "@/components/Link"
import { RecentProjects } from "./RecentProjects"
import { Intro } from "./Intro"

export const Outpost = () => {
  const { state, dispatch, deleteProject } = useProject()

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

  const handleOnDelete = (): void => {
    const confirmed: boolean = window.confirm(
      "Are you sure you want to delete this project?"
    )
    if (!confirmed) return
    if (!state.project.id) return

    deleteProject()
  }

  const handleOnCreate = (): void => {
    dispatch({ type: ProjectActionType.CREATE })
  }

  const handleOnToggleDeconstruct = (id: ResourceId) => (): void =>
    dispatch({
      type: ProjectActionType.TOGGLE_DECONSTRUCT,
      payload: id
    })

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
    script.charset = "UTF-8"
    script.onload = () => {
      if (window.PayPal?.Donation?.Button) {
        window.PayPal.Donation.Button({
          env: "production",
          hosted_button_id: "CXMVLBQ2WCZDC",
          image: {
            src: "https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif",
            alt: "Donate with PayPal button",
            title: "PayPal - The safer, easier way to pay online!"
          }
        }).render("#donate-button")
      }
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div className={styles.body}>
      <div className={styles.catalog_column}>
        <Link href="project-list" content="All projects" />

        <CatalogView onSelect={handleCatalogSelect} />
        {!state.isLoading && state.project.lastOpened && <RecentProjects />}
        <div id="donate-button-container">
          <div id="donate-button"></div>
        </div>
      </div>
      <div className={styles.bom_column}>
        {state.isLoading || state.isError || state.isEmptyWorkspace ? (
          <Intro
            isLoading={state.isLoading}
            isError={state.isError}
            isEmptyWorkspace={state.isEmptyWorkspace}
          />
        ) : (
          <ProjectView
            onCreate={handleOnCreate}
            onDelete={handleOnDelete}
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
