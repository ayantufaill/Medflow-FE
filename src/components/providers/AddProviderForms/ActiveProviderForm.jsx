import React from 'react';
import { Box } from '@mui/material';
import SectionContainer from './SectionContainer';
import PersonalInformation from './PersonalInformation';
import AddressLocationDetails from './AddressLocationDetails';
import ProfessionalLicensing from './ProfessionalLicensing';
import ProviderTypeTaxDetail from './ProviderTypeTaxDetail';
import InsuranceCarrierSetting from './InsuranceCarrierSetting';

import personalInfoIcon from '../../../assets/usermanagement icons/personalinformation.svg';
import addressIcon from '../../../assets/usermanagement icons/address.svg';
import licensingIcon from '../../../assets/usermanagement icons/licensing.svg';
import taxDetailIcon from '../../../assets/usermanagement icons/taxdetail.svg';
import insuranceIcon from '../../../assets/usermanagement icons/insurance&carrier.svg';

const ActiveProviderForm = ({ register, control, errors, watch, setValue }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SectionContainer title="Personal Information" icon={personalInfoIcon}>
        <PersonalInformation register={register} control={control} errors={errors} />
      </SectionContainer>
      
      <SectionContainer title="Address & Location Details" icon={addressIcon}>
        <AddressLocationDetails register={register} control={control} errors={errors} />
      </SectionContainer>

      <SectionContainer title="Professional & Licensing" icon={licensingIcon}>
        <ProfessionalLicensing register={register} control={control} errors={errors} />
      </SectionContainer>

      <SectionContainer title="Provider Type & Tax Detail" icon={taxDetailIcon}>
        <ProviderTypeTaxDetail register={register} control={control} errors={errors} />
      </SectionContainer>

      <SectionContainer title="Insurance & Carrier Setting" icon={insuranceIcon} isFinal>
        <InsuranceCarrierSetting register={register} control={control} errors={errors} watch={watch} setValue={setValue} />
      </SectionContainer>
    </Box>
  );
};

export default ActiveProviderForm;
