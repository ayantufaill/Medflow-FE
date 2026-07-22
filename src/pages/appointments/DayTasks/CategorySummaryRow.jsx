import { Box, Typography } from '@mui/material';
import { 
  LocalHospitalOutlined, 
  HistoryEduOutlined, 
  AttachMoneyOutlined, 
  CalendarTodayOutlined,
  EventBusyOutlined,
  FactCheckOutlined,
  HealthAndSafetyOutlined
} from '@mui/icons-material';
import { radius } from '../../../constants/styles';

const CATEGORY_ICONS = {
  medicalHistory: <LocalHospitalOutlined fontSize="small" />,
  consentForms: <HistoryEduOutlined fontSize="small" />,
  outstandingBalance: <AttachMoneyOutlined fontSize="small" />,
  unconfirmedAppts: <CalendarTodayOutlined fontSize="small" />,
  unscheduledTreatments: <EventBusyOutlined fontSize="small" />,
  eligibilityChecks: <FactCheckOutlined fontSize="small" />,
  noFutureHygs: <HealthAndSafetyOutlined fontSize="small" />,
};

const CategorySummaryRow = ({ categories }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 3, 
      flexWrap: 'nowrap', 
      overflowX: 'auto', 
      pb: 1,
      // Hide scrollbar but keep functionality
      '&::-webkit-scrollbar': { display: 'none' },
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    }}>
      {categories.map((category) => (
        <Box
          key={category.id}
          sx={{
            flex: 1,
            minWidth: '150px',
            bgcolor: category.color,
            p: 2,
            borderRadius: radius.md,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: category.headerColor
          }}
        >
          {CATEGORY_ICONS[category.id] || <FactCheckOutlined fontSize="small" />}
          <Typography sx={{ fontSize: '13px', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
            {category.title}
          </Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: 700, mt: 0.5 }}>
            {category.count}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CategorySummaryRow;
