/**
 * Calcule le statut vaccinal selon le nombre de jours avant l'échéance
 * > 30j  → 'ok'
 * 7-30j  → 'bientot'
 * 0-7j   → 'urgent'
 * dépassé→ 'retard'
 */
export function calcStatut(dateProchain) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(dateProchain);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'retard';
  if (diff <= 7) return 'urgent';
  if (diff <= 30) return 'bientot';
  return 'ok';
}

export function calcDateProchain(dateDernier, frequenceMois) {
  const d = new Date(dateDernier);
  d.setMonth(d.getMonth() + frequenceMois);
  return d.toISOString().slice(0, 10);
}

export function joursRestants(dateProchain) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(dateProchain);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - now) / (1000 * 60 * 60 * 24));
}

export function statutLabel(statut) {
  const labels = { ok: 'OK', bientot: 'Bientôt', urgent: 'Urgent', retard: 'Retard' };
  return labels[statut] ?? statut;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function calcAge(dateNaissance) {
  if (!dateNaissance) return '—';
  const now = new Date();
  const d = new Date(dateNaissance);
  let years = now.getFullYear() - d.getFullYear();
  let months = now.getMonth() - d.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years === 0) return `${months} mois`;
  if (months === 0) return `${years} ans`;
  return `${years} ans ${months} mois`;
}
