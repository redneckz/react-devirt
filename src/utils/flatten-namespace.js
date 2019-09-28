export function flattenNamespace(namespace, visited = new Set()) {
  if (!namespace) {
    return [];
  }
  const modulesList = Object.values(namespace)
    .filter(Boolean)
    .filter((module) => !visited.has(module));
  modulesList.forEach((module) => visited.add(module));
  const subNamespacesList = modulesList.filter(isPotentialSubNamespace);
  return modulesList.concat(
    ...subNamespacesList.map((subNamespace) => flattenNamespace(subNamespace, visited)),
  );
}

function isPotentialSubNamespace(module) {
  const moduleType = typeof module;
  return moduleType === 'object' || moduleType === 'function';
}
