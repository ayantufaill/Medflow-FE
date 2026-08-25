/**
 * Decodes the tenant-context claims (groupId/branchIds/isGroupAdmin) embedded
 * in the access token at issue time. Display/convenience only, mirroring the
 * backend's own framing of these claims (see JWTPayload in Medflow-BE) — an
 * optimistic value to paint tenant-aware UI immediately on load, never a
 * substitute for the authoritative GET /auth/profile fetch, which stays the
 * source of truth once it resolves.
 */
export const decodeTenantClaims = (token) => {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload || (payload.groupId === undefined && payload.branchIds === undefined && payload.isGroupAdmin === undefined)) {
      return null;
    }
    return {
      groupId: payload.groupId ?? null,
      branchIds: payload.branchIds ?? [],
      isGroupAdmin: payload.isGroupAdmin ?? false,
    };
  } catch {
    return null;
  }
};
