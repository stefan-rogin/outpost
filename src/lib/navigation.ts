import { NavDirection } from "@/models/types"

export function getNavIndex<T>(
  collection: Iterable<T>,
  direction: NavDirection,
  index: number = 0
): number {
  const length = [...collection].length
  return direction == "next"
    ? (index + 1) % length
    : (index - 1 + length) % length
}
