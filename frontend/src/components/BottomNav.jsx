import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <span>📋</span>
        <span>Лента</span>
      </NavLink>
      <NavLink to="/showcase" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span>🔲</span>
        <span>Витрина</span>
      </NavLink>
    </nav>
  )
}
