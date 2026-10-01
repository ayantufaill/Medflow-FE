import { usePermissions } from '../../hooks/usePermissions';

const Can = ({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}) => {
  const { has, hasAny, hasAll } = usePermissions();

  const allowed =
    (permission ? has(permission) : true) &&
    (anyOf ? hasAny(anyOf) : true) &&
    (allOf ? hasAll(allOf) : true);

  return allowed ? children : fallback;
};

export default Can;
