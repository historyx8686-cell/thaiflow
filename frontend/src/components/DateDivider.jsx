export default function DateDivider({ date }) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const postDate = new Date(date)

  let label
  if (postDate.toDateString() === today.toDateString()) {
    label = 'Сегодня'
  } else if (postDate.toDateString() === yesterday.toDateString()) {
    label = 'Вчера'
  } else {
    label = postDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }

  return (
    <div className="date-divider">
      <div className="date-divider-line" />
      <div className="date-divider-text">{label}</div>
      <div className="date-divider-line" />
    </div>
  )
}
