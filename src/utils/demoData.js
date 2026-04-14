import { calcDateProchain, calcStatut } from './statut.js';

const today = new Date();
const fmt = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonths = (d, n) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; };

export function buildDemoData() {
  const animaux = [
    {
      id: 'a1',
      created_at: fmt(addDays(today, -180)),
      nom: 'Rex',
      espece: 'chien',
      race: 'Berger Allemand',
      date_naissance: fmt(new Date(today.getFullYear() - 4, 3, 12)),
      proprietaire_prenom: 'Jean',
      proprietaire_nom: 'Dupont',
      proprietaire_email: 'jean.dupont@email.fr',
      proprietaire_telephone: '06 12 34 56 78',
    },
    {
      id: 'a2',
      created_at: fmt(addDays(today, -90)),
      nom: 'Mimi',
      espece: 'chat',
      race: 'Européen',
      date_naissance: fmt(new Date(today.getFullYear() - 2, 7, 5)),
      proprietaire_prenom: 'Sophie',
      proprietaire_nom: 'Martin',
      proprietaire_email: 'sophie.martin@email.fr',
      proprietaire_telephone: '06 98 76 54 32',
    },
    {
      id: 'a3',
      created_at: fmt(addDays(today, -200)),
      nom: 'Luna',
      espece: 'chien',
      race: 'Labrador',
      date_naissance: fmt(new Date(today.getFullYear() - 3, 1, 20)),
      proprietaire_prenom: 'Marc',
      proprietaire_nom: 'Bernard',
      proprietaire_email: 'marc.bernard@email.fr',
      proprietaire_telephone: '07 11 22 33 44',
    },
    {
      id: 'a4',
      created_at: fmt(addDays(today, -60)),
      nom: 'Oscar',
      espece: 'chat',
      race: 'Siamois',
      date_naissance: fmt(new Date(today.getFullYear() - 5, 10, 15)),
      proprietaire_prenom: 'Claire',
      proprietaire_nom: 'Petit',
      proprietaire_email: 'claire.petit@email.fr',
      proprietaire_telephone: '06 55 44 33 22',
    },
    {
      id: 'a5',
      created_at: fmt(addDays(today, -30)),
      nom: 'Bella',
      espece: 'lapin',
      race: 'Bélier nain',
      date_naissance: fmt(new Date(today.getFullYear() - 1, 5, 8)),
      proprietaire_prenom: 'Lucie',
      proprietaire_nom: 'Moreau',
      proprietaire_email: 'lucie.moreau@email.fr',
      proprietaire_telephone: '07 66 77 88 99',
    },
  ];

  // Dates prochain vaccin calculées à partir d'aujourd'hui pour coller aux specs
  // Rex → Rage → retard 3 jours (prochain = today - 3)
  const rexProchain = fmt(addDays(today, -3));
  // Mimi → Typhus → aujourd'hui (prochain = today)
  const mimiProchain = fmt(today);
  // Luna → Parvo → dans 5 jours
  const lunaProchain = fmt(addDays(today, 5));
  // Oscar → Leucose → dans 20 jours
  const oscarProchain = fmt(addDays(today, 20));
  // Bella → Rage → dans 45 jours
  const bellaProchain = fmt(addDays(today, 45));

  const vaccins = [
    {
      id: 'v1',
      animal_id: 'a1',
      type: 'Rage',
      date_dernier: fmt(addMonths(today, -12)),
      frequence_mois: 12,
      date_prochain: rexProchain,
      statut: calcStatut(rexProchain),
      contacte: false,
      date_contact: null,
      notes: '',
    },
    {
      id: 'v2',
      animal_id: 'a2',
      type: 'Typhus',
      date_dernier: fmt(addMonths(today, -12)),
      frequence_mois: 12,
      date_prochain: mimiProchain,
      statut: calcStatut(mimiProchain),
      contacte: false,
      date_contact: null,
      notes: '',
    },
    {
      id: 'v3',
      animal_id: 'a3',
      type: 'Parvovirose',
      date_dernier: fmt(addMonths(today, -12)),
      frequence_mois: 12,
      date_prochain: lunaProchain,
      statut: calcStatut(lunaProchain),
      contacte: false,
      date_contact: null,
      notes: '',
    },
    {
      id: 'v4',
      animal_id: 'a4',
      type: 'Leucose',
      date_dernier: fmt(addMonths(today, -12)),
      frequence_mois: 12,
      date_prochain: oscarProchain,
      statut: calcStatut(oscarProchain),
      contacte: false,
      date_contact: null,
      notes: '',
    },
    {
      id: 'v5',
      animal_id: 'a5',
      type: 'Rage',
      date_dernier: fmt(addDays(today, 45 - 12 * 30)),
      frequence_mois: 12,
      date_prochain: bellaProchain,
      statut: calcStatut(bellaProchain),
      contacte: false,
      date_contact: null,
      notes: '',
    },
  ];

  return { animaux, vaccins };
}
