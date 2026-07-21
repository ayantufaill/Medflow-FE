import React from 'react';
import { ListAlt as ListAltIcon } from '@mui/icons-material';
import InfoCard from './InfoCard';
import { AddSearchList } from './SharedComponents';

const AdditionalInformation = ({
  services, setServices,
  paymentMethods, setPaymentMethods,
  referrals, setReferrals, showDeletedRefs, setShowDeletedRefs,
  careTeam, setCareTeam
}) => {

  return (
    <InfoCard title="Additional Information" icon={<ListAltIcon sx={{ fontSize: 16 }} />}>
      
      <AddSearchList
        label="Services Available at the Office"
        items={services}
        onAdd={(v) => setServices((p) => [...p, v])}
        onRemove={(v) => setServices((p) => p.filter((i) => i !== v))}
      />

      <AddSearchList
        label="Payment Methods"
        items={paymentMethods}
        onAdd={(v) => setPaymentMethods((p) => [...p, v])}
        onRemove={(v) => setPaymentMethods((p) => p.filter((i) => i !== v))}
      />

      <AddSearchList
        label="Referral Sources"
        items={referrals}
        useObjects={true}
        onAdd={(val) => {
          const existing = referrals.find(r => r.name === val);
          if (existing) {
            if (existing.isDeleted) {
              setReferrals(referrals.map(r => r.name === val ? { ...r, isDeleted: false } : r));
            }
          } else {
            setReferrals([...referrals, { name: val, isDeleted: false }]);
          }
        }}
        onRemove={(item) => setReferrals(referrals.map(r => r.name === item.name ? { ...r, isDeleted: true } : r))}
        showDeleted={showDeletedRefs}
        onToggleDeleted={(e) => setShowDeletedRefs(e.target.checked)}
        deletedLabel="Show Deleted Referrals"
      />

      <AddSearchList
        label="Care Team"
        items={careTeam}
        useObjects={true}
        onAdd={(val) => {
          const existing = careTeam.find(c => c.name === val);
          if (existing) {
            if (existing.isDeleted) {
              setCareTeam(careTeam.map(c => c.name === val ? { ...c, isDeleted: false } : c));
            }
          } else {
            setCareTeam([...careTeam, { name: val, isDeleted: false }]);
          }
        }}
        onRemove={(item) => setCareTeam(careTeam.map(c => c.name === item.name ? { ...c, isDeleted: true } : c))}
      />

    </InfoCard>
  );
};

export default AdditionalInformation;
