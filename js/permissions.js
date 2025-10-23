// Definições de permissões por setor -- Biel
const SECTOR_PERMISSIONS = {
  'RH': {
    name: 'Recursos Humanos',
    permissions: [],
    description: 'Descrição das paginas que esse setor tem acesso',
    color: '#667eea',
    icon: 'fas fa-users'
  },
  'TI': {
    name: 'Tecnologia da Informação',
    permissions: [
      'gerar_termos' // Aqui você define a permissão para o setor
    ],
    description: 'Acesso aos termos de responsabilidade',
    color: '#48bb78',
    icon: 'fas fa-laptop'
  },
  'FINANCEIRO': {
    name: 'Financeiro',
    permissions: [],
    description: 'Descrição das paginas que esse setor tem acesso',
    color: '#ed8936',
    icon: 'fas fa-calculator'
  },
  'ADMIN': {
    name: 'Administração',
    permissions: [],
    description: 'Descrição das paginas que esse setor tem acesso',
    color: '#e53e3e',
    icon: 'fas fa-crown'
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
