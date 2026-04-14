import { useState } from 'react';
import SpeciesIcon from '../components/SpeciesIcon';
import StatusBadge from '../components/StatusBadge';
import { formatDate, calcAge, calcDateProchain, calcStatut } from '../utils/statut';

const TYPES_VACCIN = [
  'Rage', 'Typhus', 'Leucose', 'Parvovirose', 'Toux du chenil',
  'Leptospirose', 'Maladie de Carré', 'Hépatite', 'Autre',
];
const FREQ_OPTIONS = [
  { label: 'Tous les 12 mois', value: 12 },
  { label: 'Tous les 24 mois', value: 24 },
];

export default function FicheAnimal({
  animalId, animaux, vaccins, settings,
  onBack, onModalOpen, onMarquerContacte, onAddVaccin, onRenouvellerVaccin,
}) {
  const animal = animaux.find((a) => a.id === animalId);
  const animalVaccins = vaccins.filter((v) => v.animal_id === animalId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVaccin, setNewVaccin] = useState({
    type: 'Rage', date_dernier: '', frequence_mois: 12, notes: '',
  });

  if (!animal) return (
    <div>
      <button className="back-btn" onClick={onBack}>← Retour</button>
      <div className="empty-state">Animal introuvable</div>
    </div>
  );

  const bestStatut = (() => {
    const ordre = { retard: 0, urgent: 1, bientot: 2, ok: 3 };
    return animalVaccins.reduce((best, v) =>
      !best || ordre[v.statut] < ordre[best.statut] ? v : best, null
    );
  })();

  const handleAddVaccin = () => {
    if (!newVaccin.date_dernier) return;
    const prochain = calcDateProchain(newVaccin.date_dernier, newVaccin.frequence_mois);
    const statut   = calcStatut(prochain);
    onAddVaccin({
      id: `v_${Date.now()}`,
      animal_id: animalId,
      type: newVaccin.type,
      date_dernier: newVaccin.date_dernier,
      frequence_mois: newVaccin.frequence_mois,
      date_prochain: prochain,
      statut,
      contacte: false,
      date_contact: null,
      notes: newVaccin.notes,
    });
    setShowAddForm(false);
    setNewVaccin({ type: 'Rage', date_dernier: '', frequence_mois: 12, notes: '' });
  };

  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Retour aux animaux</button>

      <div className="fiche-header">
        <div className="fiche-icon">
          <SpeciesIcon espece={animal.espece} size={48} />
        </div>
        <div>
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 24, color: 'var(--text-1)', letterSpacing: -0.3 }}>
            {animal.nom}
          </div>
          <div className="fiche-meta">
            {animal.race} · Né{animal.espece === 'lapine' ? 'e' : ''} le {formatDate(animal.date_naissance)} · {animal.proprietaire_prenom} {animal.proprietaire_nom}
          </div>
          {bestStatut && <div style={{ marginTop: 6 }}><StatusBadge statut={bestStatut.statut} /></div>}
        </div>
      </div>

      <div className="fiche-col-layout">
        {/* Colonne gauche */}
        <div className="fiche-col">
          <div className="card">
            <div className="card-title">Informations animal</div>
            <div className="info-row">
              <span className="info-key">Espèce</span>
              <span className="info-value" style={{ textTransform: 'capitalize' }}>{animal.espece}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Race</span>
              <span className="info-value">{animal.race || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Date de naissance</span>
              <span className="info-value">{formatDate(animal.date_naissance)}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Âge</span>
              <span className="info-value">{calcAge(animal.date_naissance)}</span>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Propriétaire</div>
            <div className="contact-info">
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-1)' }}>
                {animal.proprietaire_prenom} {animal.proprietaire_nom}
              </div>
              {animal.proprietaire_email && (
                <div className="contact-row">
                  <span>✉️</span>
                  <a href={`mailto:${animal.proprietaire_email}`}>{animal.proprietaire_email}</a>
                </div>
              )}
              {animal.proprietaire_telephone && (
                <div className="contact-row">
                  <span>📞</span>
                  <a href={`tel:${animal.proprietaire_telephone.replace(/\s/g, '')}`}>{animal.proprietaire_telephone}</a>
                </div>
              )}
              {animalVaccins.length > 0 && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={() => onModalOpen(animal, animalVaccins[0])}
                >
                  Préparer rappel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="fiche-col">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 0 }}>Suivi vaccinal</div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddForm((v) => !v)}>
                + Ajouter vaccin
              </button>
            </div>

            {animalVaccins.length === 0 && !showAddForm && (
              <div className="empty-state" style={{ padding: '24px 0' }}>Aucun vaccin enregistré</div>
            )}

            {animalVaccins.map((v) => (
              <div key={v.id} className="vaccin-row">
                <div className="vaccin-type">
                  {v.type}
                  <StatusBadge statut={v.statut} />
                </div>
                <div className="vaccin-dates">
                  <span>Dernier : <span style={{ color: 'var(--text-2)' }}>{formatDate(v.date_dernier)}</span></span>
                  <span>Prochain : <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{formatDate(v.date_prochain)}</span></span>
                  <span>Fréquence : {v.frequence_mois} mois</span>
                </div>
                {v.contacte && (
                  <div>
                    <span className="contacted-tag">✓ Contacté le {formatDate(v.date_contact)}</span>
                  </div>
                )}
                <div className="vaccin-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => onModalOpen(animal, v)}>
                    Préparer rappel
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => onRenouvellerVaccin(v)}>
                    Renouveler
                  </button>
                  {!v.contacte && (
                    <button className="btn btn-ghost btn-sm" onClick={() => onMarquerContacte(v.id)}>
                      ✓ Contacté
                    </button>
                  )}
                </div>
                {v.notes && (
                  <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                    {v.notes}
                  </div>
                )}
              </div>
            ))}

            {showAddForm && (
              <div className="vaccin-add-form">
                <div className="card-title">Nouveau vaccin</div>
                <div className="form-grid" style={{ marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-select"
                      value={newVaccin.type}
                      onChange={(e) => setNewVaccin((p) => ({ ...p, type: e.target.value }))}
                    >
                      {TYPES_VACCIN.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fréquence</label>
                    <select
                      className="form-select"
                      value={newVaccin.frequence_mois}
                      onChange={(e) => setNewVaccin((p) => ({ ...p, frequence_mois: Number(e.target.value) }))}
                    >
                      {FREQ_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date dernier vaccin *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newVaccin.date_dernier}
                      onChange={(e) => setNewVaccin((p) => ({ ...p, date_dernier: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Optionnel"
                      value={newVaccin.notes}
                      onChange={(e) => setNewVaccin((p) => ({ ...p, notes: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={handleAddVaccin} disabled={!newVaccin.date_dernier}>
                    Ajouter
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
