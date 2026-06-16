import { Box, Typography, Stack } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fontSize } from "../../../constants/styles";

const SurveyRow = ({ label, hasChat = false, onLabelClick, children }) => (
  <Box sx={{ py: 1 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Stack 
        direction="row" 
        spacing={0.5} 
        alignItems="center"
        onClick={onLabelClick}
        sx={onLabelClick ? { cursor: 'pointer', '&:hover': { opacity: 0.8 } } : {}}
      >
        <Typography sx={{ fontSize: fontSize.sm, color: '#333', fontWeight: onLabelClick ? 'bold' : 'normal' }}>{label}</Typography>
        {hasChat && <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb' }} />}
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        {children}
      </Box>
    </Stack>
  </Box>
);

export default SurveyRow;
