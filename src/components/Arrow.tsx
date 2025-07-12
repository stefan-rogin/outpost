import styles from "@/components/Arrow.module.css"
import { SyntheticEvent } from "react"

export const Arrow = ({
  onClick,
  className = "",
  ...props
}: {
  onClick: (event: SyntheticEvent<Element, Event>) => void
  className?: string
}) => (
  <div
    role="button"
    className={`${styles.arrow} ${className}`}
    onClick={onClick}
    {...props}
  ></div>
)
