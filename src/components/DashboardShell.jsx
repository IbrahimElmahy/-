import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Dashboard from '../pages/Dashboard'

const DashboardShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 1200px)')

    const handleChange = () => {
      const mobileMatch = mediaQuery.matches
      setIsMobile(mobileMatch)
      if (!mobileMatch) {
        setIsSidebarOpen(false)
      }
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    if (isMobile && isSidebarOpen) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }

    if (!isSidebarOpen) {
      document.body.style.overflow = ''
    }

    return undefined
  }, [isMobile, isSidebarOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (!isMobile || !isSidebarOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobile, isSidebarOpen])

  const toggleSidebar = () => {
    if (!isMobile) return
    setIsSidebarOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className={`app-shell${isSidebarOpen ? ' is-sidebar-open' : ''}`}>
      <Sidebar isMobile={isMobile} isMobileOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="app-content">
        <TopBar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <Dashboard />
      </main>
    </div>
  )
}

export default DashboardShell
