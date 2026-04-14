import { useState, useMemo } from 'react';
import Cursor      from './components/Cursor';
import Sidebar     from './components/Sidebar';
import Toast       from './components/Toast';
import ModalRappel from './components/ModalRappel';

import Dashboard   from './pages/Dashboard';
import Animaux     from './pages/Animaux';
import FicheAnimal from './pages/FicheAnimal';
import NouvelAnimal from './pages/NouvelAnimal';
import Rappels     from './pages/Rappels';
import Parametres  from './pages/Parametres';

import { useStorage }  from './hooks/useStorage';
import { useToast }    from './hooks/useToast';
import { buildDemoData } from './utils/demoData';
import { calcDateProchain, calcStatut } from './utils/statut';

const DEFAULT_SETTINGS = {
  nom_clinique: 'Clinique Vétérinaire',
  telephone: '',
  email: '',
  adresse: '',
};

function initData(key, defaultVal) {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return JSON.parse(v);
  } catch {}
  return defaultVal;
}

export default function App() {
  const [page, setPage]           = useState('dashboard');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modal, setModal]         = useState(null); // { animal, vaccin }

  const { toasts, addToast } = useToast();

  // ── Data ────────────────────────────────────────────────────
  const [animaux, setAnimaux]   = useStorage('rv_animaux', null);
  const [vaccins, setVaccins]   = useStorage('rv_vaccins', null);
  const [settings, setSettings] = useStorage('rv_settings', DEFAULT_SETTINGS);

  // Init démo si première fois
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

  // ── Handlers ─────────────────────────────────────────────────
  const resetDemo = () => {
    if (!confirm('Réinitialiser toutes les données avec les données de démo ?')) return;
    const demo = buildDemoData();
    setAnimaux(demo.animaux);
    setVaccins(demo.vaccins);
    setPage('dashboard');
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
    setPage('animaux');
    addToast(`${animal.nom} enregistré avec succès`);
  };

  const addVaccin = (vaccin) => {
    setVaccins((prev) => [...prev, vaccin]);
    addToast('Vaccin ajouté');
  };

  const renouvellerVaccin = (oldVaccin) => {
    const today = new Date().toISOString().slice(0, 10);
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

  // ── Render page ──────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            animaux={animauxData}
            vaccins={vaccinsData}
            settings={settings}
            onSetPage={setPage}
            onModalOpen={(a, v) => setModal({ animal: a, vaccin: v })}
            onMarquerContacte={marquerContacte}
          />
        );
      case 'animaux':
        return (
          <Animaux
            animaux={animauxData}
            vaccins={vaccinsData}
            onSetPage={setPage}
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
            onBack={() => setPage('animaux')}
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
            onCancel={() => setPage('animaux')}
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
      <div className="app-layout">
        <Sidebar
          page={page}
          setPage={setPage}
          urgentCount={urgentCount}
          settings={settings}
          onResetDemo={resetDemo}
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
