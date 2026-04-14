import { useState } from 'react';
import { formatDate } from '../utils/statut';

export default function ModalRappel({ animal, vaccin, settings, onClose, onContacte }) {
  const [copied, setCopied] = useState(false);

  if (!animal || !vaccin) return null;

  const clinique      = settings?.nom_clinique ?? 'Notre clinique';
  const telClinique   = settings?.telephone    ?? '';
  const emailClinique = settings?.email        ?? '';

  const prenom    = animal.proprietaire_prenom;
  const emailProp = animal.proprietaire_email ?? '';

  const emailSubject = `Rappel vaccin ${vaccin.type} — ${animal.nom}`;
  const emailBody = `Bonjour ${prenom},

Nous vous contactons de la part de ${clinique} au sujet de votre animal ${animal.nom} (${animal.espece}${animal.race ? `, ${animal.race}` : ''}).

Son vaccin contre ${vaccin.type} arrive à échéance le ${formatDate(vaccin.date_prochain)}.

Afin d'éviter toute interruption de protection, nous vous invitons à prendre rendez-vous dès que possible.
${telClinique ? `\n📞 ${telClinique}` : ''}${emailClinique ? `\n✉️  ${emailClinique}` : ''}

À très bientôt,
L'équipe de ${clinique}`;

  const mailtoHref = `mailto:${emailProp}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const copyEmail = () => {
    navigator.clipboard.writeText(emailBody).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleContacte = () => {
    onContacte();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-title">Préparer le rappel</div>
        <div className="modal-sub">
          {animal.nom} · {vaccin.type} · échéance {formatDate(vaccin.date_prochain)}
        </div>

        <div className="modal-template">{emailBody}</div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={copyEmail}>
            {copied ? '✓ Copié !' : '📋 Copier l\'email'}
          </button>
          {emailProp ? (
            <a href={mailtoHref} className="btn btn-primary">
              ✉️ Ouvrir ma messagerie
            </a>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', alignSelf: 'center' }}>
              Aucun email renseigné
            </span>
          )}
        </div>

        <div className="modal-contact-btn">
          {vaccin.contacte ? (
            <div className="modal-contacted-badge">
              ✓ Contacté le {formatDate(vaccin.date_contact)}
            </div>
          ) : (
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleContacte}>
              ✓ Marquer comme contacté
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
