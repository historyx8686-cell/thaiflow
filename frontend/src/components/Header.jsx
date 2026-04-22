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
      <div className="disclaimer-block">
        ⚠️ Все сделки, аренду и покупки вы совершаете на свой страх и риск. Сервис не проверяет контрагентов и не несёт ответственности за содержание объявлений.
      </div>
    </div>
  )
}

function ChannelsContent() {
  const CHANNELS = [
    { cat: '🏠 Аренда', list: ['@pattaya_rent', '@phuket_nedvizhimost', '@bkk_realty'] },
    { cat: '🛒 Объявления', list: ['@pattaya_baraxolka', '@phuket_flea', '@thailand_avito'] },
    { cat: '👥 Сообщества', list: ['@thai_expats', '@russians_thailand'] },
  ]
  return (
    <div className="modal-content-text">
      <p>Мы автоматически индексируем публичные сообщения из крупнейших сообществ Таиланда.</p>
      {CHANNELS.map(g => (
        <div key={g.cat} style={{ marginTop: 14 }}>
          <div className="modal-section-title">{g.cat}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {g.list.map(ch => <span key={ch} className="channel-tag">{ch}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}

function PrivacyContent() {
  return (
    <div className="modal-content-text">
      <div className="modal-section-title">1. Собираемые данные</div>
      <p>Мы сохраняем: Telegram ID, настройки фильтров. Мы НЕ собираем ФИО и телефоны.</p>
    </div>
  )
}

function TermsContent() {
  return (
    <div className="modal-content-text">
      <div className="modal-section-title">1. Статус сервиса</div>
      <p>ThaiFlow является информационным агрегатором и не несет ответственности за содержание объявлений.</p>
    </div>
  )
}

function SupportContent() {
  return (
    <div className="modal-content-text" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>☕</div>
      <p>Поддержите проект чашечкой кофе, чтобы мы могли развивать его дальше!</p>
      <a href="https://boosty.to/thaiflow" target="_blank" rel="noopener noreferrer" className="support-btn" style={{ marginTop: 20 }}>
        ☕ Поддержать на Boosty
      </a>
    </div>
  )
}

function ContactsContent() {
  const contacts = [
    { icon: '🤖', label: 'Техподдержка', value: '@thaiflow_bot', link: 'https://t.me/thaiflow_bot' },
    { icon: '📢', label: 'Реклама', value: '@thaiflowmain', link: 'https://t.me/thaiflowmain' },
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
  const refLink = tgUser?.id ? `https://t.me/thaiflow_bot?start=ref_${tgUser.id}` : 'https://t.me/thaiflow_bot'

  return (
    <div className="modal-content-text">
      {tgUser ? (
        <div className="profile-header">
          <div className="profile-avatar">{(tgUser.first_name || 'U')[0]}</div>
          <div>
            <div className="profile-name">{tgUser.first_name}</div>
            <div className="profile-username">@{tgUser.username}</div>
          </div>
        </div>
      ) : (
        <p>Войдите через Telegram</p>
      )}
      <div className="profile-tabs">
        <button className={`profile-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Обзор</button>
        <button className={`profile-tab ${tab === 'saved' ? 'active' : ''}`} onClick={() => setTab('saved')}>Закладки</button>
      </div>
      {tab === 'overview' && (
        <div style={{ marginTop: 16 }}>
          <div className="modal-section-title">🔗 Реферальная ссылка</div>
          <div className="ref-link-box">{refLink}</div>
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setCityOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
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
                  <div key={c.id} className={`city-menu-item ${c.id === city ? 'active' : ''}`} onClick={() => { setCity(c.id); setCityOpen(false) }}>
                    <span>{c.emoji} {c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="burger-wrap" ref={menuRef}>
            <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            {menuOpen && (
              <div className="burger-menu">
                {MENU_ITEMS.map(item => (
                  <div key={item.id} className="burger-menu-item" onClick={() => { setActiveModal(item.id); setMenuOpen(false) }}>
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
