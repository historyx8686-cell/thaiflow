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

// Универсальный контейнер для модальных окон
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
      <div className="disclaimer-block" style={{ marginTop: 20, padding: 10, background: 'rgba(255,165,0,0.1)', borderRadius: 8 }}>
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
              <span key={ch} className="channel-tag" style={{ color: 'var(--accent-green)', fontSize: 13 }}>{ch}</span>
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
        <p>Мы сохраняем: Telegram ID, настройки фильтров, контент Витрины.</p>
        <p style={{ marginTop: 6, color: 'var(--accent-green)' }}>Мы <strong>НЕ</strong> собираем: ФИО, телефоны, платёжные данные.</p>
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
      <a href="https://boosty.to/thaiflow" target="_blank" rel="noopener noreferrer" className="support-btn">
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
        <a key={c.label} href={c.link} target="_blank" rel="noopener noreferrer" className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, textDecoration: 'none' }}>
          <span className="contact-icon" style={{ fontSize: 24 }}>{c.icon}</span>
          <div>
            <div className="contact-label" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.label}</div>
            <div className="contact-value" style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{c.value}</div>
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
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encode