export default function SpeciesIcon({ espece, size = 24 }) {
  const s = size;
  if (espece === 'chien') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="13" rx="7" ry="6" fill="rgba(78,205,140,0.15)" stroke="#4ECD8C" strokeWidth="1.5"/>
      <ellipse cx="9" cy="10" rx="2.5" ry="3.5" fill="rgba(78,205,140,0.15)" stroke="#4ECD8C" strokeWidth="1.5"/>
      <ellipse cx="15" cy="10" rx="2.5" ry="3.5" fill="rgba(78,205,140,0.15)" stroke="#4ECD8C" strokeWidth="1.5"/>
      <circle cx="10" cy="13" r="1" fill="#4ECD8C"/>
      <circle cx="14" cy="13" r="1" fill="#4ECD8C"/>
      <path d="M10.5 15.5 Q12 17 13.5 15.5" stroke="#4ECD8C" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
  if (espece === 'chat') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="14" rx="7" ry="5.5" fill="rgba(78,205,140,0.15)" stroke="#4ECD8C" strokeWidth="1.5"/>
      <polygon points="7,10 5,5 9,9" fill="rgba(78,205,140,0.2)" stroke="#4ECD8C" strokeWidth="1.2" strokeLinejoin="round"/>
      <polygon points="17,10 19,5 15,9" fill="rgba(78,205,140,0.2)" stroke="#4ECD8C" strokeWidth="1.2" strokeLinejoin="round"/>
      <circle cx="10" cy="14" r="1" fill="#4ECD8C"/>
      <circle cx="14" cy="14" r="1" fill="#4ECD8C"/>
      <path d="M11 16 Q12 17.2 13 16" stroke="#4ECD8C" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
  if (espece === 'lapin') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="15" rx="6" ry="5" fill="rgba(78,205,140,0.15)" stroke="#4ECD8C" strokeWidth="1.5"/>
      <ellipse cx="9" cy="8" rx="2" ry="5" fill="rgba(78,205,140,0.15)" stroke="#4ECD8C" strokeWidth="1.5"/>
      <ellipse cx="15" cy="8" rx="2" ry="5" fill="rgba(78,205,140,0.15)" stroke="#4ECD8C" strokeWidth="1.5"/>
      <circle cx="10.5" cy="14.5" r="0.9" fill="#4ECD8C"/>
      <circle cx="13.5" cy="14.5" r="0.9" fill="#4ECD8C"/>
      <path d="M11 16.5 Q12 17.5 13 16.5" stroke="#4ECD8C" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
  // autre
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="7" fill="rgba(78,205,140,0.12)" stroke="#4ECD8C" strokeWidth="1.5"/>
      <text x="12" y="16" textAnchor="middle" fill="#4ECD8C" fontSize="10" fontFamily="Sora,sans-serif">?</text>
    </svg>
  );
}
