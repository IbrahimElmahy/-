import { FiMoreVertical } from 'react-icons/fi'

const SummaryCard = ({ title, value, icon: Icon, accent, badge }) => {
  const accentSoft = `${accent}1a`

  return (
    <article className="card summary-card" style={{ '--accent': accent, '--accent-soft': accentSoft }}>
      <div className="summary-card__header">
        <div className="summary-card__icon">
          <Icon size={20} />
        </div>
        <button type="button" className="summary-card__menu" aria-label="المزيد">
          <FiMoreVertical size={18} />
        </button>
      </div>
      <div className="summary-card__body">
        <span className="summary-card__title">{title}</span>
        <strong className="summary-card__value">{value}</strong>
        {badge ? (
          <span className={`summary-card__trend${badge.positive ? ' is-positive' : ' is-negative'}`}>
            {badge.label}
          </span>
        ) : null}
      </div>
    </article>
  )
}

export default SummaryCard
