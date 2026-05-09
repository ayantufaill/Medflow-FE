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
    <Box sx={{ position: 'absolute', top: 10, left: 20, bgcolor: '#e0eef9', p: 1.5, borderRadius: 2, borderBottomRightRadius: 0, display: 'flex', gap: 1, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#00bcd4' }} />
      <Box>
        <Box sx={{ width: 80, height: 4, bgcolor: '#1a3a6b', mb: 1, borderRadius: 2 }} />
        <Box sx={{ width: 120, height: 4, bgcolor: '#1a3a6b', mb: 1, borderRadius: 2 }} />
        <Box sx={{ width: 60, height: 4, bgcolor: '#1a3a6b', borderRadius: 2 }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: -10, right: -10, bgcolor: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <HeartIcon sx={{ fontSize: '0.8rem', color: '#f44336' }} />
      </Box>
    </Box>

    <Box sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: '#e0eef9', p: 1.5, borderRadius: 2, borderBottomLeftRadius: 0, display: 'flex', gap: 1, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#4dd0e1' }} />
      <Box>
        <Box sx={{ width: 100, height: 4, bgcolor: '#1a3a6b', mb: 1, borderRadius: 2 }} />
        <Box sx={{ width: 80, height: 4, bgcolor: '#1a3a6b', borderRadius: 2 }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: -10, right: -10, bgcolor: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <ThumbUpIcon sx={{ fontSize: '0.8rem', color: '#4caf50' }} />
      </Box>
    </Box>
  </Box>
);

const ReviewSettings = () => {
  const navigate = useNavigate();
  const [hasTwoNotifications, setHasTwoNotifications] = useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} sx={{ mb: 2, px: 5, pt: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin');
          }}
          sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#1a3a6b' }}
        >
          Patient Communication
        </Link>
        <Typography sx={{ fontSize: '0.95rem', color: 'text.primary' }}>Review Settings</Typography>
      </Breadcrumbs>

    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3, pb: 10 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#222', mb: 2 }}>
        Review Settings
      </Typography>

      {/* Office Review */}
      <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#222', mb: 0.5 }}>Office Review</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>Enable this setting to activate and customize review options for your office.</Typography>
        </Box>
        <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#4caf50' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4caf50' } }} />
      </Box>

      {/* Notification Reminder Setting */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#222', mb: 0.5 }}>Notification Reminder Setting</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>Setup how often would you like your patient to receive a review request after their completed appointment.</Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={() => setHasTwoNotifications(true)}
            sx={{ bgcolor: '#4f6c9e', textTransform: 'none', borderRadius: 5, fontSize: '0.8rem', fontWeight: 600, '&:hover': { bgcolor: '#3d5682' } }}
          >
            + Add Notification
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Notification 1 */}
          <Grid item xs={12} md={hasTwoNotifications ? 6 : 6}>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #eee', borderRadius: 2, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1a3a6b', letterSpacing: 0.5 }}>#1 NOTIFICATION</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small"><DeleteIcon sx={{ fontSize: '1rem', color: '#d32f2f' }} /></IconButton>
                  <IconButton size="small"><EditIcon sx={{ fontSize: '1rem', color: '#1976d2' }} /></IconButton>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b' }}>Send <span style={{ fontWeight: 600 }}>Review Reminder</span></Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>→</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b' }}>as <span style={{ fontWeight: 600 }}>SMS</span></Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>→</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b' }}>after <span style={{ fontWeight: 600 }}>1 Hours</span></Typography>
              </Box>
            </Box>
          </Grid>

          {/* Notification 2 */}
          {hasTwoNotifications && (
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1a3a6b', letterSpacing: 0.5 }}>#2 NOTIFICATION</Typography>
                  <Typography 
                    onClick={() => setHasTwoNotifications(false)}
                    sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#d32f2f', cursor: 'pointer' }}
                  >
                    Delete Notification
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b' }}>Send Review Reminder</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>→</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b' }}>as</Typography>
                  <Select size="small" defaultValue="" displayEmpty sx={{ '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.75rem' } }}>
                    <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Delivery Method</MenuItem>
                    <MenuItem value="SMS" sx={{ fontSize: '0.75rem' }}>SMS</MenuItem>
                    <MenuItem value="Email" sx={{ fontSize: '0.75rem' }}>Email</MenuItem>
                  </Select>
                  <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>→</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b' }}>after</Typography>
                  <TextField size="small" defaultValue="1" sx={{ width: 40, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.75rem' }, '& input': { textAlign: 'center', p: 0 } }} />
                  <Select size="small" defaultValue="" displayEmpty sx={{ '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.75rem' } }}>
                    <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Frequency</MenuItem>
                    <MenuItem value="Hours" sx={{ fontSize: '0.75rem' }}>Hours</MenuItem>
                    <MenuItem value="Days" sx={{ fontSize: '0.75rem' }}>Days</MenuItem>
                  </Select>
                  <Button variant="contained" sx={{ bgcolor: '#1a3a6b', minWidth: 'auto', px: 2, height: 28, fontSize: '0.7rem', '&:hover': { bgcolor: '#15305a' } }}>
                    Add
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Customize Feedback Section */}
      <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 2 }}>
        Customize how you collect and manage patient feedback to enhance your online reputation.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 6 }}>
        {/* Row 1 */}
        <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#222', mb: 0.5 }}>Enable Phone Call Requests</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>Let patients request a phone call directly through your review process.</Typography>
          </Box>
          <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#4caf50' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4caf50' } }} />
        </Box>
        <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#222', mb: 0.5 }}>Include a Facebook Review Button</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>Add a button in your review emails so patients can leave a review on Facebook.</Typography>
          </Box>
          <Switch />
        </Box>

        {/* Row 2 */}
        <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#222', mb: 0.5 }}>Include a Yelp Review Button</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>Add a button in your review emails so patients can leave a review on Yelp.</Typography>
          </Box>
          <Switch />
        </Box>
        <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#222', mb: 0.5 }}>Skip Duplicate Review Requests</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#555', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              Avoid sending review requests to patients who have already received one in the past
              <TextField 
                size="small" 
                defaultValue="30" 
                sx={{ width: 40, mx: 1, '& .MuiOutlinedInput-root': { height: 24, fontSize: '0.75rem', bgcolor: '#fff' }, '& input': { textAlign: 'center', p: 0 } }} 
              />
              days.
            </Typography>
          </Box>
        </Box>

        {/* Row 3 */}
        <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3, height: '100%' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#222', mb: 1 }}>Google Review Link</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#1976d2', wordBreak: 'break-all' }}>
              https://search.google.com/local/writereview?placeid=ChIJxVQ0i1Tt1hRkDFB...
            </Typography>
            <IconButton size="small"><CopyIcon sx={{ fontSize: '0.9rem', color: '#999' }} /></IconButton>
          </Box>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 5, fontSize: '0.7rem', color: '#1a3a6b', borderColor: '#ccc' }}>
            Regenerate Link
          </Button>
        </Box>
      </Box>

      {/* Reputation Management Section */}
      <Box sx={{ bgcolor: '#f4f9fd', borderRadius: 2, p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e1eff8' }}>
        <Box sx={{ flex: 1, pr: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#222' }}>Reputation Management</Typography>
            <Box sx={{ bgcolor: '#e8f5e9', color: '#4caf50', fontSize: '0.65rem', fontWeight: 700, px: 1, py: 0.2, borderRadius: 1 }}>ACTIVE</Box>
          </Box>
          
          <Typography sx={{ fontSize: '0.8rem', color: '#555', mb: 2, lineHeight: 1.5 }}>
            With the <span style={{ fontWeight: 600, color: '#333' }}>Automate Plan</span>, you gain access to our <span style={{ fontWeight: 600, color: '#333' }}>reputation management feature</span>, allowing you to improve your online reputation by addressing negative reviews before they are published.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { title: 'Gauge Patient Loyalty:', text: 'Collect NPS scores by asking patients how likely they are to recommend your services to friends and family' },
              { title: 'Stay Ahead:', text: "Get instant alerts for reviews below 4/5 before they're published" },
              { title: 'Unlock Powerful Insights:', text: 'Discover what patients really think through detailed review reporting' },
              { title: 'Streamline Your Patients\' Feedback:', text: 'Manage all office reviews in one place' },
              { title: 'Turn Feedback into Action:', text: 'Address concerns and boost patient satisfaction' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: '1rem', color: '#00bcd4', mt: 0.2 }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>
                  <span style={{ fontWeight: 600, color: '#333' }}>{item.title}</span> {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Switch defaultChecked sx={{ alignSelf: 'flex-end', mb: 2, '& .MuiSwitch-switchBase.Mui-checked': { color: '#4caf50' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4caf50' } }} />
          <ChatBubbleIllustration />
        </Box>
      </Box>

    </Box>
    </Box>
  );
};

export default ReviewSettings;
