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

function ModalAbout({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">📖 О сервисе</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p><strong>ThaiFlow</strong> — автоматизированный агрегатор публичных данных из открытых Telegram-сообществ Таиланда.</p>
          <p style={{ marginTop: 12 }}>Лента собирает посты из каналов, Витрина — каталог местных бизнесов и мест.</p>
          <p style={{ marginTop: 12 }}><strong>Разделы:</strong></p>
          <ul style={{ marginTop: 6, paddingLeft: 20 }}>
            <li><strong>ЛЕНТА</strong> — дедупликация постов, повтор не раньше 3 дней</li>
            <li style={{ marginTop: 6 }}><strong>ВИТРИНА</strong> — каталог местных бизнесов и мест</li>
          </ul>
          <div className="modal-disclaimer">
            ⚠️ Все сделки, аренду и покупки вы совершаете на свой страх и риск. Сервис не проверяет контрагентов и не несёт ответственности за содержание объявлений.
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalChannels({ onClose }) {
  const channels = [
    { cat: '🏠 Недвижимость', list: ['@pattaya_rent', '@phuket_property', '@bangkok_realty', '@thai_rentals', '@thaiflow_realty'] },
    { cat: '🛒 Объявления', list: ['@pattaya_deals', '@phuket_ads', '@bangkok_market', '@thai_flea'] },
    { cat: '🍽️ Еда и рестораны', list: ['@thai_food_lovers', '@pattaya_food', '@phuket_eats', '@bkk_restaurants'] },
    { cat: '💼 Работа', list: ['@thai_jobs', '@expat_work_thailand', '@phuket_vacancy'] },
    { cat: '🌴 Жизнь в Таиланде', list: ['@thaiflow', '@expats_thailand', '@ru_thai', '@life_in_thailand'] },
  ]
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">📢 Отслеживаемые источники</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p>Мы автоматически индексируем публичные сообщения из крупнейших сообществ Таиланда. Весь контент принадлежит авторам каналов.</p>
          {channels.map(g => (
            <div key={g.cat} style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{g.cat}</div>
              {g.list.map(ch => (
                <div key={ch} style={{ color: 'var(--accent-green)', fontSize: 13, marginBottom: 4 }}>{ch}</div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(212,168,67,0.12)', border: '1px solid var(--accent-gold)', borderRadius: 8, fontSize: 13, color: 'var(--accent-gold-light)' }}>
            Ваш канал в списке? Если вы хотите исключить свой источник из нашего агрегатора, пожалуйста, свяжитесь с нами через техподдержку.
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalPrivacy({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">🔒 Конфиденциальность</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <div className="modal-section-title">1. Собираемые данные</div>
            <p>Мы сохраняем: Telegram ID, настройки фильтров, контент Витрины.</p>
            <p style={{ marginTop: 6, color: 'var(--accent-green)' }}>Мы <strong>не</strong> собираем ФИО, номера телефонов и платёжные данные.</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">2. Хранение медиа</div>
            <p>Медиафайлы хранятся на Cloudflare R2. Автоматическое удаление через 30 дней.</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">3. Третьи лица</div>
            <p>Мы используем Google Analytics для анонимной аналитики использования.</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">4. Ваши права</div>
            <p>Вы можете запросить удаление ваших данных через службу поддержки @thaiflow_bot.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalTerms({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">📋 Условия использования</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <div className="modal-section-title">1. Статус сервиса</div>
            <p>ThaiFlow является информационным агрегатором и не является стороной каких-либо сделок между пользователями.</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">2. Отказ от ответственности</div>
            <p>Сервис не несёт ответственности за достоверность публикуемых объявлений, действия третьих лиц и результаты сделок.</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">3. Интеллектуальная собственность</div>
            <p>Контент принадлежит авторам оригинальных Telegram-каналов. ThaiFlow является посредником-агрегатором публичной информации.</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">4. Notice and Takedown</div>
            <p>Запросы на удаление контента рассматриваются в течение 48 часов. Направляйте запросы через @thaiflow_bot.</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">5. Монетизация и реклама</div>
            <p>Сервис может показывать рекламу и партнёрские материалы. Рекламные блоки помечаются соответствующим образом.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalSupport({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">❤️ Поддержать проект</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p>Привет! Мы — маленькая команда, которая делает ThaiFlow с любовью 🌴</p>
          <p style={{ marginTop: 10 }}>Если сервис помогает тебе найти жильё, работу или просто быть в курсе жизни в Таиланде — угости нас кофе ☕</p>
          <p style={{ marginTop: 10 }}>Каждая чашка помогает нам платить за серверы и не ложиться спать в 3 ночи (хотя иногда всё равно приходится 😄)</p>
          <a
            href="https://boosty.to/thaiflow"
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn"
          >
            ☕ Поддержать на Boosty
          </a>
        </div>
      </div>
    </div>
  )
}

function ModalContacts({ onClose }) {
  const contacts = [
    { icon: '🤖', label: 'Техподдержка', value: '@thaiflow_bot', link: 'https://t.me/thaiflow_bot' },
    { icon: '📣', label: 'Реклама', value: '@thaiflowmain', link: 'https://t.me/thaiflowmain' },
    { icon: '📡', label: 'Telegram канал', value: 't.me/thaiflow', link: 'https://t.me/thaiflow' },
    { icon: '🧵', label: 'Threads', value: '@thaiflowinfo', link: 'https://www.threads.net/@thaiflowinfo' },
  ]
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">📧 Контакты</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {contacts.map(c => (
            <a key={c.label} href={c.link} target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="contact-icon">{c.icon}</span>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.label}</div>
                <div style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{c.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function ModalProfile({ onClose, tgUser }) {
  const [activeTab, setActiveTab] = useState('overview')
  const refLink = tgUser?.id ? `https://t.me/thaiflow?start=ref_${tgUser.id}` : 'https://t.me/thaiflow'

  const [copyMsg, setCopyMsg] = useState('')

  const copyRef = () => {
    navigator.clipboard.writeText(refLink).then(() => {
      setCopyMsg('Скопировано!')
      setTimeout(() => setCopyMsg(''), 2000)
    }).catch(() => {
      setCopyMsg('Ошибка копирования')
      setTimeout(() => setCopyMsg(''), 2000)
    })
  }

  const shareRef = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent('Присоединяйся к ThaiFlow 🌴')}`)
    }
  }

  const leaders = [
    { rank: 1, name: 'Путешественник_77', score: 42 },
    { rank: 2, name: 'Экспат_Бангкок', score: 31 },
    { rank: 3, name: 'Пхукет_Лайф', score: 28 },
    { rank: 4, name: 'Таец_Почти', score: 19 },
    { rank: 5, name: 'Синяя_Лагуна', score: 14 },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">👤 Мой профиль</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="profile-avatar">
            <div className="profile-avatar-icon">👤</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{tgUser?.first_name || 'Пользователь'}</div>
              {tgUser?.username && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>@{tgUser.username}</div>}
            </div>
          </div>
          <div className="profile-tabs">
            {['overview', 'saved', 'settings'].map(tab => (
              <button
                key={tab}
                className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' ? 'Обзор' : tab === 'saved' ? 'Сохранённые' : 'Настройки'}
              </button>
            ))}
          </div>
          {activeTab === 'overview' && (
            <div>
              <div className="modal-section">
                <div className="modal-section-title">🎁 Реферальная программа</div>
                <p style={{ fontSize: 13, marginBottom: 10 }}>Приглашайте друзей и получайте бонусы!</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ref-btn" onClick={copyRef}>📋 Скопировать ссылку</button>
                  <button className="ref-btn ref-btn-share" onClick={shareRef}>🚀 Поделиться</button>
                </div>
                {copyMsg && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--accent-green)' }}>{copyMsg}</div>}
              </div>
              <div className="modal-section">
                <div className="modal-section-title">🏆 Таблица лидеров</div>
                {leaders.map(l => (
                  <div key={l.rank} className="leader-row">
                    <span className="leader-rank">{l.rank}</span>
                    <span style={{ flex: 1 }}>{l.name}</span>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{l.score} приглашений</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'saved' && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36 }}>🔖</div>
              <div style={{ marginTop: 8 }}>Сохранённые посты появятся здесь</div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              Настройки будут доступны в следующих обновлениях
            </div>
          )}
        </div>
      </div>
    </div>
  )
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

  const openModal = (id) => {
    setActiveModal(id)
    setMenuOpen(false)
  }

  return (
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

        <div className="burger-wrapper" ref={menuRef}>
          <button className="icon-btn burger-btn" onClick={() => setMenuOpen(!menuOpen)} title="Меню">
            ☰
          </button>
          {menuOpen && (
            <div className="burger-menu">
              {MENU_ITEMS.map(item => (
                <button
                  key={item.id}
                  className="burger-menu-item"
                  onClick={() => openModal(item.id)}
                >
                  <span className="burger-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeModal === 'about' && <ModalAbout onClose={() => setActiveModal(null)} />}
      {activeModal === 'channels' && <ModalChannels onClose={() => setActiveModal(null)} />}
      {activeModal === 'privacy' && <ModalPrivacy onClose={() => setActiveModal(null)} />}
      {activeModal === 'terms' && <ModalTerms onClose={() => setActiveModal(null)} />}
      {activeModal === 'support' && <ModalSupport onClose={() => setActiveModal(null)} />}
      {activeModal === 'contacts' && <ModalContacts onClose={() => setActiveModal(null)} />}
      {activeModal === 'profile' && <ModalProfile onClose={() => setActiveModal(null)} tgUser={tgUser} />}
    </header>
  )
}
