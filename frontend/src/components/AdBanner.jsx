const DEFAULT_BANNERS = {
  all: {
    username: 'thaiflow_ads',
    description: '📢 Реклама в ThaiFlow — 10,000+ подписчиков',
    tg_link: 'https://t.me/thaiflow_ads',
    emoji: '📢'
  },
  rent: {
    username: 'pattaya_rent_pro',
    description: '🏠 Лучшие квартиры от 8,000 ฿/мес',
    tg_link: 'https://t.me/pattaya_rent_pro',
    emoji: '🏠'
  },
  bike_rent: {
    username: 'thai_bike_rental',
    description: '🛵 Аренда байков с доставкой',
    tg_link: 'https://t.me/thai_bike_rental',
    emoji: '🛵'
  },
  job: {
    username: 'pattaya_jobs',
    description: '💼 Работа в Таиланде для русских',
    tg_link: 'https://t.me/pattaya_jobs',
    emoji: '💼'
  },
}

export default function AdBanner({ category, banners }) {
  const banner = (banners && banners.length > 0)
    ? banners[0]
    : (DEFAULT_BANNERS[category] || DEFAULT_BANNERS.all)

  const openLink = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(banner.tg_link)
    } else {
      window.open(banner.tg_link, '_blank')
    }
  }

  return (
    <div className="ad-banner" onClick={openLink}>
      <div className="ad-avatar">{banner.emoji || '📢'}</div>
      <div className="ad-info">
        <div className="ad-label">реклама</div>
        <div className="ad-username">@{banner.username}</div>
        <div className="ad-desc">{banner.description}</div>
      </div>
      <span style={{ color: 'var(--accent-green)', fontSize: '18px' }}>↗</span>
    </div>
  )
}
