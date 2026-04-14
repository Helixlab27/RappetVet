import { useState } from 'react';

export default function Parametres({ settings, onSave }) {
  const [form, setForm] = useState({
    nom_clinique: settings?.nom_clinique ?? '',
    telephone:    settings?.telephone    ?? '',
    email:        settings?.email        ?? '',
    adresse:      settings?.adresse      ?? '',
  });
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="page-label">CONFIGURATION</div>
      <div className="page-title">Paramètres</div>
      <div style={{ color: 'var(--text-3)', fontSize: 12, fontFamily: 'JetBrains Mono', marginBottom: 28 }}>
        Informations de votre clinique utilisées dans les modèles de rappels
      </div>

      <div className="card">
        <div className="card-title">Clinique vétérinaire</div>
        <div className="settings-info">
          Ces informations apparaissent dans les messages de rappel générés automatiquement pour les propriétaires.
        </div>
        <div className="form-grid">
          <div className="form-group span2">
            <label className="form-label">Nom de la clinique</label>
            <input
              className="form-input"
              placeholder="Ex. Clinique Vétérinaire du Parc"
              value={form.nom_clinique}
              onChange={set('nom_clinique')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              type="tel"
              className="form-input"
              placeholder="01 23 45 67 89"
              value={form.telephone}
              onChange={set('telephone')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="contact@clinique.fr"
              value={form.email}
              onChange={set('email')}
            />
          </div>
          <div className="form-group span2">
            <label className="form-label">Adresse</label>
            <input
              className="form-input"
              placeholder="12 rue des Lilas, 75001 Paris"
              value={form.adresse}
              onChange={set('adresse')}
            />
          </div>
        </div>
        <div className="settings-row" style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? '✓ Enregistré !' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">À propos</div>
        <div className="info-row">
          <span className="info-key">Application</span>
          <span className="info-value">RappelVet</span>
        </div>
        <div className="info-row">
          <span className="info-key">Slogan</span>
          <span className="info-value" style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
            Zéro patient oublié.
          </span>
        </div>
        <div className="info-row">
          <span className="info-key">Stockage</span>
          <span className="info-value">localStorage uniquement</span>
        </div>
        <div className="info-row">
          <span className="info-key">Version</span>
          <span className="info-value">1.0.0</span>
        </div>
      </div>
    </div>
  );
}
