export type Optional<T> = T | undefined

export function isDefined<T>(value: Optional<T>): value is T {
  return value !== undefined
}
