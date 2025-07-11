import { useState, useCallback } from "react"

export function useMappedState<K, V>(initialEntries?: Iterable<[K, V]>) {
  const [map, setMap] = useState<Map<K, V>>(() => new Map(initialEntries))

  const get = useCallback((key: K): V | undefined => map.get(key), [map])

  const has = useCallback((key: K): boolean => map.has(key), [map])

  const keys = useCallback(() => Array.from(map.keys()), [map])

  const values = useCallback(() => Array.from(map.values()), [map])

  const set = useCallback(
    (key: K, value: V): Map<K, V> => {
      const newMap = new Map(map)
      newMap.set(key, value)
      setMap(newMap)
      return newMap
    },
    [map]
  )

  const remove = useCallback(
    (key: K): boolean => {
      const newMap = new Map(map)
      const result = newMap.delete(key)
      setMap(newMap)
      return result
    },
    [map]
  )

  const clear = useCallback((): void => {
    setMap(new Map())
  }, [])

  const entries = useCallback(() => Array.from(map.entries()), [map])

  return { map, get, has, keys, values, set, remove, clear, entries }
}
