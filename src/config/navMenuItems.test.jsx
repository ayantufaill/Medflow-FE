import { describe, it, expect } from 'vitest';
import { hasRequiredPermission } from './navMenuItems';

describe('hasRequiredPermission', () => {
  it('should return true if no required permissions are provided', () => {
    expect(hasRequiredPermission({ roles: [] }, [])).toBe(true);
  });

  it('should return false if user has no roles', () => {
    expect(hasRequiredPermission({ roles: [] }, ['some.perm'])).toBe(false);
  });

  it('should return true if user has the Super Admin wildcard *', () => {
    const user = {
      roles: [{ permissions: { '*': true } }]
    };
    expect(hasRequiredPermission(user, ['some.perm'])).toBe(true);
  });

  it('should merge permissions using a union of true values only', () => {
    // Role 1 grants 'a' but denies 'b'
    // Role 2 denies 'a' but grants 'b'
    const user = {
      roles: [
        { permissions: { a: true, b: false } },
        { permissions: { a: false, b: true } }
      ]
    };

    // Since the user holds both roles, they should have both 'a' and 'b' granted
    // The 'false' values should NOT override the 'true' values.
    expect(hasRequiredPermission(user, ['a'])).toBe(true);
    expect(hasRequiredPermission(user, ['b'])).toBe(true);
    expect(hasRequiredPermission(user, ['a', 'b'], true)).toBe(true);
  });

  it('should return false if permission is missing', () => {
    const user = {
      roles: [
        { permissions: { a: true } }
      ]
    };
    expect(hasRequiredPermission(user, ['b'])).toBe(false);
  });
});
