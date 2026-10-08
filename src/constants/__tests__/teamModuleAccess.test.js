import {
  isLevelWithin,
  canEditMember,
  isPatientAccount,
  moduleForPath,
  moduleTurnedOff,
  moduleGranted,
  featureBase,
} from '../teamModuleAccess';

describe('moduleForPath', () => {
  it('maps pages, including nested ones, to their module', () => {
    expect(moduleForPath('/patients/12/insurance')?.key).toBe('patients');
    expect(moduleForPath('/era')?.key).toBe('finance');
    expect(moduleForPath('/clinical/treatment-plan')?.key).toBe('clinical');
  });

  it('keeps Lab Cases out of Clinical and ignores unrelated or look-alike pages', () => {
    expect(moduleForPath('/clinical/lab-case')).toBeNull();
    expect(moduleForPath('/admin/my-group')).toBeNull();
    expect(moduleForPath('/patients-export')).toBeNull();
  });
});

describe('moduleTurnedOff', () => {
  it("returns the module only when the backend marks it 'off'", () => {
    expect(moduleTurnedOff({ moduleStates: { finance: 'off' } }, '/invoices')?.key).toBe('finance');
    expect(moduleTurnedOff({ moduleStates: { finance: 'granted' } }, '/invoices')).toBeNull();
    expect(moduleTurnedOff({}, '/invoices')).toBeNull();
  });
});

describe('isLevelWithin', () => {
  it('orders none < view < full', () => {
    expect(isLevelWithin('view', 'full')).toBe(true);
    expect(isLevelWithin('full', 'view')).toBe(false);
    expect(isLevelWithin('none', 'none')).toBe(true);
  });
});

describe('canEditMember', () => {
  const member = (id, roleName) => ({ _id: id, roles: [{ name: roleName }] });

  it('never lets an admin edit themselves', () => {
    expect(canEditMember({ actorIsBranchAdminOnly: false, actorId: '1', member: member('1', 'dentist') })).toBe(false);
  });

  it('lets a branch admin edit staff but not other admins or patients', () => {
    expect(canEditMember({ actorIsBranchAdminOnly: true, actorId: '1', member: member('2', 'front_desk') })).toBe(true);
    expect(canEditMember({ actorIsBranchAdminOnly: true, actorId: '1', member: member('2', 'branch_admin') })).toBe(false);
    expect(canEditMember({ actorIsBranchAdminOnly: true, actorId: '1', member: member('2', 'Patient') })).toBe(false);
  });

  it('lets a group admin edit branch admins but not group admins', () => {
    expect(canEditMember({ actorIsBranchAdminOnly: false, actorId: '1', member: member('2', 'branch_admin') })).toBe(true);
    expect(canEditMember({ actorIsBranchAdminOnly: false, actorId: '1', member: member('2', 'Group Admin') })).toBe(false);
  });

  it('spots patient accounts', () => {
    expect(isPatientAccount(member('3', 'patient'))).toBe(true);
    expect(isPatientAccount(member('3', 'billing'))).toBe(false);
  });
});

describe('moduleGranted', () => {
  it("returns the module only when the backend marks it 'granted'", () => {
    expect(moduleGranted({ moduleStates: { clinical: 'granted' } }, '/clinical/treatment-plan')?.key).toBe('clinical');
    expect(moduleGranted({ moduleStates: { clinical: 'off' } }, '/clinical')).toBeNull();
    expect(moduleGranted({}, '/clinical')).toBeNull();
  });
});

describe('featureBase', () => {
  const read = { kind: 'read', roleDefault: false };
  const write = { kind: 'write', roleDefault: true };

  it('follows the role when the module has no override', () => {
    expect(featureBase(read, undefined)).toBe(false);
    expect(featureBase(write, undefined)).toBe(true);
  });

  it('follows the module level when there is one', () => {
    expect(featureBase(read, 'view')).toBe(true);
    expect(featureBase(write, 'view')).toBe(false);
    expect(featureBase(write, 'full')).toBe(true);
    expect(featureBase(read, 'none')).toBe(false);
  });
});
