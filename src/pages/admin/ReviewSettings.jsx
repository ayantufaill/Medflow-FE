import React, { useState, useEffect } from 'react';
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
  CircularProgress,
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

import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

import { useNavigate } from 'react-router-dom';
import { communicationService } from '../../services/communication.service';

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
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);
  
  const [isActive, setIsActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [enablePhoneCallRequests, setEnablePhoneCallRequests] = useState(false);
  const [includeFacebookReview, setIncludeFacebookReview] = useState(false);
  const [includeYelpReview, setIncludeYelpReview] = useState(false);
  const [skipDuplicateDays, setSkipDuplicateDays] = useState(30);
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [reputationManagementActive, setReputationManagementActive] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getReviewSettings();
      const parsedData = {
        isActive: data.isActive || false,
        notifications: data.notifications || [],
        enablePhoneCallRequests: data.enablePhoneCallRequests || false,
        includeFacebookReview: data.includeFacebookReview || false,
        includeYelpReview: data.includeYelpReview || false,
        skipDuplicateDays: parseInt(data.skipDuplicateDays) || 30,
        googleReviewLink: data.googleReviewLink || '',
        reputationManagementActive: data.reputationManagementActive || false,
      };
      
      setInitialData(parsedData);
      setIsActive(parsedData.isActive);
      setNotifications(parsedData.notifications);
      setEnablePhoneCallRequests(parsedData.enablePhoneCallRequests);
      setIncludeFacebookReview(parsedData.includeFacebookReview);
      setIncludeYelpReview(parsedData.includeYelpReview);
      setSkipDuplicateDays(parsedData.skipDuplicateDays);
      setGoogleReviewLink(parsedData.googleReviewLink);
      setReputationManagementActive(parsedData.reputationManagementActive);
    } catch (error) {
      console.error('Error fetching review settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentData = {
    isActive,
    notifications,
    enablePhoneCallRequests,
    includeFacebookReview,
    includeYelpReview,
    skipDuplicateDays: parseInt(skipDuplicateDays) || 30,
    googleReviewLink,
    reputationManagementActive
  };

  const isDirty = initialData && JSON.stringify(initialData) !== JSON.stringify(currentData);

  const handleSave = async () => {
    if (!isDirty) return;
    try {
      setSaving(true);
      await communicationService.updateReviewSettings(currentData);
      setInitialData(currentData);
    } catch (error) {
      console.error('Error saving review settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNotification = () => {
    setNotifications([
      ...notifications,
      { id: Date.now().toString(), method: 'SMS', time: '1', frequency: 'Hours', isEditing: true }
    ]);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleEditNotification = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isEditing: !n.isEditing } : n));
  };

  const updateNotification = (id, field, value) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

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
        <Box>
          <Button 
            variant="contained"
            disableElevation
            onClick={handleSave} 
            disabled={saving || !isDirty}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              fontFamily: 'Inter',
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
              px: 3,
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              },
              '&.Mui-disabled': {
                backgroundColor: COLORS.BORDER,
                color: COLORS.TEXT_MUTED,
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ px: 4, pb: 10 }}>

      {/* Office Review */}
      <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Office Review</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Enable this setting to activate and customize review options for your office.</Typography>
        </Box>
        <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
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
            disableElevation
            onClick={handleAddNotification}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              fontFamily: 'Inter',
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
              px: 2.5,
              py: 1,
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              },
            }}
          >
            + Add Notification
          </Button>
        </Box>

        <Grid container spacing={2}>
          {notifications.map((notif, idx) => (
            <Grid item xs={12} md={6} key={notif.id}>
              <Box sx={{ bgcolor: '#FAFAF9', border: '1px solid #E5E7EB', borderRadius: 3, p: 2.5, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>#{idx + 1} NOTIFICATION</Typography>
                    {idx === 0 && (
                      <Box sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontSize: '0.65rem', fontWeight: 700, px: 1.5, py: 0.4, borderRadius: 1.5 }}>DEFAULT</Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    {notif.isEditing ? (
                      <Typography 
                        onClick={() => handleDeleteNotification(notif.id)}
                        sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#EF4444', cursor: 'pointer', mr: 1, '&:hover': { textDecoration: 'underline' } }}
                      >
                        Delete
                      </Typography>
                    ) : (
                      <IconButton size="small" onClick={() => handleDeleteNotification(notif.id)}><DeleteIcon sx={{ fontSize: '1.1rem', color: '#EF4444' }} /></IconButton>
                    )}
                    {!notif.isEditing && (
                      <IconButton size="small" onClick={() => toggleEditNotification(notif.id)}><EditIcon sx={{ fontSize: '1.1rem', color: '#3B82F6' }} /></IconButton>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Send <Box component="span" sx={{ fontWeight: 600, color: '#1E293B' }}>Review Reminder</Box></Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>→</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>as</Typography>
                  
                  {notif.isEditing ? (
                    <Select 
                      size="small" 
                      value={notif.method} 
                      onChange={(e) => updateNotification(notif.id, 'method', e.target.value)}
                      displayEmpty 
                      sx={{ '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#ffffff' } }}
                    >
                      <MenuItem value="SMS" sx={{ fontSize: '0.85rem' }}>SMS</MenuItem>
                      <MenuItem value="Email" sx={{ fontSize: '0.85rem' }}>Email</MenuItem>
                    </Select>
                  ) : (
                    <Box component="span" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.85rem' }}>{notif.method}</Box>
                  )}
                  
                  <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>→</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>after</Typography>
                  
                  {notif.isEditing ? (
                    <>
                      <TextField 
                        size="small" 
                        value={notif.time} 
                        onChange={(e) => updateNotification(notif.id, 'time', e.target.value)}
                        sx={{ width: 45, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#ffffff' }, '& input': { textAlign: 'center', p: 0 } }} 
                      />
                      <Select 
                        size="small" 
                        value={notif.frequency} 
                        onChange={(e) => updateNotification(notif.id, 'frequency', e.target.value)}
                        displayEmpty 
                        sx={{ '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#ffffff' } }}
                      >
                        <MenuItem value="Hours" sx={{ fontSize: '0.85rem' }}>Hours</MenuItem>
                        <MenuItem value="Days" sx={{ fontSize: '0.85rem' }}>Days</MenuItem>
                      </Select>
                      <Button variant="contained" disableElevation onClick={() => toggleEditNotification(notif.id)} sx={{ 
                        textTransform: 'none',
                        borderRadius: radius.md,
                        fontFamily: 'Inter',
                        fontSize: fontSize.sm,
                        fontWeight: fontWeight.semibold,
                        backgroundColor: COLORS.ACCENT,
                        color: COLORS.WHITE,
                        minWidth: 'auto', 
                        px: 2, 
                        height: 32,
                        '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
                      }}>
                        Save
                      </Button>
                    </>
                  ) : (
                    <Box component="span" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.85rem' }}>{notif.time} {notif.frequency}</Box>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
          {notifications.length === 0 && (
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', py: 2 }}>No notifications configured yet.</Typography>
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
          <Switch checked={enablePhoneCallRequests} onChange={(e) => setEnablePhoneCallRequests(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
        </Box>
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Include a Facebook Review Button</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Add a button in your review emails so patients can leave a review on Facebook.</Typography>
          </Box>
          <Switch checked={includeFacebookReview} onChange={(e) => setIncludeFacebookReview(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
        </Box>

        {/* Row 2 */}
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Include a Yelp Review Button</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Add a button in your review emails so patients can leave a review on Yelp.</Typography>
          </Box>
          <Switch checked={includeYelpReview} onChange={(e) => setIncludeYelpReview(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
        </Box>
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>Skip Duplicate Review Requests</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              Avoid sending review requests to patients who have already received one in the past
              <TextField 
                size="small" 
                value={skipDuplicateDays} 
                onChange={(e) => setSkipDuplicateDays(e.target.value)}
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
            <TextField 
                size="small" 
                value={googleReviewLink} 
                onChange={(e) => setGoogleReviewLink(e.target.value)}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#F1F5F9' } }} 
            />
            <IconButton size="small" sx={{ color: '#64748b' }}><CopyIcon sx={{ fontSize: '1rem' }} /></IconButton>
          </Box>
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
          <Switch checked={reputationManagementActive} onChange={(e) => setReputationManagementActive(e.target.checked)} sx={{ alignSelf: 'flex-end', mb: 2, '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} />
          <ChatBubbleIllustration />
        </Box>
      </Box>

    </Box>
    </Box>
  );
};

export default ReviewSettings;
