import { Box } from '@mui/material';

export const ChoiceIcon = () => (
  <Box sx={{ width: 12, height: 12, backgroundColor: '#f56565', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, mt: 0.5 }}>
    <Box sx={{ width: 6, height: 1.5, backgroundColor: 'white' }} />
  </Box>
);

export const ChecklistIcon = ({ iconId, color = '#1a3a6b' }) => {
  const icons = {
    'syringe-h': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 7l4 4-4 4" />
        <path d="M10 11h12" />
        <rect x="2" y="8" width="8" height="6" rx="1" />
        <path d="M2 11h-1" />
      </svg>
    ),
    'syringe-v': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 10v12" />
        <path d="M7 18l4 4 4-4" />
        <rect x="8" y="2" width="6" height="8" rx="1" />
      </svg>
    ),
    'mask': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10c0-2 2-4 8-4s8 2 8 4-2 6-8 6-8-4-8-6z" />
        <path d="M4 10s-2 0-2 2v2" />
        <path d="M20 10s2 0 2 2v2" />
      </svg>
    ),
    'tooth-pulp': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 8c-1 0-2 1-2 2v4c0 1 1 2 2 2s2-1 2-2v-4c0-1-1-2-2-2z" fill="#f56565" stroke="none" />
      </svg>
    ),
    'tooth-fill': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 6h4v8h-4z" fill="#cbd5e0" stroke="none" />
      </svg>
    ),
    'tooth-prep': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 4v4M10 6h4" />
      </svg>
    ),
    'bonding': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    'bridge': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <rect x="2" y="12" width="4" height="6" />
        <rect x="18" y="12" width="4" height="6" />
        <rect x="10" y="12" width="4" height="6" />
      </svg>
    ),
    'post': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M8 6h8M8 18h8" />
      </svg>
    ),
    'instrument': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    ),
    'spray': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 8c0-3 2-5 5-5s5 2 5 5-2 5-5 5M10 8v12M7 16h6" />
      </svg>
    ),
    'tray': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
        <path d="M6 10h12" />
      </svg>
    ),
    'tooth-yellow': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#FDE047" stroke="none" />
      </svg>
    ),
    'tooth-pink': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#F472B6" stroke="none" />
      </svg>
    ),
    'tooth-blue': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#60A5FA" stroke="none" />
      </svg>
    ),
    'tooth-green': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#4ADE80" stroke="none" />
      </svg>
    ),
    'tooth-purple': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#C084FC" stroke="none" />
      </svg>
    ),
    'instrument-blue': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    ),
    'instrument-pink': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    )
  };

  return (
    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icons[iconId] || icons['tooth-prep']}
    </Box>
  );
};
