import { useMemo } from 'react';
import SpeciesIcon from '../components/SpeciesIcon';
import StatusBadge from '../components/StatusBadge';
import { formatDate, joursRestants } from '../utils/statut';

export default function Dashboard({ animaux, vaccins, settings, onSetPage, onModalOpen, onMarquerContacte }) {
  const now = new Date();

  const today = formatDate(now.toISOString().slice(0, 10));
  const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const urgent = useMemo(() =>
    vaccins.filter((v) => v.statut === 'urgent' || v.statut === 'retard'),
    [vaccins]
  );

  const cemois = useMemo(() => {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return vaccins.filter((v) => {
      const d = new Date(v.date_prochain);
      return d >= start && d <= end;
    });
  }, [vaccins]);

  const contactes = vaccins.filter((v) => v.contacte);
  const tauxContacte = vaccins.length > 0
    ? Math.round((contactes.length / vaccins.length) * 100)
    : 0;

  const urgentCount = urgent.filter((v) => !v.contacte).length;

  // cette semaine + ce mois pour rappels à venir
  const endWeek = new Date(now);
  endWeek.setDate(now.getDate() + 7);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const thisWeek = useMemo(() =>
    vaccins.filter((v) => {
      const d = new Date(v.date_prochain);
      return d >= now && d <= endWeek && v.statut !== 'retard';
    }),
    [vaccins]
  );
  const thisMois = useMemo(() =>
    vaccins.filter((v) => {
      const d = new Date(v.date_prochain);
      return d > endWeek && d <= endMonth;
    }),
    [vaccins]
  );

  const getAnimal = (aid) => animaux.find((a) => a.id === aid);

  return (
    <div>
      <div className="page-label">TABLEAU DE BORD</div>
      <div className="page-title">
        Bonjour, {settings?.nom_clinique ?? 'Clinique'} 👋
      </div>
      <div className="page-date">{dayName}</div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Animaux suivis</div>
          <div className="stat-value">{animaux.length}</div>
          <div className="stat-sub">dans la base</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rappels ce mois</div>
          <div className="stat-value accent">{cemois.length}</div>
          <div className="stat-sub">échéances à venir</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Urgents aujourd'hui</div>
          <div className={`stat-value ${urgentCount > 0 ? 'red' : ''}`}>{urgentCount}</div>
          <div className="stat-sub">{urgentCount > 0 ? 'à contacter maintenant' : 'aucun urgent'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Taux contactés</div>
          <div className="stat-value accent">{tauxContacte}%</div>
          <div className="stat-sub">{contactes.length} / {vaccins.length}</div>
        </div>
      </div>

      {/* Urgent banner */}
      {urgentCount > 0 && (
        <div className="urgent-banner">
          ⚠️ {urgentCount} animal{urgentCount > 1 ? 'x' : ''} à contacter aujourd'hui ou en retard
        </div>
      )}

      {/* Table urgente */}
      {urgent.length > 0 && (
        <>
          <div className="section-title">À CONTACTER MAINTENANT</div>
          <div className="rv-table-wrapper">
            <table className="rv-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Propriétaire</th>
                  <th>Vaccin</th>
                  <th>Échéance</th>
                  <th>Retard</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {urgent.map((v) => {
                  const a = getAnimal(v.animal_id);
                  if (!a) return null;
                  const jours = joursRestants(v.date_prochain);
                  return (
                    <tr key={v.id} className={v.contacte ? 'contacted' : ''}>
                      <td>
                        <div className="animal-cell">
                          <SpeciesIcon espece={a.espece} size={22} />
                          <div>
                            <div className="animal-name">{a.nom}</div>
                            <div className="animal-race">{a.race}</div>
                          </div>
                        </div>
                      </td>
                      <td>{a.proprietaire_prenom} {a.proprietaire_nom}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {v.type}
                          <StatusBadge statut={v.statut} />
                        </div>
                      </td>
                      <td><span className="mono">{formatDate(v.date_prochain)}</span></td>
                      <td>
                        {jours < 0
                          ? <span className="mono red">{Math.abs(jours)}j</span>
                          : <span className="mono">{jours}j</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => onModalOpen(a, v)}
                          >
                            Préparer
                          </button>
                          {!v.contacte && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => onMarquerContacte(v.id)}
                            >
                              ✓ Contacté
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Rappels à venir */}
      {(thisWeek.length > 0 || thisMois.length > 0) && (
        <div>
          <div className="section-title">RAPPELS À VENIR</div>
          {thisWeek.length > 0 && (
            <div className="rappels-section">
              <div className="rappels-section-title">Cette semaine</div>
              {thisWeek.map((v) => {
                const a = getAnimal(v.animal_id);
                if (!a) return null;
                const j = joursRestants(v.date_prochain);
                return (
                  <div key={v.id} className="rappel-item" onClick={() => onSetPage('animaux')} style={{ cursor: 'none' }}>
                    <SpeciesIcon espece={a.espece} size={18} />
                    <span className="rappel-animal">{a.nom}</span>
                    <span className="rappel-proprio">{a.proprietaire_prenom} {a.proprietaire_nom}</span>
                    <span className="rappel-vaccin">{v.type}</span>
                    <StatusBadge statut={v.statut} />
                    <span className="mono">dans {j}j</span>
                  </div>
                );
              })}
            </div>
          )}
          {thisMois.length > 0 && (
            <div className="rappels-section">
              <div className="rappels-section-title">Ce mois</div>
              {thisMois.map((v) => {
                const a = getAnimal(v.animal_id);
                if (!a) return null;
                const j = joursRestants(v.date_prochain);
                return (
                  <div key={v.id} className="rappel-item" onClick={() => onSetPage('animaux')} style={{ cursor: 'none' }}>
                    <SpeciesIcon espece={a.espece} size={18} />
                    <span className="rappel-animal">{a.nom}</span>
                    <span className="rappel-proprio">{a.proprietaire_prenom} {a.proprietaire_nom}</span>
                    <span className="rappel-vaccin">{v.type}</span>
                    <StatusBadge statut={v.statut} />
                    <span className="mono">dans {j}j</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {urgent.length === 0 && thisWeek.length === 0 && thisMois.length === 0 && (
        <div className="empty-state">Aucun rappel urgent ou imminent — tout est sous contrôle ✓</div>
      )}
    </div>
  );
}
