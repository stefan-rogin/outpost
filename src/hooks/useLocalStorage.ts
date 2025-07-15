import { useState, useEffect, useRef } from "react"

export const useLocalStorage = (
  key: string
): [string, (newValue: string) => void] => {
  const isMounted = useRef(false)
  const [value, setValue] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key) || ""
    }
    return ""
  })

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value)
      }
    }
  }, [key, value])

  return [value, setValue]
}
