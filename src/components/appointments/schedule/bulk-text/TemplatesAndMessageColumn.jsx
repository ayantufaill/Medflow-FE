import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { COLORS } from '../../../../constants/colors';
import { radius, fontWeight } from '../../../../constants/styles';

const TemplatesAndMessageColumn = ({ subject, setSubject, message, setMessage, templates, handleTemplateClick }) => {
  return (
    <Box sx={{ width: '367px', height: '100%', flexShrink: 0, borderRadius: '12px', border: `1px solid ${COLORS.BORDER_LIGHT}`, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Right Header */}
      <Box sx={{ p: '16px', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, backgroundColor: COLORS.WHITE }}>
        <Typography sx={{ fontSize: '16px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
          Templates & Custom Messages
        </Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', mt: '4px' }}>
          USE TEMPLATE OR WRITE CUSTOM MESSAGE
        </Typography>
      </Box>

      <Box sx={{ p: '16px', overflowY: 'auto', flex: 1 }}>
        {/* Templates */}
        <Box sx={{ mb: '20px' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: '12px' }}>
            Templates
          </Typography>
          
          {templates.map((tmpl) => (
            <Box key={tmpl.id} sx={{ mb: '12px', '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '6px' }}>
                <ContentCopyIcon sx={{ fontSize: '14px', color: COLORS.TEXT_SECONDARY }} />
                <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>
                  {tmpl.title}
                </Typography>
              </Box>
              <Box
                onClick={() => handleTemplateClick(tmpl)}
                sx={{
                  p: '12px',
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  borderRadius: radius.md,
                  backgroundColor: COLORS.WHITE,
                  cursor: 'pointer',
                  '&:hover': { borderColor: COLORS.ACCENT, backgroundColor: '#f0f5ff' }
                }}
              >
                <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, lineHeight: 1.5 }}>
                  {tmpl.subject ? <Box component="span" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>Subject: {tmpl.subject}</Box> : null}
                  {tmpl.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Message Area */}
        <Box>
          <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: '8px' }}>
            Email Content
          </Typography>
          
          <TextField
            fullWidth
            placeholder="Subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              mb: 1.5,
              backgroundColor: COLORS.WHITE,
              '& .MuiOutlinedInput-root': {
                borderRadius: radius.md,
                fontSize: '13px',
                fontFamily: 'Inter',
              }
            }}
          />

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Add your message..."
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= 1100) setMessage(e.target.value);
            }}
            variant="outlined"
            sx={{
              backgroundColor: COLORS.WHITE,
              '& .MuiOutlinedInput-root': {
                borderRadius: radius.md,
                fontSize: '13px',
                fontFamily: 'Inter',
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '4px', mb: '8px' }}>
            <Typography sx={{ fontSize: '10px', color: COLORS.TEXT_SECONDARY }}>
              {message.length}/1100
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '11px', color: COLORS.TEXT_SECONDARY, fontStyle: 'italic', lineHeight: 1.4 }}>
            The system will automatically add the practice name and contact info to the end of your email message
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TemplatesAndMessageColumn;
