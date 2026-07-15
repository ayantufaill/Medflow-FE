import { Typography } from '@mui/material';
import { DrawOutlined as SignatureIcon } from '@mui/icons-material';
import RightPanelCard from '../appointments/right-panel/RightPanelCard';
import SignaturePad from '../shared/SignaturePad';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';

// Sidebar counterpart to PatientSignatureSection — same RightPanelCard shell
// as Task List / Messages so the medical history sidebar reads as one
// consistent column instead of mixing card styles.
const PatientSignatureCard = ({ value, onChange, reviewedWithPatient }) => (
  <RightPanelCard icon={<SignatureIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />} title="Signature">
    <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 1 }}>
      Patient / Guardian Signature
    </Typography>
    <SignaturePad width={228} height={72} value={value} onChange={onChange} showClearButton={true} />
    {reviewedWithPatient && (
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.STATUS_SUCCESS, mt: 1 }}>
        ✓ Reviewed with patient
      </Typography>
    )}
  </RightPanelCard>
);

export default PatientSignatureCard;
