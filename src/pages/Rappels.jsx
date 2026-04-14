import { useMemo } from 'react';
import SpeciesIcon from '../components/SpeciesIcon';
import StatusBadge from '../components/StatusBadge';
import { formatDate, joursRestants } from '../utils/statut';

export default function Rappels({ animaux, vaccins, onModalOpen, onMarquerContacte }) {
  const getAnimal = (aid) => animaux.find((a) => a.id === aid);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const endWeek  = new Date(now); endWeek.setDate(now.getDate() + 7);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const end3m    = new Date(now.getFullYear(), now.getMonth() + 3, 0);

  const sections = useMemo(() => {
    const retard   = vaccins.filter((v) => v.statut === 'retard');
    const semaine  = vaccins.filter((v) => { const d = new Date(v.date_prochain); return d >= now && d <= endWeek && v.statut !== 'retard'; });
    const cemois   = vaccins.filter((v) => { const d = new Date(v.date_prochain); return d > endWeek && d <= endMonth; });
    const trimestre= vaccins.filter((v) => { const d = new Date(v.date_prochain); return d > endMonth && d <= end3m; });
    const ok       = vaccins.filter((v) => v.statut === 'ok' && new Date(v.date_prochain) > end3m);
    return { retard, semaine, cemois, trimestre, ok };
  }, [vaccins]);

  const VaccinRow = ({ v }) => {
    const a = getAnimal(v.animal_id);
    if (!a) return null;
    const j = joursRestants(v.date_prochain);
    return (
      <div className="rappel-item" style={{ flexWrap: 'wrap', gap: 10 }}>
        <SpeciesIcon espece={a.espece} size={18} />
        <span className="rappel-animal">{a.nom}</span>
        <span className="rappel-proprio">{a.proprietaire_prenom} {a.proprietaire_nom}</span>
        <span className="rappel-vaccin">{v.type}</span>
        <StatusBadge statut={v.statut} />
        <span className="mono">{formatDate(v.date_prochain)}</span>
        <span className="mono" style={{ color: j < 0 ? 'var(--red)' : 'var(--text-3)' }}>
          {j < 0 ? `${Math.abs(j)}j de retard` : `dans ${j}j`}
        </span>
        {v.contacte
          ? <span className="contacted-tag">✓ Contacté</span>
          : (
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              <button className="btn btn-outline btn-sm" onClick={() => onModalOpen(a, v)}>Préparer</button>
              <button className="btn btn-ghost btn-sm" onClick={() => onMarquerContacte(v.id)}>✓ Contacté</button>
            </div>
          )}
      </div>
    );
  };

  const Section = ({ title, items }) => {
    if (items.length === 0) return null;
    return (
      <div className="rappels-section">
        <div className="rappels-section-title">{title} <span style={{ color: 'var(--text-3)', fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 400 }}>({items.length})</span></div>
        {items.map((v) => <VaccinRow key={v.id} v={v} />)}
      </div>
    );
  };

  const total = vaccins.length;
  const contactes = vaccins.filter((v) => v.contacte).length;

  return (
    <div>
      <div className="page-label">SUIVI</div>
      <div className="page-title">Rappels vaccins</div>
      <div style={{ color: 'var(--text-3)', fontSize: 12, fontFamily: 'JetBrains Mono', marginBottom: 28 }}>
        {total} vaccins suivis · {contactes} propriétaires contactés
      </div>

      <Section title="⚠️ En retard" items={sections.retard} />
      <Section title="🔴 Cette semaine" items={sections.semaine} />
      <Section title="🟡 Ce mois" items={sections.cemois} />
      <Section title="🔵 Ce trimestre" items={sections.trimestre} />
      <Section title="✓ À jour (> 3 mois)" items={sections.ok} />

      {total === 0 && (
        <div className="empty-state">Aucun vaccin enregistré</div>
      )}
    </div>
  );
}
