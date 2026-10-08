// Isolated component harness. Saves only fixture data in this browser profile.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import EditProcedureDrawer from '../src/components/clinical/new-treatment-plan/EditProcedureDrawer';

const state = {
  provider: { dropdownList: [{ _id: '1', providerCode: 'QA' }] },
  feeGuides: { procedureCodes: [{ ProcCode: 'D2392', Descript: 'Restoration' }], procedureCodesLoading: false },
};
const store = { getState: () => state, subscribe: () => () => {}, dispatch: () => {} };
const initial = { id: 'fixture-1', code: 'D2392', description: 'Restoration', status: 'Planned', provider: '1', icd: 'Z99.89' };
export function Harness() {
  const [procedure, setProcedure] = useState(() => JSON.parse(localStorage.getItem('icd-drawer-fixture') || 'null') || initial);
  const [open, setOpen] = useState(true);
  return <Provider store={store}>
    <button onClick={() => setOpen(true)}>Open drawer</button>
    <div data-testid="saved-icd">{procedure.icd || 'cleared'}</div>
    <EditProcedureDrawer open={open} procedure={procedure} onClose={() => setOpen(false)} onSave={value => {
      localStorage.setItem('icd-drawer-fixture', JSON.stringify(value));
      setProcedure(value); setOpen(false);
    }} />
  </Provider>;
}
createRoot(document.getElementById('root')).render(<Harness />);
