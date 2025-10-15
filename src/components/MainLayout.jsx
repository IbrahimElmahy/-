import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const sidebarItems = [
  { type: 'title', label: 'الرئيسية' },
  { type: 'link', path: '/dashboard', icon: 'fe-airplay', label: 'لوحة التحكم' },

  { type: 'title', label: 'إدارة الحجوزات' },
  {
    type: 'group',
    id: 'sidebar-apartment',
    icon: 'fe-calendar',
    label: 'الشقق',
    children: [
      { icon: 'mdi mdi-24px mdi-bag-carry-on-check', label: 'تسجيل الدخول', path: '/apartments/checkin' },
      { icon: 'mdi mdi-24px mdi-bag-carry-on-off', label: 'تسجيل الخروج', path: '/apartments/checkout' },
      { icon: 'mdi mdi-24px mdi-bag-carry-on', label: 'قائمة الشقق', path: '/apartments/list' },
    ],
  },
  { type: 'link', path: '/reservations', icon: 'fe-briefcase', label: 'الحجوزات' },
  { type: 'link', path: '/orders', icon: 'fe-shopping-cart', label: 'الطلبات' },

  { type: 'title', label: 'الإدارة المالية' },
  {
    type: 'group',
    id: 'sidebar-vouchers',
    icon: 'fe-server',
    label: 'السندات والفواتير',
    children: [
      { icon: 'mdi mdi-18px mdi-receipt', label: 'سندات القبض', path: '/finance/receipt-vouchers' },
      { icon: 'mdi mdi-18px mdi-file-cog', label: 'سندات الصرف', path: '/finance/payment-vouchers' },
      { icon: 'mdi mdi-18px mdi-file-table-outline', label: 'الفواتير', path: '/finance/invoices' },
    ],
  },

  { type: 'title', label: 'إدارة النزلاء' },
  { type: 'link', path: '/guests', icon: 'fe-users', label: 'النزلاء' },
  { type: 'link', path: '/agents', icon: 'fe-activity', label: 'وكلاء الحجز' },

  { type: 'title', label: 'أخرى' },
  { type: 'link', path: '/reports', icon: 'fe-pie-chart', label: 'التقارير' },
  { type: 'link', path: '/archives', icon: 'fe-archive', label: 'الأرشيف' },
  { type: 'link', path: '/notifications', icon: 'fe-send', label: 'الإشعارات' },
  { type: 'link', path: '/settings', icon: 'fe-settings', label: 'الإعدادات' },
  { type: 'action', icon: 'fe-log-out', label: 'تسجيل الخروج', action: 'logout' },
];

const scriptsToInject = [
  '/assets/js/vendor.min.js',
  '/assets/libs/csrf/js/csrf.min.js',
  '/assets/libs/jquery/jquery-ui.min.js',
  '/assets/libs/jquery-toast-plugin/jquery.toast.min.js',
  '/assets/libs/sweetalert2/sweetalert2.min.js',
  '/assets/libs/jquery-from/jquery.form.min.js',
  '/assets/libs/jquery-validation/jquery.validate.js',
  '/assets/libs/jquery-validation/additional-methods.js',
  '/assets/libs/jquery-validation/jquery.validate.default.js',
  '/assets/libs/jquery-validation/l10n/ar.js',
  '/assets/libs/intl-tel-input/js/intl-tel-Input.min.js',
  '/assets/libs/intl-tel-input/js/phone.init.min.js',
  '/assets/libs/datatables.net/js/jquery.dataTables.min.js',
  '/assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
  '/assets/libs/datatables.net-responsive/js/dataTables.responsive.min.js',
  '/assets/libs/datatables.net-responsive-bs4/js/responsive.bootstrap4.min.js',
  '/assets/libs/jquery-datatables-checkboxes/js/dataTables.checkboxes.min.js',
  '/assets/libs/select2/js/select2.min.js',
  '/assets/libs/flatpickr/flatpickr.min.js',
  '/assets/libs/flatpickr/l10n/ar.js',
  '/assets/libs/mohithg-switchery/switchery.min.js',
  '/assets/libs/jquery.counterup/jquery.counterup.min.js',
  '/assets/libs/moment/moment.js',
  '/assets/libs/moment/moment-timezone.min.js',
  '/assets/libs/moment/locale/ar.js',
  '/assets/js/component/datetime.js',
  '/assets/js/component/ajax.js',
  '/assets/js/component/modal.js',
  '/assets/js/component/toast.js',
  '/assets/js/component/form.js',
  '/assets/js/component/sweetalert.js',
  '/assets/js/component/table.js',
  '/assets/js/component/iframe.js',
  '/assets/js/component/select.js',
  '/assets/js/component/pagination.js',
  '/assets/js/component/color.js',
  '/assets/libs/raphael/raphael.min.js',
  '/assets/libs/morris.js06/morris.min.js',
  '/assets/js/component/stats.js',
  '/assets/js/app.js',
  '/assets/js/dashboard.js',
  '/assets/js/script.js',
  '/assets/js/pages/hotel/index.init.js',
];

const statsMockData = {
  'numeric-stats': {
    arrivals_total: 0,
    checkin_registered: 0,
    departures_total: 0,
    checkout_registered: 0,
  },
  'apartment-availabilities-donut-chart': [
    { label: 'متاحة', value: 0 },
    { label: 'محجوزة', value: 0 },
  ],
  'apartment-bar-chart': {
    apartment_this_week: [0, 0, 0, 0, 0, 0, 0],
    apartment_this_month: new Array(30).fill(0),
    apartment_this_year: new Array(12).fill(0),
  },
  'apartment-cleanliness-donut-chart': [
    { label: 'نظيفة', value: 0 },
    { label: 'غير نظيفة', value: 0 },
  ],
  'reservation-bar-chart': {
    reservation_this_week: [0, 0, 0, 0, 0, 0, 0],
    reservation_this_month: new Array(30).fill(0),
    reservation_this_year: new Array(12).fill(0),
  },
  'reservation-donut-chart': [
    { label: 'تسجيل الخروج', value: 0 },
    { label: 'تسجيل الدخول', value: 0 },
    { label: 'إلغاءات', value: 0 },
  ],
};

const normalizePath = (path) => {
  if (!path) return '';
  if (path.length > 1 && path.endsWith('/')) {
    return path.replace(/\/+$/, '');
  }
  return path;
};

const pathMatches = (current, target) => {
  const normalizedTarget = normalizePath(target);
  if (!normalizedTarget) return false;
  if (normalizedTarget === '/') {
    return current === '/';
  }
  return current === normalizedTarget || current.startsWith(`${normalizedTarget}/`);
};

const applyMockStats = () => {
  if (typeof window === 'undefined' || !window.Stats) {
    return;
  }

  const originalCallEndpoint = window.Stats.callEndpoint?.bind(window.Stats);

  window.Stats.callEndpoint = (element, success, error) => {
    if (!element) {
      if (originalCallEndpoint) {
        originalCallEndpoint(element, success, error);
      }
      return;
    }

    const dataVariable = element.data ? element.data('variable') : undefined;
    const elementId = element.attr ? element.attr('id') : undefined;

    if (dataVariable && statsMockData[dataVariable]) {
      success?.(statsMockData[dataVariable]);
      return;
    }

    if (elementId && statsMockData[elementId]) {
      success?.(statsMockData[elementId]);
      return;
    }

    if (originalCallEndpoint) {
      originalCallEndpoint(element, success, error);
    } else if (error) {
      error(new Error('No mock data available'));
    }
  };
};

const ensureI18nStubs = () => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!window.gettext) {
    window.gettext = (message) => message;
  }
  if (!window.ngettext) {
    window.ngettext = (singular, plural, count) => (count === 1 ? singular : plural);
  }
  if (!window.pgettext) {
    window.pgettext = (_context, message) => message;
  }
  if (!window.interpolate) {
    window.interpolate = (format, params) => {
      if (Array.isArray(params)) {
        let index = 0;
        return format.replace(/%s/g, () => (typeof params[index] !== 'undefined' ? params[index++] : ''));
      }
      return format.replace(/%\(([^)]+)\)s/g, (_, key) => (params && typeof params[key] !== 'undefined' ? params[key] : ''));
    };
  }
};

const ensureHumanizeStub = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const fallback = {
    intComma: (value) => {
      if (value === null || value === undefined) {
        return '0';
      }
      const numeric = Number(value);
      if (Number.isFinite(numeric)) {
        return numeric.toLocaleString('en-US');
      }
      const numericString = `${value}`;
      const parts = numericString.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    },
    compactInteger: (value, precision = 1) => {
      if (value === null || value === undefined) {
        return '0';
      }
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        return `${value}`;
      }
      const abs = Math.abs(numeric);
      const units = [
        { value: 1e12, suffix: 'T' },
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' },
      ];
      for (const unit of units) {
        if (abs >= unit.value) {
          const formatted = (numeric / unit.value).toFixed(precision);
          return `${Number(formatted).toString()}${unit.suffix}`;
        }
      }
      return numeric.toString();
    },
  };

  if (!window.Humanize) {
    window.Humanize = fallback;
  } else {
    window.Humanize.intComma = window.Humanize.intComma || fallback.intComma;
    window.Humanize.compactInteger = window.Humanize.compactInteger || fallback.compactInteger;
  }
};

const ensureEModalStub = () => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const applyStub = () => {
    const $ = window.jQuery || window.$;
    if (!$) {
      return false;
    }
    if ($.eModal) {
      return true;
    }
    $.eModal = {
      size: {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      },
      iframe: () => Promise.resolve(),
      confirm: () => Promise.resolve(true),
    };
    return true;
  };

  if (applyStub()) {
    return () => {};
  }

  const interval = window.setInterval(() => {
    if (applyStub()) {
      window.clearInterval(interval);
    }
  }, 50);

  const timeout = window.setTimeout(() => {
    window.clearInterval(interval);
  }, 4000);

  return () => {
    window.clearInterval(interval);
    window.clearTimeout(timeout);
  };
};

const ensureLegacyStubs = () => {
  ensureHumanizeStub();
  return ensureEModalStub();
};

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = normalizePath(location.pathname);
  const hoverTimeoutRef = useRef(null);

  const changeSidebarSize = useCallback((size) => {
    if (typeof document === 'undefined') {
      return;
    }

    const layoutApp = window.$?.LayoutThemeApp;

    if (layoutApp?.leftSidebar?.changeSize) {
      layoutApp.leftSidebar.changeSize(size);
      return;
    }

    if (size) {
      document.body.setAttribute('data-sidebar-size', size);
    } else {
      document.body.removeAttribute('data-sidebar-size');
    }
  }, []);

  const collapseSidebar = useCallback(() => {
    changeSidebarSize('condensed');
  }, [changeSidebarSize]);

  const expandSidebar = useCallback(() => {
    changeSidebarSize('default');
  }, [changeSidebarSize]);

  const handleRightBarToggle = useCallback((event) => {
    if (event) {
      event.preventDefault();
    }

    const $ = window.jQuery || window.$;

    if ($?.RightBar?.toggleRightSideBar) {
      $.RightBar.toggleRightSideBar();
      return;
    }

    if ($?.LayoutThemeApp?.rightBar?.toggleRightSideBar) {
      $.LayoutThemeApp.rightBar.toggleRightSideBar();
      return;
    }

    document.body.classList.toggle('right-bar-enabled');
  }, []);

  const handleSidebarMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (document.body.getAttribute('data-sidebar-size') !== 'default') {
      expandSidebar();
    }
  }, [expandSidebar]);

  const handleSidebarMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      if (!document.body.classList.contains('right-bar-enabled')) {
        collapseSidebar();
      }
      hoverTimeoutRef.current = null;
    }, 200);
  }, [collapseSidebar]);

  const activeMap = useMemo(() => {
    const map = new Map();
    sidebarItems.forEach((item) => {
      if (item.type === 'link' && item.path) {
        map.set(item.path, pathMatches(currentPath, item.path));
      }
      if (item.type === 'group' && item.children) {
        item.children.forEach((child) => {
          if (child.path) {
            map.set(child.path, pathMatches(currentPath, child.path));
          }
        });
      }
    });
    return map;
  }, [currentPath]);

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    sidebarItems.forEach((item) => {
      if (item.type === 'group') {
        initial[item.id] = item.children?.some((child) => child.path && pathMatches(currentPath, child.path)) ?? false;
      }
    });
    return initial;
  });

  useEffect(() => {
    setOpenGroups((prev) => {
      const updated = { ...prev };
      sidebarItems.forEach((item) => {
        if (item.type === 'group') {
          const shouldOpen = item.children?.some((child) => child.path && pathMatches(currentPath, child.path)) ?? false;
          if (shouldOpen) {
            updated[item.id] = true;
          }
        }
      });
      return updated;
    });
  }, [currentPath]);

  useEffect(() => {
    ensureI18nStubs();
    const releaseLegacy = ensureLegacyStubs();

    const previousClassName = document.body.className;
    const previousLayout = document.body.getAttribute('data-layout');
    const previousSidebarSize = document.body.getAttribute('data-sidebar-size');

    document.body.classList.add('loading', 'dashboard-layout');
    document.body.setAttribute(
      'data-layout',
      JSON.stringify({
        mode: 'light',
        width: 'fluid',
        menuPosition: 'fixed',
        sidebar: { color: 'brand', size: 'default', showuser: true },
        topbar: { color: 'light' },
      }),
    );
    collapseSidebar();

    const appendedScripts = [];
    let indexInitLoaded = false;
    const loadSequentially = async () => {
      for (const src of scriptsToInject) {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if (src.includes('/assets/js/component/stats.js')) {
            applyMockStats();
          }
          if (src.includes('/assets/js/pages/admin/index.init.js')) {
            indexInitLoaded = true;
          }
        } else {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => {
              if (src.includes('/assets/js/component/stats.js')) {
                applyMockStats();
              }
              if (src.includes('/assets/js/pages/admin/index.init.js')) {
                indexInitLoaded = true;
              }
              resolve();
            };
            script.onerror = reject;
            document.body.appendChild(script);
            appendedScripts.push(script);
          });
        }
      }
    };

    applyMockStats();

    loadSequentially()
      .then(() => {
        applyMockStats();
        if (indexInitLoaded && window.WebServices && typeof window.WebServices.init === 'function') {
          window.WebServices.init();
        } else {
          setTimeout(() => {
            if (window.WebServices && typeof window.WebServices.init === 'function') {
              window.WebServices.init();
            }
            collapseSidebar();
          }, 400);
        }
        collapseSidebar();
      })
      .catch((error) => {
        console.error('فشل تحميل ملفات الواجهة التقليدية:', error);
      });

    return () => {
      releaseLegacy?.();
      appendedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      document.body.className = previousClassName;
      if (previousLayout) {
        document.body.setAttribute('data-layout', previousLayout);
      } else {
        document.body.removeAttribute('data-layout');
      }
      if (previousSidebarSize) {
        changeSidebarSize(previousSidebarSize);
      } else {
        const layoutApp = window.$?.LayoutThemeApp;
        if (layoutApp?.leftSidebar?.changeSize) {
          layoutApp.leftSidebar.changeSize('default');
        }
        document.body.removeAttribute('data-sidebar-size');
      }
    };
  }, [changeSidebarSize, collapseSidebar]);

  useEffect(
    () => () => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    },
    [],
  );

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('apiBaseUrl');
    localStorage.removeItem('apiLoginBaseUrl');
    navigate('/login');
  };

  const resolveIconClass = (icon) => {
    if (!icon) return '';
    if (icon.startsWith('mdi')) return icon;
    if (icon.startsWith('fe ')) return icon;
    if (icon.startsWith('fe-')) return `fe ${icon}`;
    return icon;
  };

  return (
    <div id="wrapper">
      {/* Topbar */}
      <div className="navbar-custom">
        <div className="container-fluid">
          <ul className="list-unstyled topnav-menu float-right mb-0">
            <li className="dropdown d-none d-lg-inline-block">
              <a className="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="fullscreen" href="#">
                <i className="fe-maximize noti-icon" />
              </a>
            </li>

            <li className="dropdown d-inline-block topbar-dropdown">
              <a
                className="nav-link dropdown-toggle arrow-none waves-effect waves-light"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <img src="/assets/images/flags/ar.jpg" alt="اللغة العربية" height="16" />
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="#" onClick={(event) => event.preventDefault()}>
                  <img src="/assets/images/flags/en.jpg" alt="English" className="mr-1" height="12" />
                  <span className="align-middle">English</span>
                </a>
              </div>
            </li>

            <li className="dropdown notification-list topbar-dropdown">
              <a
                className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <img src="/assets/images/users/user-1.jpg" alt="المستخدم" className="rounded-circle" />
                <span className="pro-user-name ml-1">
                  إدارة النظام
                  {' '}
                  <i className="mdi mdi-chevron-down" />
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-right profile-dropdown">
                <div className="dropdown-header noti-title">
                  <h6 className="text-overflow m-0">مرحبًا بك!</h6>
                </div>
                <a className="dropdown-item notify-item" href="#" onClick={(event) => event.preventDefault()}>
                  <i className="fe-user" />
                  <span>حسابي</span>
                </a>
                <a className="dropdown-item notify-item" href="#" onClick={(event) => event.preventDefault()}>
                  <i className="fe-settings" />
                  <span>الإعدادات</span>
                </a>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item notify-item" onClick={handleLogout}>
                  <i className="fe-log-out" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </li>

            <li className="dropdown notification-list">
              <a className="nav-link right-bar-toggle waves-effect waves-light" href="#" onClick={handleRightBarToggle}>
                <i className="fe-settings noti-icon" />
              </a>
            </li>
          </ul>

          <div className="logo-box">
            <Link to="/dashboard" className="logo logo-dark text-center">
              <span className="logo-sm">
                <img src="/assets/images/logo-sm.png" alt="Nozul" height="28" />
              </span>
              <span className="logo-lg">
                <img src="/assets/images/logo-dark.png" alt="Nozul" height="32" />
              </span>
            </Link>

            <Link to="/dashboard" className="logo logo-light text-center">
              <span className="logo-sm">
                <img src="/assets/images/logo-sm.png" alt="Nozul" height="28" />
              </span>
              <span className="logo-lg">
                <img src="/assets/images/logo-light.png" alt="Nozul" height="32" />
              </span>
            </Link>
          </div>

          <div className="clearfix" />
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="left-side-menu" onMouseEnter={handleSidebarMouseEnter} onMouseLeave={handleSidebarMouseLeave}>
        <div className="h-100" data-simplebar="init">
          <div className="sidebar-toggler">
            <span className="mdi mdi-chevron-double-left" id="sidebar-toggler" />
          </div>

          <div className="user-box text-center mt-3">
            <img src="/assets/images/users/user-1.jpg" alt="المستخدم" className="rounded-circle avatar-md" />
            <div className="dropdown">
              <a
                href="#"
                className="text-dark dropdown-toggle h5 mt-2 mb-1 d-block"
                data-toggle="dropdown"
                onClick={(event) => event.preventDefault()}
              >
                أحمد العتيبي
              </a>
              <div className="dropdown-menu user-pro-dropdown">
                <a className="dropdown-item notify-item" href="#" onClick={(event) => event.preventDefault()}>
                  <i className="fe-user mr-1" />
                  <span>الملف الشخصي</span>
                </a>
                <a className="dropdown-item notify-item" href="#" onClick={(event) => event.preventDefault()}>
                  <i className="fe-settings mr-1" />
                  <span>الإعدادات</span>
                </a>
                <button type="button" className="dropdown-item notify-item" onClick={handleLogout}>
                  <i className="fe-log-out mr-1" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
            <p className="text-muted mb-0">مدير النظام</p>
          </div>

          <div id="sidebar-menu">
            <ul id="side-menu">
              {sidebarItems.map((item, index) => {
                if (item.type === 'title') {
                  return (
                    <li key={`title-${index}`} className="menu-title">
                      {item.label}
                    </li>
                  );
                }

                if (item.type === 'link' && item.path) {
                  const isActive = activeMap.get(item.path);
                  return (
                    <li key={item.path} className={isActive ? 'menuitem-active' : ''}>
                      <Link to={item.path} className={isActive ? 'active' : ''} title={item.label}>
                        <i className={resolveIconClass(item.icon)} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                }

                if (item.type === 'group' && item.children) {
                  const isOpen = openGroups[item.id];
                  const hasActiveChild = item.children.some((child) => child.path && activeMap.get(child.path));
                  return (
                    <li key={item.id} className={hasActiveChild ? 'menuitem-active' : ''}>
                      <a
                        href={`#${item.id}`}
                        data-toggle="collapse"
                        className={isOpen ? '' : 'collapsed'}
                        aria-expanded={isOpen}
                        title={item.label}
                        onClick={(event) => {
                          event.preventDefault();
                          setOpenGroups((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }));
                        }}
                      >
                        <i className={resolveIconClass(item.icon)} />
                        <span>{item.label}</span>
                        <span className="menu-arrow" />
                      </a>
                      <div className={`collapse ${isOpen ? 'show' : ''}`} id={item.id}>
                        <ul className="nav-second-level">
                          {item.children.map((child, childIndex) => {
                            const childIconClass = resolveIconClass(child.icon);
                            const childActive = child.path ? activeMap.get(child.path) : false;
                            return (
                              <li key={`${item.id}-child-${childIndex}`} className={childActive ? 'menuitem-active' : ''}>
                                {child.path ? (
                                  <Link to={child.path} className={childActive ? 'active' : ''} title={child.label}>
                                    {childIconClass ? <i className={childIconClass} /> : null}
                                    <span>{child.label}</span>
                                  </Link>
                                ) : (
                                  <a href="#" onClick={(event) => event.preventDefault()} title={child.label}>
                                    {childIconClass ? <i className={childIconClass} /> : null}
                                    <span>{child.label}</span>
                                  </a>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </li>
                  );
                }

                if (item.type === 'action' && item.action === 'logout') {
                  return (
                    <li key={`action-${index}`}>
                      <a
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          handleLogout();
                        }}
                        title={item.label}
                      >
                        <i className={resolveIconClass(item.icon)} />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={`${item.icon}-${index}`}>
                    <a href="#" onClick={(event) => event.preventDefault()} title={item.label}>
                      <i className={resolveIconClass(item.icon)} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="clearfix" />
        </div>
      </div>

      {/* Content */}
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
        <footer className="footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="text-center text-muted">
                  NOZUL © جميع الحقوق محفوظة.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Right Sidebar */}
      <div className="right-bar">
        <div data-simplebar className="h-100">
          <ul className="nav nav-tabs nav-bordered nav-justified" role="tablist">
            <li className="nav-item">
              <a className="nav-link py-2 active" data-toggle="tab" href="#settings-tab" role="tab">
                <i className="mdi mdi-cog-outline d-block font-22 my-1" />
              </a>
            </li>
          </ul>

          <div className="tab-content pt-0">
            <div className="tab-pane active" id="settings-tab" role="tabpanel">
              <h6 className="font-weight-medium px-3 m-0 py-2 font-13 text-uppercase bg-light">
                <span className="d-block py-1">إعدادات الواجهة</span>
              </h6>

              <div className="p-3">
                <div className="alert alert-warning" role="alert">
                  <strong>تحكم</strong>
                  {' '}
                  في ألوان الواجهة والمكونات الجانبية.
                </div>

                <h6 className="font-weight-medium font-14 mt-4 mb-2 pb-1">وضع الألوان</h6>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="color-scheme-mode" value="light" id="light-mode-check" defaultChecked />
                  <label className="custom-control-label" htmlFor="light-mode-check">إضاءة</label>
                </div>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="color-scheme-mode" value="dark" id="dark-mode-check" />
                  <label className="custom-control-label" htmlFor="dark-mode-check">داكن</label>
                </div>

                <h6 className="font-weight-medium font-14 mt-4 mb-2 pb-1">العرض</h6>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="width" value="fluid" id="fluid-check" defaultChecked />
                  <label className="custom-control-label" htmlFor="fluid-check">ممتد</label>
                </div>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="width" value="boxed" id="boxed-check" />
                  <label className="custom-control-label" htmlFor="boxed-check">صندوقي</label>
                </div>

                <h6 className="font-weight-medium font-14 mt-4 mb-2 pb-1">موضع القوائم</h6>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="menus-position" value="fixed" id="fixed-check" defaultChecked />
                  <label className="custom-control-label" htmlFor="fixed-check">ثابت</label>
                </div>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="menus-position" value="scrollable" id="scrollable-check" />
                  <label className="custom-control-label" htmlFor="scrollable-check">قابل للتمرير</label>
                </div>

                <h6 className="font-weight-medium font-14 mt-4 mb-2 pb-1">لون الشريط الجانبي</h6>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="leftsidebar-color" value="light" id="light-check" defaultChecked />
                  <label className="custom-control-label" htmlFor="light-check">فاتح</label>
                </div>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="leftsidebar-color" value="dark" id="dark-check" />
                  <label className="custom-control-label" htmlFor="dark-check">داكن</label>
                </div>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="leftsidebar-color" value="brand" id="brand-check" />
                  <label className="custom-control-label" htmlFor="brand-check">لون العلامة</label>
                </div>
                <div className="custom-control custom-switch mb-3">
                  <input type="radio" className="custom-control-input" name="leftsidebar-color" value="gradient" id="gradient-check" />
                  <label className="custom-control-label" htmlFor="gradient-check">متدرج</label>
                </div>

                <h6 className="font-weight-medium font-14 mt-4 mb-2 pb-1">حجم الشريط الجانبي</h6>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="leftsidebar-size" value="default" id="default-size-check" defaultChecked />
                  <label className="custom-control-label" htmlFor="default-size-check">افتراضي</label>
                </div>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="leftsidebar-size" value="condensed" id="condensed-check" />
                  <label className="custom-control-label" htmlFor="condensed-check">مصغر</label>
                </div>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="leftsidebar-size" value="compact" id="compact-check" />
                  <label className="custom-control-label" htmlFor="compact-check">مضغوط</label>
                </div>

                <h6 className="font-weight-medium font-14 mt-4 mb-2 pb-1">معلومات المستخدم في الشريط الجانبي</h6>
                <div className="custom-control custom-switch mb-1">
                  <input type="checkbox" className="custom-control-input" name="leftsidebar-user" value="fixed" id="sidebaruser-check" />
                  <label className="custom-control-label" htmlFor="sidebaruser-check">تفعيل</label>
                </div>

                <h6 className="font-weight-medium font-14 mt-4 mb-2 pb-1">الشريط العلوي</h6>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="topbar-color" value="dark" id="darktopbar-check" defaultChecked />
                  <label className="custom-control-label" htmlFor="darktopbar-check">داكن</label>
                </div>
                <div className="custom-control custom-switch mb-1">
                  <input type="radio" className="custom-control-input" name="topbar-color" value="light" id="lighttopbar-check" />
                  <label className="custom-control-label" htmlFor="lighttopbar-check">فاتح</label>
                </div>

                <button className="btn btn-primary btn-block mt-4" type="button" id="resetBtn">
                  استعادة الإعدادات الافتراضية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rightbar-overlay" onClick={handleRightBarToggle} />
    </div>
  );
}

export default MainLayout;
