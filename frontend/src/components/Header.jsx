import { useState, useRef, useEffect } from 'react'

const CITIES = [
  { id: 'pattaya', name: 'Паттайя', emoji: '🏖️' },
  { id: 'phuket', name: 'Пхукет', emoji: '🌴' },
  { id: 'bangkok', name: 'Бангкок', emoji: '🏙️' },
]

const MENU_ITEMS = [
  { id: 'profile', icon: '👤', label: 'Мой профиль' },
  { id: 'about', icon: '📖', label: 'О сервисе' },
  { id: 'channels', icon: '📢', label: 'Каналы' },
  { id: 'privacy', icon: '🔒', label: 'Конфиденциальность' },
  { id: 'terms', icon: '📋', label: 'Условия использования' },
  { id: 'support', icon: '❤️', label: 'Поддержать проект' },
  { id: 'contacts', icon: '📧', label: 'Контакты' },
]

const MODAL_TITLES = {
  profile: 'Мой профиль',
  about: 'О сервисе',
  channels: 'Отслеживаемые источники',
  privacy: 'Конфиденциальность',
  terms: 'Условия использования',
  support: 'Поддержать проект',
  contacts: 'Контакты',
}

function ModalSheet({ title, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </>
  )
}

function AboutContent() {
  return (
    <div className="modal-content-text">
      <p><strong>ThaiFlow</strong> — автоматизированный агрегатор публичных данных из открытых Telegram-сообществ Таиланда.</p>
      <p style={{ marginTop: 10 }}>Лента собирает посты из каналов. Витрина — каталог местных бизнесов и мест.</p>
      <div style={{ marginTop: 16 }}>
        <div className="modal-section-title">📋 ЛЕНТА</div>
        <p>Автоматический сбор объявлений из открытых Telegram-каналов. Дедупликация постов — один и тот же пост не появится раньше чем через 3 дня.</p>
      </div>
      <div style={{ marginTop: 12 }}>
        <div className="modal-section-title">🔲 ВИТРИНА</div>
        <p>Каталог местных бизнесов, ресторанов, сервисов и мест. Добавьте свой бизнес через @thaiflow_ads.</p>
      </div>
      <div className="disclaimer-block">
        ⚠️ Все сделки, аренду и покупки вы совершаете на свой страх и риск. Сервис не проверяет контрагентов и не несёт ответственности за содержание объявлений.
      </div>
    </div>
  )
}

function ChannelsContent() {
  const CHANNELS = [
    { cat: '🏠 Аренда и недвижимость', list: ['@pattaya_rent', '@phuket_nedvizhimost', '@bkk_realty', '@thailand_property', '@thai_rent_sale'] },
    { cat: '🛒 Барахолка и объявления', list: ['@pattaya_baraxolka', '@phuket_flea', '@bkk_objavleniya', '@thailand_avito'] },
    { cat: '🍽️ Еда и рестораны', list: ['@pattaya_food', '@phuket_eats', '@bangkok_food_guide', '@thai_kitchen'] },
    { cat: '🚗 Авто и транспорт', list: ['@pattaya_auto', '@thailand_cars', '@thai_moto', '@phuket_transport'] },
    { cat: '👥 Сообщества', list: ['@thai_expats', '@russians_thailand', '@pattaya_chat', '@phuket_club'] },
  ]
  return (
    <div className="modal-content-text">
      <p>Мы автоматически индексируем публичные сообщения из крупнейших сообществ Таиланда. Весь контент принадлежит авторам каналов.</p>
      {CHANNELS.map(g => (
        <div key={g.cat} style={{ marginTop: 14 }}>
          <div className="modal-section-title">{g.cat}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {g.list.map(ch => (
              <span key={ch} className="channel-tag">{ch}</span>
            ))}
          </div>
        </div>
      ))}
      <p style={{ marginTop: 16, color: 'var(--accent-gold)', fontSize: 13 }}>
        ⚡ Ваш канал в списке? Если вы хотите исключить свой источник из нашего агрегатора, пожалуйста, свяжитесь с нами через техподдержку.
      </p>
    </div>
  )
}

function PrivacyContent() {
  return (
    <div className="modal-content-text">
      <div>
        <div className="modal-section-title">1. Собираемые данные</div>
        <p>Мы собираем: Telegram ID, настройки фильтров, контент Витрины.</p>
        <p style={{ marginTop: 6 }}>Мы <strong>НЕ</strong> собираем: ФИО, телефоны, платёжные данные.</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="modal-section-title">2. Хранение медиа</div>
        <p>Медиафайлы хранятся на Cloudflare R2. Автоматическое удаление через 30 дней.</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="modal-section-title">3. Третьи лица</div>
        <p>Используется Google Analytics для анализа трафика. Данные анонимизированы.</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="modal-section-title">4. Ваши права</div>
        <p>Вы можете запросить удаление ваших данных через службу поддержки @thaiflow_bot.</p>
      </div>
    </div>
  )
}

function TermsContent() {
  return (
    <div className="modal-content-text">
      <div>
        <div className="modal-section-title">1. Статус сервиса</div>
        <p>ThaiFlow является информационным агрегатором и не является стороной каких-либо сделок между пользователями.</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="modal-section-title">2. Отказ от ответственности</div>
        <p>Сервис не несёт ответственности за содержание объявлений, достоверность информации, а также за ущерб, возникший в результате использования сервиса.</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="modal-section-title">3. Интеллектуальная собственность</div>
        <p>Весь контент принадлежит авторам оригинальных публикаций. ThaiFlow не претендует на права собственности на публикуемые материалы.</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="modal-section-title">4. Notice and Takedown</div>
        <p>Если ваш контент был опубликован без согласия, свяжитесь с нами. Запрос будет обработан в течение 48 часов.</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="modal-section-title">5. Монетизация и реклама</div>
        <p>Сервис может показывать рекламные материалы. Реклама отмечается соответствующим образом.</p>
      </div>
    </div>
  )
}

function SupportContent() {
  return (
    <div className="modal-content-text" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>☕</div>
      <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Поддержите ThaiFlow!</p>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
        Мы пашем как тайские трудолюбивые слоники 🐘 чтобы вы могли искать аренду в 3 часа ночи. Если сервис экономит вам время и нервы — поддержите нас чашечкой кофе!
      </p>
      <a
        href="https://boosty.to/thaiflow"
        target="_blank"
        rel="noopener noreferrer"
        className="support-btn"
      >
        ☕ Поддержать на Boosty
      </a>
    </div>
  )
}

function ContactsContent() {
  const contacts = [
    { icon: '🤖', label: 'Техподдержка', value: '@thaiflow_bot', link: 'https://t.me/thaiflow_bot' },
    { icon: '📢', label: 'Реклама', value: '@thaiflowmain', link: 'https://t.me/thaiflowmain' },
    { icon: '📱', label: 'Telegram канал', value: 't.me/thaiflow', link: 'https://t.me/thaiflow' },
    { icon: '🧵', label: 'Threads', value: '@thaiflowinfo', link: 'https://www.threads.net/@thaiflowinfo' },
  ]
  return (
    <div className="modal-content-text">
      {contacts.map(c => (
        <a key={c.label} href={c.link} target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon">{c.icon}</span>
          <div>
            <div className="contact-label">{c.label}</div>
            <div className="contact-value">{c.value}</div>
          </div>
        </a>
      ))}
    </div>
  )
}

function ProfileContent({ tgUser }) {
  const [tab, setTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  const refLink = tgUser?.id ? `https://t.me/thaiflow_bot?start=ref_${tgUser.id}` : 'https://t.me/thaiflow_bot'

  const copyRef = () => {
    navigator.clipboard.writeText(refLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareRef = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(refLink)}`)
    }
  }

  const LEADERBOARD = [
    { rank: 1, name: 'Путешественник_42', refs: 28 },
    { rank: 2, name: 'ТайскийНомад', refs: 19 },
    { rank: 3, name: 'Экспат_2024', refs: 15 },
    { rank: 4, name: 'ПхукетБич', refs: 11 },
    { rank: 5, name: 'БangkokWalker', refs: 8 },
  ]

  return (
    <div className="modal-content-text">
      {tgUser ? (
        <div className="profile-header">
          <div className="profile-avatar">
            {(tgUser.first_name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div className="profile-name">{tgUser.first_name} {tgUser.last_name || ''}</div>
            {tgUser.username && <div className="profile-username">@{tgUser.username}</div>}
          </div>
        </div>
      ) : (
        <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>Войдите через Telegram для доступа к профилю</div>
      )}

      <div className="profile-tabs">
        {[['overview', 'Обзор'], ['saved', 'Сохранённые'], ['settings', 'Настройки']].map(([t, label]) => (
          <button
            key={t}
            className={`profile-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <div className="modal-section-title" style={{ marginTop: 16 }}>🔗 Реферальная программа</div>
          <p style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
            Приглашайте друзей и получайте бонусы! Ваша реферальная ссылка:
          </p>
          <div className="ref-link-box">{refLink}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="ref-btn" onClick={copyRef}>{copied ? '✅ Скопировано' : '📋 Скопировать ссылку'}</button>
            <button className="ref-btn ref-btn-share" onClick={shareRef}>🔗 Поделиться</button>
          </div>
          <div className="modal-section-title" style={{ marginTop: 20 }}>🏆 Таблица лидеров</div>
          <div style={{ marginTop: 8 }}>
            {LEADERBOARD.map(item => (
              <div key={item.rank} className="leaderboard-row">
                <span className="leaderboard-rank">#{item.rank}</span>
                <span className="leaderboard-name">{item.name}</span>
                <span className="leaderboard-refs">{item.refs} рефералов</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'saved' && (
        <div style={{ marginTop: 16, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
          📌 Сохранённые объявления появятся здесь
        </div>
      )}
      {tab === 'settings' && (
        <div style={{ marginTop: 16, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
          ⚙️ Настройки будут доступны в ближайшем обновлении
        </div>
      )}
    </div>
  )
}

function renderModalContent(id, tgUser) {
  switch (id) {
    case 'profile': return <ProfileContent tgUser={tgUser} />
    case 'about': return <AboutContent />
    case 'channels': return <ChannelsContent />
    case 'privacy': return <PrivacyContent />
    case 'terms': return <TermsContent />
    case 'support': return <SupportContent />
    case 'contacts': return <ContactsContent />
    default: return null
  }
}

export default function Header({ city, setCity, theme, setTheme, tgUser }) {
  const [cityOpen, setCityOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const dropdownRef = useRef(null)
  const menuRef = useRef(null)

  const currentCity = CITIES.find(c => c.id === city) || CITIES[0]

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCityOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">🌴</div>
          <div className="logo-text">Thai<span>Flow</span></div>
        </div>

        <div className="header-actions">
          <div className="city-dropdown" ref={dropdownRef}>
            <button className="city-btn" onClick={() => setCityOpen(!cityOpen)}>
              {currentCity.emoji} {currentCity.name} ▾
            </button>
            {cityOpen && (
              <div className="city-menu">
                {CITIES.map(c => (
                  <div
                    key={c.id}
                    className={`city-menu-item ${c.id === city ? 'active' : ''}`}
                    onClick={() => { setCity(c.id); setCityOpen(false) }}
                  >
                    <span>{c.emoji} {c.name}</span>
                    {c.id === city && <span>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Сменить тему">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="burger-wrap" ref={menuRef}>
            <button className="icon-btn burger-btn" onClick={() => setMenuOpen(!menuOpen)} title="Меню">
              ☰
            </button>
            {menuOpen && (
              <div className="burger-menu">
                {MENU_ITEMS.map(item => (
                  <div
                    key={item.id}
                    className="burger-menu-item"
                    onClick={() => { setActiveModal(item.id); setMenuOpen(false) }}
                  >
                    <span className="burger-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {activeModal && (
        <ModalSheet title={MODAL_TITLES[activeModal]} onClose={() => setActiveModal(null)}>
          {renderModalContent(activeModal, tgUser)}
        </ModalSheet>
      )}
    </>
  )
}
