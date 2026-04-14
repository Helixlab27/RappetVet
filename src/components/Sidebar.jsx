export default function Sidebar({ page, setPage, urgentCount, settings, onResetDemo }) {
  const nav = [
    { id: 'dashboard',    label: 'Tableau de bord', icon: '🏠' },
    { id: 'animaux',      label: 'Animaux',          icon: '🐾', badge: urgentCount > 0 ? urgentCount : null },
    { id: 'nouvel-animal',label: 'Nouvel animal',    icon: '➕' },
    { id: 'rappels',      label: 'Rappels',           icon: '✉️' },
    { id: 'parametres',   label: 'Paramètres',        icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-row">
          <span className="logo-dot" />
          <span className="logo-name">RappelVet</span>
        </div>
        <div className="logo-sub">Rappels vaccins · Clinique</div>
      </div>

      <nav className="sidebar-nav">
        {nav.map((item) => (
          <button
            key={item.id}
            className={`nav-item${page === item.id ? ' active' : ''}`}
            onClick={() => setPage(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge != null && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="clinic-name">
          {settings?.nom_clinique ?? 'Clinique vétérinaire'}
        </div>
        <button className="btn-reset-demo" onClick={onResetDemo}>
          ↺ Réinitialiser démo
        </button>
      </div>
    </aside>
  );
}
