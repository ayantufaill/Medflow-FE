import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  CheckCircleOutline as CheckCircleIcon,
  ContentCopy as CopyIcon,
  Favorite as HeartIcon,
  ThumbUp as ThumbUpIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ChatBubbleIllustration = () => (
  <Box sx={{ position: 'relative', width: 250, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box sx={{ position: 'absolute', top: 10, left: 20, bgcolor: '#ffffff', p: 1.5, borderRadius: 2, borderBottomRightRadius: 0, display: 'flex', gap: 1, alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E5E9F2' }}>
      <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#3B82F6' }} />
      <Box>
        <Box sx={{ width: 80, height: 4, bgcolor: '#94A3B8', mb: 1, borderRadius: 2 }} />
        <Box sx={{ width: 120, height: 4, bgcolor: '#CBD5E1', mb: 1, borderRadius: 2 }} />
        <Box sx={{ width: 60, height: 4, bgcolor: '#CBD5E1', borderRadius: 2 }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: -10, right: -10, bgcolor: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <HeartIcon sx={{ fontSize: '0.8rem', color: '#EF4444' }} />
      </Box>
    </Box>

    <Box sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: '#ffffff', p: 1.5, borderRadius: 2, borderBottomLeftRadius: 0, display: 'flex', gap: 1, alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E5E9F2' }}>
      <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#10B981' }} />
      <Box>
        <Box sx={{ width: 100, height: 4, bgcolor: '#94A3B8', mb: 1, borderRadius: 2 }} />
        <Box sx={{ width: 80, height: 4, bgcolor: '#CBD5E1', borderRadius: 2 }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: -10, right: -10, bgcolor: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <ThumbUpIcon sx={{ fontSize: '0.8rem', color: '#10B981' }} />
      </Box>
    </Box>
  </Box>
);

const ReviewSettings = () => {
  const navigate = useNavigate();
  const [hasTwoNotifications, setHasTwoNotifications] = useState(false);

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B' }}>
            Review Settings
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>
            Customize review options for your office and manage feedback.
          </Typography>
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 4, pb: 10 }}>

      {/* Office Review */}
      <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Office Review</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Enable this setting to activate and customize review options for your office.</Typography>
        </Box>
        <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
      </Box>

      {/* Notification Reminder Setting */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 0.5 }}>Notification Reminder Setting</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Setup how often would you like your patient to receive a review request after their completed appointment.</Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={() => setHasTwoNotifications(true)}
            sx={{ bgcolor: '#3B82F6', textTransform: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, px: 2.5, py: 1, boxShadow: 'none', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}
          >
            + Add Notification
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Notification 1 */}
          <Grid item xs={12} md={hasTwoNotifications ? 6 : 6}>
            <Box sx={{ bgcolor: '#FAFAF9', border: '1px solid #E5E7EB', borderRadius: 3, p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>#1 NOTIFICATION</Typography>
                  <Box sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontSize: '0.65rem', fontWeight: 700, px: 1.5, py: 0.4, borderRadius: 1.5 }}>DEFAULT</Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small"><DeleteIcon sx={{ fontSize: '1.1rem', color: '#EF4444' }} /></IconButton>
                  <IconButton size="small"><EditIcon sx={{ fontSize: '1.1rem', color: '#3B82F6' }} /></IconButton>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Send <Box component="span" sx={{ fontWeight: 600, color: '#1E293B' }}>Review Reminder</Box></Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>→</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>as <Box component="span" sx={{ fontWeight: 600, color: '#1E293B' }}>SMS</Box></Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>→</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>after <Box component="span" sx={{ fontWeight: 600, color: '#1E293B' }}>1 Hours</Box></Typography>
              </Box>
            </Box>
          </Grid>

          {/* Notification 2 */}
          {hasTwoNotifications && (
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: '#FAFAF9', border: '1px solid #E5E7EB', borderRadius: 3, p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>#2 NOTIFICATION</Typography>
                  </Box>
                  <Typography 
                    onClick={() => setHasTwoNotifications(false)}
                    sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#EF4444', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Delete Notification
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Send Review Reminder</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>→</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>as</Typography>
                  <Select size="small" defaultValue="" displayEmpty sx={{ '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#ffffff' } }}>
                    <MenuItem value="" disabled sx={{ fontSize: '0.85rem' }}>Delivery Method</MenuItem>
                    <MenuItem value="SMS" sx={{ fontSize: '0.85rem' }}>SMS</MenuItem>
                    <MenuItem value="Email" sx={{ fontSize: '0.85rem' }}>Email</MenuItem>
                  </Select>
                  <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>→</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>after</Typography>
                  <TextField size="small" defaultValue="1" sx={{ width: 45, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#ffffff' }, '& input': { textAlign: 'center', p: 0 } }} />
                  <Select size="small" defaultValue="" displayEmpty sx={{ '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#ffffff' } }}>
                    <MenuItem value="" disabled sx={{ fontSize: '0.85rem' }}>Frequency</MenuItem>
                    <MenuItem value="Hours" sx={{ fontSize: '0.85rem' }}>Hours</MenuItem>
                    <MenuItem value="Days" sx={{ fontSize: '0.85rem' }}>Days</MenuItem>
                  </Select>
                  <Button variant="contained" sx={{ bgcolor: '#3B82F6', minWidth: 'auto', px: 2, height: 32, fontSize: '0.8rem', borderRadius: '6px', boxShadow: 'none', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}>
                    Add
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Customize Feedback Section */}
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 1 }}>
        Customize Feedback
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 3 }}>
        Customize how you collect and manage patient feedback to enhance your online reputation.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 6 }}>
        {/* Row 1 */}
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Enable Phone Call Requests</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Let patients request a phone call directly through your review process.</Typography>
          </Box>
          <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
        </Box>
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Include a Facebook Review Button</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Add a button in your review emails so patients can leave a review on Facebook.</Typography>
          </Box>
          <Switch sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
        </Box>

        {/* Row 2 */}
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Include a Yelp Review Button</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Add a button in your review emails so patients can leave a review on Yelp.</Typography>
          </Box>
          <Switch sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
        </Box>
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Skip Duplicate Review Requests</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              Avoid sending review requests to patients who have already received one in the past
              <TextField 
                size="small" 
                defaultValue="30" 
                sx={{ width: 50, mx: 1, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.85rem', bgcolor: '#F1F5F9' }, '& input': { textAlign: 'center', p: 0 } }} 
              />
              days.
            </Typography>
          </Box>
        </Box>

        {/* Row 3 */}
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 1 }}>Google Review Link</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#3B82F6', wordBreak: 'break-all' }}>
              https://search.google.com/local/writereview?placeid=ChIJxVQ0i1Tt1hRkDFB...
            </Typography>
            <IconButton size="small" sx={{ color: '#64748b' }}><CopyIcon sx={{ fontSize: '1rem' }} /></IconButton>
          </Box>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: '6px', fontSize: '0.8rem', color: '#475569', borderColor: '#CBD5E1', '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' } }}>
            Regenerate Link
          </Button>
        </Box>
      </Box>

      {/* Reputation Management Section */}
      <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 3, p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0', mb: 4 }}>
        <Box sx={{ flex: 1, pr: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B' }}>Reputation Management</Typography>
            <Box sx={{ bgcolor: '#DCFCE7', color: '#16A34A', fontSize: '0.7rem', fontWeight: 700, px: 1.5, py: 0.4, borderRadius: 1.5 }}>ACTIVE</Box>
          </Box>
          
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 2.5, lineHeight: 1.5 }}>
            With the <Box component="span" sx={{ fontWeight: 600, color: '#1E293B' }}>Automate Plan</Box>, you gain access to our <Box component="span" sx={{ fontWeight: 600, color: '#1E293B' }}>reputation management feature</Box>, allowing you to improve your online reputation by addressing negative reviews before they are published.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { title: 'Gauge Patient Loyalty:', text: 'Collect NPS scores by asking patients how likely they are to recommend your services to friends and family' },
              { title: 'Stay Ahead:', text: "Get instant alerts for reviews below 4/5 before they're published" },
              { title: 'Unlock Powerful Insights:', text: 'Discover what patients really think through detailed review reporting' },
              { title: 'Streamline Your Patients\' Feedback:', text: 'Manage all office reviews in one place' },
              { title: 'Turn Feedback into Action:', text: 'Address concerns and boost patient satisfaction' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: '1.1rem', color: '#3B82F6', mt: 0.1 }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                  <Box component="span" sx={{ fontWeight: 600, color: '#1E293B' }}>{item.title}</Box> {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Switch defaultChecked sx={{ alignSelf: 'flex-end', mb: 2, '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
          <ChatBubbleIllustration />
        </Box>
      </Box>

    </Box>
    </Box>
  );
};

export default ReviewSettings;
