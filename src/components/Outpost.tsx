"use client"

import styles from "./Outpost.module.css"
import { CatalogView } from "@/components/CatalogView"
import { ProjectView } from "@/components/ProjectView"
import { ResourceId } from "@/models/resource"
import { QtyChange } from "@/models/order"
import { useCallback, useEffect } from "react"
import { useProject } from "@/hooks/useProject"
import { ProjectActionType } from "@/reducers/projectReducer"

declare global {
  interface Window {
    PayPal?: {
      Donation?: {
        Button?: (options: unknown) => { render: (selector: string) => void }
      }
    }
  }
}

export const Outpost = () => {
  const { state, dispatch, loaded } = useProject()

  // Paypal button
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

  const handleOnRename = (name: string) => {
    dispatch({ type: ProjectActionType.RENAME, payload: name })
  }

  const handleOnClear = () => {
    dispatch({ type: ProjectActionType.CLEAR })
  }

  const handleOnToggleDeconstruct = (id: ResourceId) => (): void =>
    dispatch({
      type: ProjectActionType.TOGGLE_DECONSTRUCT,
      payload: id
    })

  return (
    <>
      <div className={styles.catalog_column}>
        <div id="donate-button-container">
          <div id="donate-button"></div>
        </div>

        <CatalogView onSelect={handleCatalogSelect} />
      </div>
      <div className={styles.bom_column}>
        {loaded ? (
          <ProjectView
            onClear={handleOnClear}
            state={state}
            onQtyChange={handleQtyChange}
            onToggleDeconstruct={handleOnToggleDeconstruct}
            onRename={handleOnRename}
          />
        ) : (
          <div className={styles.loading}>Loading…</div>
        )}
      </div>
    </>
  )
}
