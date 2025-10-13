import { useEffect } from 'react';

const preventDefault = (event) => {
  event.preventDefault();
};

const summaryCards = [
  {
    id: 'arrivals-total',
    variable: 'arrivals_total',
    title: 'الواصلين',
    icon: 'mdi mdi-heart-outline',
    bgClass: 'bg-primary',
  },
  {
    id: 'checkin-registered',
    variable: 'checkin_registered',
    title: 'مسجلين الدخول',
    icon: 'fe-log-in',
    bgClass: 'bg-success',
  },
  {
    id: 'departures-total',
    variable: 'departures_total',
    title: 'المغادرين',
    icon: 'fe-airplay',
    bgClass: 'bg-info',
  },
  {
    id: 'checkout-registered',
    variable: 'checkout_registered',
    title: 'مسجلين الخروج',
    icon: 'mdi mdi-exit-run',
    bgClass: 'bg-warning',
  },
];

const availabilityCounters = ['متاحة', 'محجوزة'];
const apartmentMetricLabels = ['إحصاءات أسبوعية', 'إحصاءات شهرية', 'إحصاءات سنوية'];
const cleanlinessCounters = ['نظيفة', 'غير نظيفة'];
const reservationStatusCounters = ['تسجيل الخروج', 'تسجيل الدخول', 'إلغاءات'];
const reservationMetricLabels = ['إحصاءات أسبوعية', 'إحصاءات شهرية', 'إحصاءات سنوية'];

function DashboardPage() {
  useEffect(() => {
    const triggerDashboardInit = () => {
      if (window.WebServices && typeof window.WebServices.init === 'function') {
        window.WebServices.init();
      }
    };

    triggerDashboardInit();
    const timer = setTimeout(triggerDashboardInit, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="dashboard-page container-fluid" dir="rtl">
      <div className="row mb-3">
        <div className="col-12">
          <div className="page-title-box">
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item active">لوحة التحكم</li>
                <li className="breadcrumb-item active">نزلكم</li>
              </ol>
            </div>
            <h4 className="page-title">نزلكم</h4>
          </div>
        </div>
      </div>

      <div id="numeric-stats" className="row g-3 g-xl-4 mb-4" data-url="/mock/api/numeric-stats">
        {summaryCards.map((card) => (
          <div className="col-12 col-sm-6 col-xl-3" key={card.id}>
            <div className="card summary-card h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="summary-card-value mb-1">
                    <span data-plugin="counterup" data-variable={card.variable}>0</span>
                  </h3>
                  <p className="summary-card-label text-muted mb-0">{card.title}</p>
                </div>
                <div className={`summary-card-icon ${card.bgClass}`}>
                  <i className={card.icon} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-body" dir="ltr">
              <div className="card-widgets">
                <a href="#" data-toggle="reload" onClick={preventDefault}><i className="mdi mdi-refresh" /></a>
                <a
                  href="#apartment-availabilities-donut-chart-collapse"
                  data-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="apartment-availabilities-donut-chart-collapse"
                >
                  <i className="mdi mdi-minus" />
                </a>
                <a href="#" data-toggle="remove" onClick={preventDefault}><i className="mdi mdi-close" /></a>
              </div>
              <h4 className="header-title text-uppercase mb-0">إتاحة الشقق</h4>

              <div id="apartment-availabilities-donut-chart-collapse" className="collapse pt-3 show">
                <div className="text-center">
                  <div className="row mt-2">
                    {availabilityCounters.map((label) => (
                      <div className="col-6" key={label}>
                        <h3 data-plugin="counterup">0</h3>
                        <p className="text-muted font-13 mb-0 text-uppercase text-truncate">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div
                    id="apartment-availabilities-donut-chart"
                    data-url="/mock/api/apartment-availabilities"
                    data-colors="#00acc1,#f1556c"
                    className="morris-chart mt-3"
                    style={{ height: '270px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-body" dir="ltr">
              <div className="card-widgets">
                <a href="#" data-toggle="reload" onClick={preventDefault}><i className="mdi mdi-refresh" /></a>
                <a
                  href="#apartment-bar-chart-collapse"
                  data-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="apartment-bar-chart-collapse"
                >
                  <i className="mdi mdi-minus" />
                </a>
                <a href="#" data-toggle="remove" onClick={preventDefault}><i className="mdi mdi-close" /></a>
              </div>
              <h4 className="header-title text-uppercase mb-0">إحصاءات الشقق</h4>

              <div id="apartment-bar-chart-collapse" className="collapse pt-3 show">
                <div className="text-center">
                  <div className="row mt-2">
                    {apartmentMetricLabels.map((label) => (
                      <div className="col-4" key={label}>
                        <h3 data-plugin="counterup">0</h3>
                        <p className="text-muted font-13 mb-0 text-uppercase text-truncate">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div
                    id="apartment-bar-chart"
                    data-url="/mock/api/apartment-bar"
                    data-colors="#6658dd"
                    data-labels="الشقق"
                    className="morris-chart mt-3"
                    style={{ height: '300px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-12">
          <div className="card h-100">
            <div className="card-body" dir="ltr">
              <div className="card-widgets">
                <a href="#" data-toggle="reload" onClick={preventDefault}><i className="mdi mdi-refresh" /></a>
                <a
                  href="#reservation-bar-chart-collapse"
                  data-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="reservation-bar-chart-collapse"
                >
                  <i className="mdi mdi-minus" />
                </a>
                <a href="#" data-toggle="remove" onClick={preventDefault}><i className="mdi mdi-close" /></a>
              </div>
              <h4 className="header-title text-uppercase mb-0">إحصاءات الحجوزات</h4>

              <div id="reservation-bar-chart-collapse" className="collapse pt-3 show">
                <div className="text-center">
                  <div className="row mt-2">
                    {reservationMetricLabels.map((label) => (
                      <div className="col-4" key={label}>
                        <h3 data-plugin="counterup">0</h3>
                        <p className="text-muted font-13 mb-0 text-uppercase text-truncate">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div
                    id="reservation-bar-chart"
                    data-url="/mock/api/reservation-bar"
                    data-colors="#f1556c"
                    data-labels="الحجوزات"
                    className="morris-chart mt-3"
                    style={{ height: '320px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 g-xl-4">
        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-body" dir="ltr">
              <div className="card-widgets">
                <a href="#" data-toggle="reload" onClick={preventDefault}><i className="mdi mdi-refresh" /></a>
                <a
                  href="#reservation-donut-chart-collapse"
                  data-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="reservation-donut-chart-collapse"
                >
                  <i className="mdi mdi-minus" />
                </a>
                <a href="#" data-toggle="remove" onClick={preventDefault}><i className="mdi mdi-close" /></a>
              </div>
              <h4 className="header-title text-uppercase mb-0">حالة الحجوزات</h4>

              <div id="reservation-donut-chart-collapse" className="collapse pt-3 show">
                <div className="text-center">
                  <div className="row mt-2">
                    {reservationStatusCounters.map((label) => (
                      <div className="col-4" key={label}>
                        <h3 data-plugin="counterup">0</h3>
                        <p className="text-muted font-13 mb-0 text-uppercase text-truncate">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div
                    id="reservation-donut-chart"
                    data-url="/mock/api/reservation-donut"
                    data-colors="#00acc1,#f7b84b,#f1556c"
                    className="morris-chart mt-3"
                    style={{ height: '270px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-body" dir="ltr">
              <div className="card-widgets">
                <a href="#" data-toggle="reload" onClick={preventDefault}><i className="mdi mdi-refresh" /></a>
                <a
                  href="#apartment-cleanliness-donut-chart-collapse"
                  data-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="apartment-cleanliness-donut-chart-collapse"
                >
                  <i className="mdi mdi-minus" />
                </a>
                <a href="#" data-toggle="remove" onClick={preventDefault}><i className="mdi mdi-close" /></a>
              </div>
              <h4 className="header-title text-uppercase mb-0">نظافة الشقق</h4>

              <div id="apartment-cleanliness-donut-chart-collapse" className="collapse pt-3 show">
                <div className="text-center">
                  <div className="row mt-2">
                    {cleanlinessCounters.map((label) => (
                      <div className="col-4" key={label}>
                        <h3 data-plugin="counterup">0</h3>
                        <p className="text-muted font-13 mb-0 text-uppercase text-truncate">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div
                    id="apartment-cleanliness-donut-chart"
                    data-url="/mock/api/apartment-cleanliness"
                    data-colors="#1abc9c,#f7b84b,#f1556c"
                    className="morris-chart mt-3"
                    style={{ height: '270px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
