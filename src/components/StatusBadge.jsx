import { statutLabel } from '../utils/statut';

const dots = { ok: '●', bientot: '◆', urgent: '▲', retard: '▲' };

export default function StatusBadge({ statut }) {
  return (
    <span className={`badge badge-${statut}`}>
      {dots[statut] ?? '●'} {statutLabel(statut)}
    </span>
  );
}
