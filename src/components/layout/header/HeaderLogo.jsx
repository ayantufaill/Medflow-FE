import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // 1. Import the router navigation hook
import LogoImg from '../../../assets/medflow-logo.png'; 

const HeaderLogo = () => {
  const navigate = useNavigate(); // 2. Initialize the routing navigator function

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        flexShrink: 0 
      }}
    >
      <Box
        component="img"
        src={LogoImg}
        alt="MedFlow Logo"
        onClick={() => navigate('/appointments/operatory-schedule')} // 3. Update path string to match your exact route declaration (e.g., /schedule, /patient-schedule)
        sx={{
          width: '90px',
          height: '45px',
          objectFit: 'contain',
          cursor: 'pointer', // Changes cursor mouse state to a click pointer indicator
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          '&:hover': {
            opacity: 0.85, // Smooth feedback when hovered
          },
          '&:active': {
            transform: 'scale(0.98)', // Subtle click compression effect
          }
        }}
      />
    </Box>
  );
};

export default HeaderLogo;