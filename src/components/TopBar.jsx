import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FiBell,
  FiCalendar,
  FiChevronDown,
  FiGrid,
  FiMenu,
  FiMessageCircle,
  FiMoon,
  FiSearch,
  FiSun,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'

const TopBar = ({ onToggleSidebar = () => {}, isSidebarOpen = false }) => {
  const { isDark, toggleTheme } = useTheme()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isCompact, setIsCompact] = useState(false)
  const [isSolid, setIsSolid] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const searchInputRef = useRef(null)
  const searchToggleRef = useRef(null)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      const progress = Math.min(Math.max(y / 420, 0), 1)

      setScrollProgress(progress)
      setIsCompact(y > 36)
      setIsSolid(y > 260)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 768px)')

    const updateMatches = () => {
      setIsMobile(mediaQuery.matches)
    }

    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)

    return () => {
      mediaQuery.removeEventListener('change', updateMatches)
    }
  }, [])

  useEffect(() => {
    const heroBreak = 38 - scrollProgress * 16
    document.body.style.setProperty('--hero-breakpoint', `${heroBreak}%`)

  }, [scrollProgress])

  useEffect(() => {
    return () => {
      document.body.style.removeProperty('--hero-breakpoint')
    }
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const id = requestAnimationFrame(() => searchInputRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }

    if (!isSearchOpen) {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true
        return
      }

      searchToggleRef.current?.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (!isSearchOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev)
  }, [])

  const headerClassName = useMemo(() => {
    return [
      'topbar',
      'topbar--hero',
      isCompact ? 'is-compact' : '',
      isSolid ? 'is-solid' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }, [isCompact, isSolid])

  const progressScale = useMemo(() => Math.min(Math.max(scrollProgress, 0), 1), [scrollProgress])

  const searchClassName = useMemo(() => {
    return [
      'topbar__search',
      isSearchOpen ? 'is-open' : '',
      isMobile ? 'topbar__search--mobile' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }, [isMobile, isSearchOpen])

  const searchNode = (
    <div className={searchClassName}>
      <button
        type="button"
        ref={searchToggleRef}
        className="topbar__search-toggle"
        aria-label={isSearchOpen ? 'إغلاق البحث' : 'فتح البحث'}
        onClick={toggleSearch}
      >
        {isSearchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
      </button>
      <input
        ref={searchInputRef}
        type="search"
        className="topbar__search-input"
        placeholder="بحث سريع..."
        aria-hidden={!isSearchOpen}
      />
      <kbd className="topbar__shortcut" aria-hidden={!isSearchOpen}>
        ⌘K
      </kbd>
    </div>
  )

  return (
    <header className={headerClassName} style={{ '--scroll-progress': scrollProgress }}>
      <div className="topbar__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progressScale})` }} />
      </div>
      <div className={`topbar__row${isMobile ? ' topbar__row--mobile' : ''}`}>
        {isMobile ? (
          <>
            <div className="topbar__mobile-bar">
              <button
                type="button"
                className={`topbar__menu${isSidebarOpen ? ' is-active' : ''}`}
                aria-label={isSidebarOpen ? 'إغلاق القائمة الجانبية' : 'فتح القائمة الجانبية'}
                aria-controls="app-sidebar"
                aria-expanded={isSidebarOpen}
                onClick={onToggleSidebar}
              >
                <FiMenu size={20} />
              </button>
              <h1 className="topbar__mobile-title">التقرير العام</h1>
              <div className="topbar__mobile-actions">
                {searchNode}
                <button
                  type="button"
                  className="topbar__round topbar__round--compact"
                  aria-label={isDark ? 'الوضع الفاتح' : 'الوضع الليلي'}
                  onClick={toggleTheme}
                >
                  {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
                <button type="button" className="topbar__avatar" aria-label="الملف الشخصي">
                  <FiUser size={18} />
                </button>
              </div>
            </div>
            <div className="topbar__mobile-tools">
              <div className="topbar__quick-actions topbar__quick-actions--mobile" role="group">
                <button type="button" className="topbar__round topbar__round--compact" aria-label="عرض الشبكة">
                  <FiGrid size={18} />
                </button>
                <button type="button" className="topbar__round topbar__round--compact" aria-label="الرسائل">
                  <FiMessageCircle size={18} />
                </button>
                <button type="button" className="topbar__round topbar__round--compact" aria-label="الإشعارات">
                  <FiBell size={18} />
                  <span className="topbar__badge">3</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="topbar__breadcrumbs">
              <span>التطبيق</span>
              <span className="topbar__chevron">›</span>
              <span>لوحات التحكم</span>
              <span className="topbar__chevron">›</span>
              <strong>التقرير العام</strong>
            </div>
            <div className="topbar__actions">
              <div className="topbar__quick-actions" role="group">
                <button type="button" className="topbar__round" aria-label="عرض الشبكة">
                  <FiGrid size={18} />
                </button>
                <button type="button" className="topbar__round" aria-label="الرسائل">
                  <FiMessageCircle size={18} />
                </button>
                <button type="button" className="topbar__round" aria-label="الإشعارات">
                  <FiBell size={18} />
                  <span className="topbar__badge">3</span>
                </button>
                <button type="button" className="topbar__round" aria-label="التقويم">
                  <FiCalendar size={18} />
                </button>
                <button
                  type="button"
                  className="topbar__round"
                  aria-label={isDark ? 'الوضع الفاتح' : 'الوضع الليلي'}
                  onClick={toggleTheme}
                >
                  {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
                <button type="button" className="topbar__profile">
                  <FiUser size={18} />
                  <span>سالي</span>
                  <FiChevronDown size={16} />
                </button>
              </div>
              {searchNode}
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default TopBar



