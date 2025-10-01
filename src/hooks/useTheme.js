import { useCallback, useEffect, useMemo, useState } from 'react'

const THEME_STORAGE_KEY = 'dashboard-theme'

const getPreferredTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useTheme = () => {
  const [theme, setTheme] = useState(() => getPreferredTheme())

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') return
      setTheme(event.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const isDark = useMemo(() => theme === 'dark', [theme])

  return { theme, isDark, toggleTheme }
}
