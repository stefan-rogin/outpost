import styles from "@/components/ProjectView.module.css"
import { ResourceId } from "@/models/resource"
import { OrderItemView } from "./OrderItemView"
import { BoM } from "./BoM"
import { Power } from "./Power"
import { QtyChange } from "@/models/order"
import Image from "next/image"
import { ProjectState } from "@/models/project"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { Intro } from "./Intro"

export const ProjectView = ({
  state,
  onQtyChange,
  onClear,
  onCreate,
  onToggleDeconstruct,
  onRename
}: {
  state: ProjectState
  onQtyChange: (id: ResourceId, action: QtyChange) => () => void
  onClear: () => void
  onCreate: () => void
  onToggleDeconstruct: (id: ResourceId) => () => void
  onRename: (name: string) => void
}) => {
  const [rename, setRename] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>(state.project.name)
  useEffect(() => setNewName(state.project.name), [state.project.name])

  const toggleRename = () => {
    setNewName(state.project.name)
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

  if (state.project.order.size > 0)
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
              {state.project.name}
            </h3>
          )}
        </div>
        <div className={styles.actions_container}>
          <Power order={state.project.order} />

          <Image
            priority={true}
            src="/create.svg"
            alt="Create project"
            width={24}
            height={24}
            className={styles.create_icon}
            onClick={onCreate}
          />
          <Image
            priority={true}
            src="/rename.svg"
            alt="Rename project"
            width={24}
            height={24}
            className={styles.rename_icon}
            onClick={toggleRename}
          />
          <Image
            priority={true}
            src="/delete.svg"
            alt="Delete project"
            width={24}
            height={24}
            onClick={onClear}
            className={styles.delete_icon}
          />
        </div>
        {[...state.project.order].map(([id, item]) => (
          <OrderItemView key={id} orderItem={item} onQtyChange={onQtyChange} />
        ))}
        <BoM
          onToggleDeconstruct={onToggleDeconstruct}
          order={state.project.order}
          itemBill={state.itemBill}
          deconstructedBill={state.deconstructedBill}
        />
      </div>
    )
  else return <Intro />
}
