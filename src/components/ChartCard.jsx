const ChartCard = ({ title, subtitle, actions, children }) => {
  return (
    <section className="card chart-card">
      <header className="chart-card__header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <span>{subtitle}</span> : null}
        </div>
        {actions ? <div className="chart-card__actions">{actions}</div> : null}
      </header>
      <div className="chart-card__body">{children}</div>
    </section>
  )
}

export default ChartCard
