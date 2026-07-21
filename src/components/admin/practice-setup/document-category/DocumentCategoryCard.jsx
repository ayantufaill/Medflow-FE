import { Box, Typography, IconButton, Button } from '@mui/material';
import EditIcon from '../../../../assets/practicesetupicon/editicon.svg';
import DeleteIcon from '../../../../assets/practicesetupicon/deleteicon.svg';

const DocumentCategoryCard = ({
  title,
  icon,
  items,
  type,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px', bgcolor: '#F2F6FC', borderBottom: '0.8px solid #e0e0e0' }}>
        <img src={icon} alt={title} style={{ width: 24, height: 24, marginRight: 12 }} />
        <Typography variant="subtitle2" fontWeight={600} color="#11223F">
          {title}
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2 }}>
        {/* Reset Colors Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: '20px', fontWeight: 500, py: 0.2 }}>
            Reset Colors
          </Button>
        </Box>

        {/* List */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Typography variant="body2" color="#666" sx={{ fontWeight: 500 }}>
                {item}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => onEdit(type, index, item)} sx={{ p: 0.5 }}>
                  <img src={EditIcon} alt="Edit" style={{ width: 16, height: 16 }} />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(type, index)} sx={{ p: 0.5 }}>
                  <img src={DeleteIcon} alt="Delete" style={{ width: 16, height: 16 }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            color="#9e9e9e"
            sx={{ cursor: 'pointer', display: 'inline-block' }}
            onClick={() => onAdd(type)}
          >
            + Show {type === 'document' ? 'documents' : 'Categories'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentCategoryCard;
