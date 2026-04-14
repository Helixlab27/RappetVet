import { useState, useMemo } from 'react';
import SpeciesIcon from '../components/SpeciesIcon';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/statut';

const ESPECES = ['Tous', 'chien', 'chat', 'lapin', 'autre'];
const STATUTS = ['Tous', 'ok', 'bientot', 'urgent', 'retard'];
const PAGE_SIZE = 20;

export default function Animaux({ animaux, vaccins, onSetPage, onSelectAnimal, onDelete }) {
  const [search, setSearch] = useState('');
  const [filtreEspece, setFiltreEspece] = useState('Tous');
  const [filtreStatut, setFiltreStatut] = useState('Tous');
  const [page, setPage] = useState(1);

  // Meilleur statut pour chaque animal (le pire parmi ses vaccins)
  const statutAnimal = useMemo(() => {
    const ordre = { retard: 0, urgent: 1, bientot: 2, ok: 3 };
    const map = {};
    vaccins.forEach((v) => {
      const cur = map[v.animal_id];
      if (!cur || ordre[v.statut] < ordre[cur.statut]) map[v.animal_id] = v;
    });
    return map;
  }, [vaccins]);

  const prochainsVaccins = useMemo(() => {
    const map = {};
    vaccins.forEach((v) => {
      const cur = map[v.animal_id];
      if (!cur || new Date(v.date_prochain) < new Date(cur.date_prochain)) {
        map[v.animal_id] = v;
      }
    });
    return map;
  }, [vaccins]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return animaux.filter((a) => {
      if (filtreEspece !== 'Tous' && a.espece !== filtreEspece) return false;
      const sv = statutAnimal[a.id];
      if (filtreStatut !== 'Tous' && sv?.statut !== filtreStatut) return false;
      if (q) {
        const hay = `${a.nom} ${a.proprietaire_prenom} ${a.proprietaire_nom} ${a.race}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [animaux, filtreEspece, filtreStatut, search, statutAnimal]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const go = (n) => setPage(Math.max(1, Math.min(totalPages, n)));

  return (
    <div>
      <div className="page-header-row">
        <div>
          <div className="page-label">GESTION</div>
          <div className="page-title">Animaux</div>
        </div>
        <button className="btn btn-primary" onClick={() => onSetPage('nouvel-animal')}>
          + Nouvel animal
        </button>
      </div>

      <div className="search-bar">
        <span style={{ color: 'var(--text-3)' }}>🔍</span>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher par nom d'animal ou propriétaire…"
        />
        {search && (
          <button
            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'none' }}
            onClick={() => setSearch('')}
          >✕</button>
        )}
      </div>

      <div className="filter-row">
        <span style={{ color: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono', alignSelf: 'center' }}>ESPÈCE</span>
        {ESPECES.map((e) => (
          <button
            key={e}
            className={`filter-chip${filtreEspece === e ? ' active' : ''}`}
            onClick={() => { setFiltreEspece(e); setPage(1); }}
          >
            {e === 'Tous' ? 'Tous' : e.charAt(0).toUpperCase() + e.slice(1)}
          </button>
        ))}
        <span style={{ color: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono', alignSelf: 'center', marginLeft: 8 }}>STATUT</span>
        {STATUTS.map((s) => (
          <button
            key={s}
            className={`filter-chip${filtreStatut === s ? ' active' : ''}`}
            onClick={() => { setFiltreStatut(s); setPage(1); }}
          >
            {s === 'Tous' ? 'Tous' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="rv-table-wrapper">
        <table className="rv-table">
          <thead>
            <tr>
              <th>Animal</th>
              <th>Espèce</th>
              <th>Propriétaire</th>
              <th>Prochain vaccin</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={6} className="empty-state">Aucun animal trouvé</td></tr>
            ) : paginated.map((a) => {
              const pv = prochainsVaccins[a.id];
              const sv = statutAnimal[a.id];
              return (
                <tr key={a.id}>
                  <td>
                    <div className="animal-cell">
                      <SpeciesIcon espece={a.espece} size={22} />
                      <div>
                        <div className="animal-name">{a.nom}</div>
                        <div className="animal-race">{a.race}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize', color: 'var(--text-2)' }}>{a.espece}</td>
                  <td>{a.proprietaire_prenom} {a.proprietaire_nom}</td>
                  <td>
                    {pv ? (
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{pv.type}</div>
                        <span className="mono">{formatDate(pv.date_prochain)}</span>
                      </div>
                    ) : <span className="mono" style={{ color: 'var(--text-3)' }}>—</span>}
                  </td>
                  <td>{sv ? <StatusBadge statut={sv.statut} /> : <span className="mono" style={{ color: 'var(--text-3)' }}>—</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { onSelectAnimal(a.id); onSetPage('fiche-animal'); }}
                      >
                        Voir
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (confirm(`Supprimer ${a.nom} et tous ses vaccins ?`)) onDelete(a.id);
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => go(page - 1)} disabled={page === 1}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`page-btn${page === n ? ' active' : ''}`}
              onClick={() => go(n)}
            >{n}</button>
          ))}
          <button className="page-btn" onClick={() => go(page + 1)} disabled={page === totalPages}>→</button>
        </div>
      )}

      <div style={{ marginTop: 8, textAlign: 'center', color: 'var(--text-3)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>
        {filtered.length} animal{filtered.length !== 1 ? 'x' : ''} · page {page}/{totalPages}
      </div>
    </div>
  );
}
