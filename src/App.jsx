import { useState, useMemo } from 'react';
import Cursor      from './components/Cursor';
import Sidebar     from './components/Sidebar';
import Toast       from './components/Toast';
import ModalRappel from './components/ModalRappel';

import Dashboard    from './pages/Dashboard';
import Animaux      from './pages/Animaux';
import FicheAnimal  from './pages/FicheAnimal';
import NouvelAnimal from './pages/NouvelAnimal';
import Rappels      from './pages/Rappels';
import Parametres   from './pages/Parametres';

import { useStorage }    from './hooks/useStorage';
import { useToast }      from './hooks/useToast';
import { buildDemoData } from './utils/demoData';
import { calcDateProchain, calcStatut } from './utils/statut';

const DEFAULT_SETTINGS = {
  nom_clinique: 'Clinique Vétérinaire',
  telephone: '',
  email: '',
  adresse: '',
};

export default function App() {
  const [page, setPage]                   = useState('dashboard');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modal, setModal]                 = useState(null);
  const [menuOpen, setMenuOpen]           = useState(false);

  const { toasts, addToast } = useToast();

  // ── Data ─────────────────────────────────────────────────────
  const [animaux, setAnimaux]   = useStorage('rv_animaux', null);
  const [vaccins, setVaccins]   = useStorage('rv_vaccins', null);
  const [settings, setSettings] = useStorage('rv_settings', DEFAULT_SETTINGS);

  const [animauxData, vaccinsData] = useMemo(() => {
    if (animaux === null || vaccins === null) {
      const demo = buildDemoData();
      if (animaux === null) {
        try { localStorage.setItem('rv_animaux', JSON.stringify(demo.animaux)); } catch {}
      }
      if (vaccins === null) {
        try { localStorage.setItem('rv_vaccins', JSON.stringify(demo.vaccins)); } catch {}
      }
      return [animaux ?? demo.animaux, vaccins ?? demo.vaccins];
    }
    return [animaux, vaccins];
  }, [animaux, vaccins]);

  // ── Handlers ──────────────────────────────────────────────────
  const navigate = (p) => { setPage(p); setMenuOpen(false); };

  const resetDemo = () => {
    if (!confirm('Réinitialiser toutes les données avec les données de démo ?')) return;
    const demo = buildDemoData();
    setAnimaux(demo.animaux);
    setVaccins(demo.vaccins);
    navigate('dashboard');
    addToast('Données de démo rechargées');
  };

  const marquerContacte = (vaccinId) => {
    setVaccins((prev) =>
      prev.map((v) =>
        v.id === vaccinId
          ? { ...v, contacte: true, date_contact: new Date().toISOString().slice(0, 10) }
          : v
      )
    );
    addToast('Propriétaire marqué comme contacté');
  };

  const deleteAnimal = (animalId) => {
    setAnimaux((prev) => prev.filter((a) => a.id !== animalId));
    setVaccins((prev) => prev.filter((v) => v.animal_id !== animalId));
    addToast('Animal supprimé');
  };

  const saveNouvelAnimal = (animal, vaccin) => {
    setAnimaux((prev) => [...prev, animal]);
    setVaccins((prev) => [...prev, vaccin]);
    navigate('animaux');
    addToast(`${animal.nom} enregistré avec succès`);
  };

  const addVaccin = (vaccin) => {
    setVaccins((prev) => [...prev, vaccin]);
    addToast('Vaccin ajouté');
  };

  const renouvellerVaccin = (oldVaccin) => {
    const today   = new Date().toISOString().slice(0, 10);
    const prochain = calcDateProchain(today, oldVaccin.frequence_mois);
    const statut   = calcStatut(prochain);
    setVaccins((prev) => prev.map((v) =>
      v.id === oldVaccin.id
        ? { ...v, date_dernier: today, date_prochain: prochain, statut, contacte: false, date_contact: null }
        : v
    ));
    addToast(`Vaccin ${oldVaccin.type} renouvelé`);
  };

  const urgentCount = useMemo(() =>
    vaccinsData.filter((v) => (v.statut === 'urgent' || v.statut === 'retard') && !v.contacte).length,
    [vaccinsData]
  );

  // ── Page render ───────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            animaux={animauxData}
            vaccins={vaccinsData}
            settings={settings}
            onSetPage={navigate}
            onModalOpen={(a, v) => setModal({ animal: a, vaccin: v })}
            onMarquerContacte={marquerContacte}
          />
        );
      case 'animaux':
        return (
          <Animaux
            animaux={animauxData}
            vaccins={vaccinsData}
            onSetPage={navigate}
            onSelectAnimal={setSelectedAnimal}
            onDelete={deleteAnimal}
          />
        );
      case 'fiche-animal':
        return (
          <FicheAnimal
            animalId={selectedAnimal}
            animaux={animauxData}
            vaccins={vaccinsData}
            settings={settings}
            onBack={() => navigate('animaux')}
            onModalOpen={(a, v) => setModal({ animal: a, vaccin: v })}
            onMarquerContacte={marquerContacte}
            onAddVaccin={addVaccin}
            onRenouvellerVaccin={renouvellerVaccin}
          />
        );
      case 'nouvel-animal':
        return (
          <NouvelAnimal
            onSave={saveNouvelAnimal}
            onCancel={() => navigate('animaux')}
          />
        );
      case 'rappels':
        return (
          <Rappels
            animaux={animauxData}
            vaccins={vaccinsData}
            onModalOpen={(a, v) => setModal({ animal: a, vaccin: v })}
            onMarquerContacte={marquerContacte}
          />
        );
      case 'parametres':
        return <Parametres settings={settings} onSave={setSettings} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Cursor />
      <div className="grain-overlay" />

      {/* ── Barre mobile fixe ──────────────────────────────── */}
      <header className="mobile-header">
        <button className="hamburger-btn" onClick={() => setMenuOpen(true)} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4.5"  width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="9.25" width="16" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="14"   width="16" height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
        </button>
        <span className="mobile-logo">RappelVet</span>
        {urgentCount > 0 && (
          <span className="mobile-header-badge">{urgentCount}</span>
        )}
      </header>

      {/* ── Backdrop sidebar ───────────────────────────────── */}
      {menuOpen && (
        <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      <div className="app-layout">
        <Sidebar
          page={page}
          setPage={navigate}
          urgentCount={urgentCount}
          settings={settings}
          onResetDemo={resetDemo}
          isOpen={menuOpen}
        />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>

      {modal && (
        <ModalRappel
          animal={modal.animal}
          vaccin={modal.vaccin}
          settings={settings}
          onClose={() => setModal(null)}
          onContacte={() => marquerContacte(modal.vaccin.id)}
        />
      )}
      <Toast toasts={toasts} />
    </>
  );
}
