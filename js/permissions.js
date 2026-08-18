// Definições de permissões por setor -- Biel
const SECTOR_PERMISSIONS = {
  'TI': {
    name: 'Tecnologia',
    permissions: [
      'gerar_termos' // Aqui você define a permissão para o setor
    ],
    description: 'Acesso aos termos de responsabilidade',
    color: '#48bb78',
    icon: 'fas fa-laptop'
  }
};

const SYSTEM_FEATURES = {
  'gerar_termos': {
    name: 'Gerar Termos',
    description: 'Permite gerar termos de responsabilidade',
    required: true
  }
};

function hasSectorPermission(sector, permission) {
  const sectorData = SECTOR_PERMISSIONS[sector];
  if (!sectorData) return false;
  return sectorData.permissions.includes(permission);
}

function getSectorPermissions(sector) {
  const sectorData = SECTOR_PERMISSIONS[sector];
  return sectorData ? sectorData.permissions : [];
}

function getSectorInfo(sector) {
  return SECTOR_PERMISSIONS[sector] || null;
}

function getFeatureInfo(feature) {
  return SYSTEM_FEATURES[feature] || null;
}

window.SECTOR_PERMISSIONS = SECTOR_PERMISSIONS;
window.SYSTEM_FEATURES = SYSTEM_FEATURES;
window.hasSectorPermission = hasSectorPermission;
window.getSectorPermissions = getSectorPermissions;
window.getSectorInfo = getSectorInfo;
window.getFeatureInfo = getFeatureInfo;
