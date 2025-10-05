import {
  FiBarChart2,
  FiCalendar,
  FiFolder,
  FiLayers,
  FiSettings,
  FiShield,
  FiUsers,
  FiHelpCircle,
  FiLogOut,
  FiX,
} from 'react-icons/fi'

const primaryMenu = [
  { id: 'overview', icon: FiBarChart2, label: 'نظرة عامة', active: true },
  { id: 'wallet', icon: FiLayers, label: 'المحفظة' },
  { id: 'bookings', icon: FiCalendar, label: 'الحجوزات' },
  { id: 'clients', icon: FiUsers, label: 'العملاء' },
  { id: 'files', icon: FiFolder, label: 'الملفات' },
  { id: 'security', icon: FiShield, label: 'الأمان' },
]

const utilityMenu = [
  { id: 'help', icon: FiHelpCircle, label: 'المساعدة' },
  { id: 'settings', icon: FiSettings, label: 'الإعدادات' },
  { id: 'logout', icon: FiLogOut, label: 'تسجيل الخروج' },
]

const Sidebar = ({ isMobile, isMobileOpen, onClose }) => {
  const sidebarClassName = [
    'sidebar',
    'sidebar--compact',
    isMobile ? 'sidebar--drawer' : '',
    isMobile && isMobileOpen ? 'sidebar--mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {isMobile ? (
        <div
          className={`sidebar__backdrop${isMobileOpen ? ' is-visible' : ''}`}
          aria-hidden="true"
          onClick={onClose}
        />
      ) : null}
      <aside
        id="app-sidebar"
        className={sidebarClassName}
        aria-label="القائمة الرئيسية"
        aria-hidden={isMobile ? !isMobileOpen : false}
      >
        <div className="sidebar__top">
          <div className="sidebar__brand-icon" aria-label="الشعار">
            <img src="/logo-sm.png" alt="شعار النظام" />
          </div>
          {isMobile ? (
            <button type="button" className="sidebar__close" aria-label="إغلاق القائمة" onClick={onClose}>
              <FiX size={18} />
            </button>
          ) : null}
        </div>

        <span className="sidebar__separator" aria-hidden="true" />
        <nav className="sidebar__nav" aria-label="القائمة الرئيسية">
          {primaryMenu.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                className={`sidebar__icon-button${item.active ? ' is-active' : ''}`}
                aria-label={item.label}
              >
                <span className="sidebar__icon-indicator" aria-hidden="true" />
                <Icon size={20} />
                <span className="sidebar__label">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <span className="sidebar__separator sidebar__separator--muted" aria-hidden="true" />
        <div className="sidebar__bottom" aria-label="خيارات إضافية">
          {utilityMenu.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                className="sidebar__icon-button"
                title={item.label}
                aria-label={item.label}
              >
                <span className="sidebar__icon-indicator" aria-hidden="true" />
                <Icon size={20} />
                <span className="sidebar__label">{item.label}</span>
              </button>
            )
          })}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
