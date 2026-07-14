import React from 'react';
import { Grid, TextField, Box } from '@mui/material';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SectionContainer from './SectionContainer';
import FormInputLabel from './FormInputLabel';
import { commonInputStyles } from './PracticeInformationForm';

const SOCIAL_MEDIA_FIELDS = [
  { name: "facebookUrl", label: "Facebook Page Url", placeholder: "Enter Facebook URI" },
  { name: "instagramUrl", label: "Instagram Url", placeholder: "Enter Instagram Url" },
  { name: "linkedInUrl", label: "LinkedIn Url", placeholder: "Enter LinkedIn Url" },
  { name: "googleBusinessUrl", label: "Google Business Url", placeholder: "Enter Business Url" },
  { name: "twitterUrl", label: "Twitter Page Url", placeholder: "Enter Twitter Url", chevron: true },
  { name: "yelpUrl", label: "Yelp Url", placeholder: "Enter Yelp Url" },
];

const SocialMediaLinksForm = ({ register, errors }) => {
  return (
    <SectionContainer title="Social Media Link" icon={LinkOutlinedIcon}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 2.5 }}>
        {SOCIAL_MEDIA_FIELDS.map(({ name, label, placeholder, chevron }, index) => {
          const width = index % 3 === 0 ? '409px' : index % 3 === 1 ? '370px' : '410px';
          return (
            <Box key={name} sx={{ width: { xs: '100%', lg: width }, flexShrink: 1 }}>
              <FormInputLabel label={label} />
              <TextField
                fullWidth
                placeholder={placeholder}
                {...register(name)}
                error={!!errors[name]}
                helperText={errors[name]?.message}
                sx={commonInputStyles}
                InputProps={{
                  endAdornment: chevron ? (
                    <Box sx={{ color: '#9ca3af', display: 'flex', alignItems: 'center', mr: -0.5 }}>
                      <KeyboardArrowDownIcon fontSize="small" />
                    </Box>
                  ) : null
                }}
              />
            </Box>
          );
        })}
      </Box>
    </SectionContainer>
  );
};

export default SocialMediaLinksForm;
