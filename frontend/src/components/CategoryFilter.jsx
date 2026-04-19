const CATEGORIES = [
  { id: 'all', name: 'Все', emoji: '📋' },
  { id: 'rent', name: 'Аренда', emoji: '🏠' },
  { id: 'bike_rent', name: 'Аренда байков', emoji: '🛵' },
  { id: 'bike_sale', name: 'Продажа байков', emoji: '💰' },
  { id: 'flea_market', name: 'Барахолка', emoji: '🛒' },
  { id: 'events', name: 'Афиша', emoji: '🎉' },
  { id: 'car_rent', name: 'Аренда машин', emoji: '🚗' },
  { id: 'job', name: 'Работа', emoji: '👷' },
  { id: 'services', name: 'Услуги', emoji: '🔧' },
  { id: 'sport', name: 'Спорт', emoji: '🏃' },
  { id: 'health', name: 'Здоровье', emoji: '🏥' },
  { id: 'news', name: 'Новости', emoji: '📰' },
  { id: 'visa', name: 'Виза', emoji: '🎫' },
  { id: 'exchange', name: 'Обмен', emoji: '💱' },
  { id: 'lost_found', name: 'Потеряно/Найдено', emoji: '🔍' },
]

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          className={`cat-btn ${active === cat.id ? 'active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.emoji} {cat.name}
        </button>
      ))}
    </div>
  )
}
