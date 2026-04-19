const CATEGORY_NAMES = {
  rent: 'Аренда',
  bike_rent: 'Байки',
  bike_sale: 'Продажа байков',
  car_rent: 'Машины',
  job: 'Работа',
  services: 'Услуги',
  real_estate: 'Недвижимость',
}

export default function ShowcaseCard({ business }) {
  const openLink = () => {
    if (!business.tg_link) return
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(business.tg_link)
    } else {
      window.open(business.tg_link, '_blank')
    }
  }

  return (
    <div className="showcase-card" onClick={openLink}>
      <div className="showcase-card-photo">
        {business.photos && business.photos.length > 0 ? (
          <img src={business.photos[0]} alt={business.name} />
        ) : (
          <span>🏢</span>
        )}
        {business.is_new && <span className="new-badge">✨ Новое</span>}
      </div>
      <div className="showcase-card-body">
        <div className="showcase-card-name">{business.name}</div>
        {business.categories && business.categories.length > 0 && (
          <div className="showcase-tags">
            {business.categories.slice(0, 2).map(cat => (
              <span key={cat} className="showcase-tag">
                {CATEGORY_NAMES[cat] || cat}
              </span>
            ))}
          </div>
        )}
        <div className="showcase-card-desc">{business.description}</div>
        <div className="showcase-card-meta">
          <span>❤️ {business.likes}</span>
          <span>👁 {business.views}</span>
        </div>
      </div>
    </div>
  )
}
