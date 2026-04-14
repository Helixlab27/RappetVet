import { useState } from 'react';
import { calcDateProchain, calcStatut } from '../utils/statut';

const TYPES_VACCIN = [
  'Rage', 'Typhus', 'Leucose', 'Parvovirose', 'Toux du chenil',
  'Leptospirose', 'Maladie de Carré', 'Hépatite', 'Autre',
];
const FREQ_OPTIONS = [
  { label: 'Tous les 12 mois', value: 12 },
  { label: 'Tous les 24 mois', value: 24 },
];

const INIT = {
  nom: '', espece: 'chien', race: '', date_naissance: '',
  proprietaire_prenom: '', proprietaire_nom: '', proprietaire_email: '', proprietaire_telephone: '',
  vaccin_type: 'Rage', vaccin_date_dernier: '', vaccin_frequence: 12,
};

export default function NouvelAnimal({ onSave, onCancel }) {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setN = (k) => (e) => setForm((p) => ({ ...p, [k]: Number(e.target.value) }));

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = true;
    if (!form.espece) e.espece = true;
    if (!form.proprietaire_prenom.trim()) e.proprietaire_prenom = true;
    if (!form.proprietaire_nom.trim()) e.proprietaire_nom = true;
    if (!form.vaccin_type) e.vaccin_type = true;
    if (!form.vaccin_date_dernier) e.vaccin_date_dernier = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const animalId = `a_${Date.now()}`;
    const prochain = calcDateProchain(form.vaccin_date_dernier, form.vaccin_frequence);
    const animal = {
      id: animalId,
      created_at: new Date().toISOString().slice(0, 10),
      nom: form.nom.trim(),
      espece: form.espece,
      race: form.race.trim(),
      date_naissance: form.date_naissance,
      proprietaire_prenom: form.proprietaire_prenom.trim(),
      proprietaire_nom: form.proprietaire_nom.trim(),
      proprietaire_email: form.proprietaire_email.trim(),
      proprietaire_telephone: form.proprietaire_telephone.trim(),
    };
    const vaccin = {
      id: `v_${Date.now()}`,
      animal_id: animalId,
      type: form.vaccin_type,
      date_dernier: form.vaccin_date_dernier,
      frequence_mois: form.vaccin_frequence,
      date_prochain: prochain,
      statut: calcStatut(prochain),
      contacte: false,
      date_contact: null,
      notes: '',
    };
    onSave(animal, vaccin);
  };

  const err = (k) => errors[k] ? { borderColor: 'var(--red)' } : {};

  return (
    <div>
      <div className="page-label">ENREGISTREMENT</div>
      <div className="page-title">Nouvel animal</div>
      <div style={{ color: 'var(--text-3)', fontSize: 12, fontFamily: 'JetBrains Mono', marginBottom: 28 }}>
        Remplissez les informations ci-dessous · * champs obligatoires
      </div>

      {/* Card 1 — Animal */}
      <div className="card">
        <div className="card-title">Animal</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input
              className="form-input"
              placeholder="Ex. Rex"
              value={form.nom}
              onChange={set('nom')}
              style={err('nom')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Espèce *</label>
            <select
              className="form-select"
              value={form.espece}
              onChange={set('espece')}
              style={err('espece')}
            >
              <option value="chien">Chien</option>
              <option value="chat">Chat</option>
              <option value="lapin">Lapin</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Race</label>
            <input
              className="form-input"
              placeholder="Ex. Berger Allemand"
              value={form.race}
              onChange={set('race')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date de naissance</label>
            <input
              type="date"
              className="form-input"
              value={form.date_naissance}
              onChange={set('date_naissance')}
            />
          </div>
        </div>
      </div>

      {/* Card 2 — Propriétaire */}
      <div className="card">
        <div className="card-title">Propriétaire</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Prénom *</label>
            <input
              className="form-input"
              placeholder="Ex. Jean"
              value={form.proprietaire_prenom}
              onChange={set('proprietaire_prenom')}
              style={err('proprietaire_prenom')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input
              className="form-input"
              placeholder="Ex. Dupont"
              value={form.proprietaire_nom}
              onChange={set('proprietaire_nom')}
              style={err('proprietaire_nom')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="jean.dupont@email.fr"
              value={form.proprietaire_email}
              onChange={set('proprietaire_email')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              type="tel"
              className="form-input"
              placeholder="06 12 34 56 78"
              value={form.proprietaire_telephone}
              onChange={set('proprietaire_telephone')}
            />
          </div>
        </div>
      </div>

      {/* Card 3 — Premier vaccin */}
      <div className="card">
        <div className="card-title">Premier vaccin</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Type de vaccin *</label>
            <select
              className="form-select"
              value={form.vaccin_type}
              onChange={set('vaccin_type')}
              style={err('vaccin_type')}
            >
              {TYPES_VACCIN.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Fréquence</label>
            <select
              className="form-select"
              value={form.vaccin_frequence}
              onChange={setN('vaccin_frequence')}
            >
              {FREQ_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div className="form-group span2">
            <label className="form-label">Date du dernier vaccin *</label>
            <input
              type="date"
              className="form-input"
              value={form.vaccin_date_dernier}
              onChange={set('vaccin_date_dernier')}
              style={err('vaccin_date_dernier')}
            />
          </div>
        </div>

        {form.vaccin_date_dernier && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, fontSize: 12, fontFamily: 'JetBrains Mono', color: 'var(--text-2)' }}>
            Prochain rappel calculé : <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              {(() => {
                const d = calcDateProchain(form.vaccin_date_dernier, form.vaccin_frequence);
                return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
              })()}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button className="btn btn-ghost" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          ✓ Enregistrer l'animal
        </button>
      </div>
    </div>
  );
}
