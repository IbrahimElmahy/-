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
  FiSettings,
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
  const [isCompactLayout, setIsCompactLayout] = useState(false)
  const [isPhoneLayout, setIsPhoneLayout] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const searchInputRef = useRef(null)
  const searchToggleRef = useRef(null)
  const hasMountedRef = useRef(false)
  const settingsRef = useRef(null)

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

    const updateLayout = () => {
      const width = window.innerWidth
      const compact = width <= 1200
      const phone = width <= 768

      setIsCompactLayout(compact)
      setIsPhoneLayout(phone)
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
    }
  }, [])

  useEffect(() => {
    if (!isCompactLayout) {
      setIsSettingsOpen(false)
    }
  }, [isCompactLayout])

  useEffect(() => {
    if (isCompactLayout) {
      setIsSearchOpen(false)
    }
  }, [isCompactLayout])

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

  useEffect(() => {
    if (isSearchOpen) {
      setIsSettingsOpen(false)
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (!isSettingsOpen) return

    const handlePointerDown = (event) => {
      if (!settingsRef.current?.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSettingsOpen])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev)
  }, [])

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev)
  }, [])

  const handleThemeToggle = useCallback(() => {
    toggleTheme()
    setIsSettingsOpen(false)
  }, [toggleTheme])

  const handleSettingsItemClick = useCallback(() => {
    setIsSettingsOpen(false)
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
      isPhoneLayout ? 'topbar__search--mobile' : '',
      !isPhoneLayout && isCompactLayout ? 'topbar__search--tablet' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }, [isCompactLayout, isPhoneLayout, isSearchOpen])

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

  const rowClassName = useMemo(() => {
    return [
      'topbar__row',
      isCompactLayout ? 'topbar__row--compact' : '',
      isPhoneLayout ? 'topbar__row--mobile' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }, [isCompactLayout, isPhoneLayout])

  return (
    <header className={headerClassName} style={{ '--scroll-progress': scrollProgress }}>
      <div className="topbar__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progressScale})` }} />
      </div>
      <div className={rowClassName}>
        {isCompactLayout ? (
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
                <div className="topbar__settings" ref={settingsRef}>
                  <button
                    type="button"
                    className={`topbar__round topbar__round--compact topbar__settings-toggle${
                      isSettingsOpen ? ' is-open' : ''
                    }`}
                    aria-haspopup="true"
                    aria-expanded={isSettingsOpen}
                    aria-controls="topbar-settings-panel"
                    onClick={toggleSettings}
                    aria-label={isSettingsOpen ? 'إغلاق إعدادات العنوان' : 'فتح إعدادات العنوان'}
                  >
                    <FiSettings size={18} />
                  </button>
                  <div
                    id="topbar-settings-panel"
                    className={`topbar__settings-panel${isSettingsOpen ? ' is-visible' : ''}`}
                    role="menu"
                  >
                    <div className="topbar__settings-group" role="none">
                      <span className="topbar__settings-title">بحث سريع</span>
                      <div className="topbar__settings-search">
                        <FiSearch size={18} aria-hidden="true" />
                        <input type="search" aria-label="ابحث في النظام" placeholder="ابحث في النظام..." />
                      </div>
                    </div>
                    <div className="topbar__settings-group" role="none">
                      <span className="topbar__settings-title">إجراءات سريعة</span>
                      <button
                        type="button"
                        className="topbar__settings-item"
                        role="menuitem"
                        aria-label="اختصارات لوحة التحكم"
                        onClick={handleSettingsItemClick}
                      >
                        <FiGrid size={18} />
                        <span>اختصارات</span>
                      </button>
                      <button
                        type="button"
                        className="topbar__settings-item"
                        role="menuitem"
                        aria-label="الرسائل الواردة"
                        onClick={handleSettingsItemClick}
                      >
                        <FiMessageCircle size={18} />
                        <span>الرسائل</span>
                      </button>
                      <button
                        type="button"
                        className="topbar__settings-item"
                        role="menuitem"
                        aria-label="التنبيهات الجديدة"
                        onClick={handleSettingsItemClick}
                      >
                        <FiBell size={18} />
                        <span>الإشعارات</span>
                        <span className="topbar__settings-badge">3</span>
                      </button>
                      <button
                        type="button"
                        className="topbar__settings-item"
                        role="menuitem"
                        aria-label="مواعيد التقويم"
                        onClick={handleSettingsItemClick}
                      >
                        <FiCalendar size={18} />
                        <span>التقويم</span>
                      </button>
                    </div>
                    <div className="topbar__settings-group" role="none">
                      <span className="topbar__settings-title">المظهر والحساب</span>
                      <button
                        type="button"
                        className="topbar__settings-item"
                        role="menuitem"
                        aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الليلي'}
                        onClick={handleThemeToggle}
                      >
                        {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                        <span>{isDark ? 'الوضع الفاتح' : 'الوضع الليلي'}</span>
                      </button>
                      <button
                        type="button"
                        className="topbar__settings-item"
                        role="menuitem"
                        aria-label="الملف الشخصي"
                        onClick={handleSettingsItemClick}
                      >
                        <FiUser size={18} />
                        <span>حسابي</span>
                      </button>
                    </div>
                  </div>
                </div>
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



