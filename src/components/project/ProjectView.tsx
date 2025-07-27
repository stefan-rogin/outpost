import styles from "./ProjectView.module.css"
import { ResourceId } from "@/models/resource"
import { OrderItemView } from "./OrderItemView"
import { BoM } from "./BoM"
import { Power } from "./Power"
import { QtyChange } from "@/models/order"
import Image from "next/image"
import { Project, UUID } from "@/models/project"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { duplicateProject, serializeProject } from "@/service/project"
import { Bill } from "@/models/bom"

export const ProjectView = ({
  project,
  itemBill,
  deconstructedBill,
  onQtyChange,
  onDelete,
  onCreate,
  onDuplicate,
  onToggleDeconstruct,
  onRename
}: {
  project: Project
  itemBill: Bill
  deconstructedBill: Bill
  onQtyChange: (id: ResourceId, action: QtyChange) => () => void
  onDelete: () => void
  onCreate: () => void
  onDuplicate: (id: UUID) => () => void
  onToggleDeconstruct: (id: ResourceId) => () => void
  onRename: (name: string) => void
}) => {
  const [rename, setRename] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>(project.name)
  const [shared, setShared] = useState<boolean>(false)
  useEffect(() => setNewName(project.name), [project.name])

  const toggleRename = () => {
    setNewName(project.name)
    setRename(!rename)
  }
  const handleRenameSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return

    onRename(trimmed)
    setRename(false)
  }

  const handleRenameInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => setNewName(event.target.value)

  const handleOnShare = () => {
    const ANIMATION_TIMEOUT = 2000
    const serialized: string = btoa(serializeProject(duplicateProject(project)))
    const url = new window.URL(window.location.href)
    setShared(true)
    setTimeout(() => setShared(false), ANIMATION_TIMEOUT)
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(`${url.origin}/?serialized=${serialized}`)
        .catch(() => {
          console.error("Failed to copy text to clipboard.")
        })
    }
  }
  const isProjectEmpty: boolean = !(project.order.size > 0)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {rename ? (
          <form onSubmit={handleRenameSubmit}>
            <input
              type="text"
              value={newName}
              className={styles.rename_input}
              onChange={handleRenameInputChange}
              onBlur={toggleRename}
              autoFocus
            />
          </form>
        ) : (
          <h3 className={styles.title} onClick={toggleRename}>
            {project.name}
          </h3>
        )}
      </div>
      {isProjectEmpty ? (
        <div className={styles.short_intro}>
          <h3>Add modules</h3>
          <p>
            Start building your outpost by selecting modules from the panel on
            the left.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.actions_container}>
            <Power order={project.order} />
            <div className={styles.icons_container}>
              <div className={styles.icons_row}>
                <div className={styles.image_with_tooltip}>
                  <Image
                    priority={true}
                    src={shared ? "/checkmark.svg" : "/share.svg"}
                    alt={shared ? "Copied" : "Share project"}
                    width={24}
                    height={24}
                    className={styles.action_icon}
                    onClick={handleOnShare}
                  />
                  <span className={styles.tooltip}>Share</span>
                </div>
                <div className={styles.image_with_tooltip}>
                  <Image
                    priority={true}
                    src="/create.svg"
                    alt="Create project"
                    width={24}
                    height={24}
                    className={styles.action_icon}
                    onClick={onCreate}
                  />
                  <span className={styles.tooltip}>New</span>
                </div>
                <div className={styles.image_with_tooltip}>
                  <Image
                    priority={true}
                    src="/duplicate.svg"
                    alt="Duplicate project"
                    width={24}
                    height={24}
                    className={styles.action_icon}
                    onClick={onDuplicate(project.id)}
                  />
                  <span className={styles.tooltip}>Duplicate</span>
                </div>
                <div className={styles.image_with_tooltip}>
                  <Image
                    priority={true}
                    src="/rename.svg"
                    alt="Rename project"
                    width={24}
                    height={24}
                    className={styles.action_icon}
                    onClick={toggleRename}
                  />
                  <span className={styles.tooltip}>Rename</span>
                </div>
                <div className={styles.image_with_tooltip}>
                  <Image
                    priority={true}
                    src="/delete.svg"
                    alt="Delete project"
                    width={24}
                    height={24}
                    onClick={onDelete}
                    className={styles.action_icon}
                  />
                  <span className={styles.tooltip}>Delete</span>
                </div>
              </div>
            </div>
          </div>
          {[...project.order].map(([id, item]) => (
            <OrderItemView
              key={id}
              orderItem={item}
              onQtyChange={onQtyChange}
            />
          ))}
          <BoM
            onToggleDeconstruct={onToggleDeconstruct}
            order={project.order}
            itemBill={itemBill}
            deconstructedBill={deconstructedBill}
          />
        </>
      )}
    </div>
  )
}
