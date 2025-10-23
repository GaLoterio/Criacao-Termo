class JSONAuthManager {
  constructor() {
    this.currentUser = null;
    this.isInitialized = false;
    this.sectorPermissions = {};
  }

  async loadUsers() {
    try {
      const localData = localStorage.getItem('json_auth_backup');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          console.log('Dados carregados do localStorage:', parsed);
          return parsed;
        } catch (parseError) {
          console.warn('Erro ao fazer parse do localStorage:', parseError);
        }
      }

      // Se não há dados no localStorage, criar estrutura vazia
      const emptyData = { users: {}, lastUpdate: new Date().toISOString() };
      localStorage.setItem('json_auth_backup', JSON.stringify(emptyData));
      console.log('Estrutura vazia criada no localStorage');
      return emptyData;
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      const emptyData = { users: {}, lastUpdate: new Date().toISOString() };
      localStorage.setItem('json_auth_backup', JSON.stringify(emptyData));
      return emptyData;
    }
  }

  async saveUsers(data) {
    try {
      data.lastUpdate = new Date().toISOString();
      localStorage.setItem('json_auth_backup', JSON.stringify(data));
      console.log('Dados salvos no localStorage:', data);
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
      return false;
    }
  }

  async registerUser(userData) {
    try {
      const data = await this.loadUsers();
      
      if (data.users[userData.email]) {
        throw new Error('Usuário já existe');
      }

      const hashedPassword = await this.hashPassword(userData.password);
      
      data.users[userData.email] = {
        profile: {
          name: userData.name,
          sector: userData.sector,
          company: userData.company || '',
          createdAt: new Date().toISOString(),
          lastLogin: null
        },
        password: hashedPassword,
        termos: []
      };

      await this.saveUsers(data);
      return true;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const data = await this.loadUsers();
      const user = data.users[email];
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const hashedPassword = await this.hashPassword(password);
      if (user.password !== hashedPassword) {
        throw new Error('Senha incorreta');
      }

      user.profile.lastLogin = new Date().toISOString();
      await this.saveUsers(data);

      this.currentUser = {
        email: email,
        profile: user.profile,
        sector: user.profile.sector
      };

      localStorage.setItem('json_auth_session', JSON.stringify(this.currentUser));
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('json_auth_session');
  }

  isLoggedIn() {
    const session = localStorage.getItem('json_auth_session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
        return true;
      } catch (error) {
        console.error('Erro ao fazer parse da sessão:', error);
        return false;
      }
    }
    return false;
  }

  hasPermission(permission) {
    if (!this.isLoggedIn()) return false;
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;
    
    const sector = currentUser.sector;
    return hasSectorPermission(sector, permission);
  }

  getUserPermissions() {
    if (!this.isLoggedIn()) return [];
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) return [];
    
    const sector = currentUser.sector;
    return getSectorPermissions(sector);
  }

  getSectorInfo() {
    if (!this.isLoggedIn()) return null;
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    
    const sector = currentUser.sector;
    return getSectorInfo(sector);
  }

  getCurrentUser() {
    if (!this.isLoggedIn()) return null;
    
    try {
      const session = JSON.parse(localStorage.getItem('json_auth_session'));
      if (session) {
        return {
          email: session.email,
          profile: session.profile || { name: 'Usuário', sector: session.sector },
          sector: session.sector
        };
      }
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
    }
    return null;
  }

  async addTermoToUser(email, termoData) {
    try {
      const data = await this.loadUsers();
      if (data.users[email]) {
        data.users[email].termos.push(termoData);
        await this.saveUsers(data);
        return true;
      } else {
        const localTermos = JSON.parse(localStorage.getItem(`termos_${email}`) || '[]');
        localTermos.push(termoData);
        localStorage.setItem(`termos_${email}`, JSON.stringify(localTermos));
        return true;
      }
    } catch (error) {
      console.error('Erro ao adicionar termo:', error);
      return false;
    }
  }

  async getUserTermos(email) {
    try {
      const data = await this.loadUsers();
      if (data && data.users && data.users[email]) {
        return data.users[email].termos || [];
      }
      
      const localTermos = localStorage.getItem(`termos_${email}`);
      return localTermos ? JSON.parse(localTermos) : [];
    } catch (error) {
      console.error('Erro ao obter termos:', error);
      return [];
    }
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  exportData() {
    const backup = localStorage.getItem('json_auth_backup');
    if (backup) {
      const data = JSON.parse(backup);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_backup.json';
      a.click();
      URL.revokeObjectURL(url);
      return data;
    }
    return null;
  }

  importData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      localStorage.setItem('json_auth_backup', JSON.stringify(data));
      console.log('Dados importados com sucesso:', data);
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
}

const jsonAuthManager = new JSONAuthManager();

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await jsonAuthManager.loadUsers();
    console.log('Sistema de autenticação inicializado com sucesso');
  } catch (error) {
    console.warn('Sistema de autenticação inicializado em modo fallback:', error);
  }
});

window.jsonLoginUser = (email, password) => jsonAuthManager.loginUser(email, password);
window.jsonRegisterUser = (userData) => jsonAuthManager.registerUser(userData);
window.jsonLogoutUser = () => jsonAuthManager.logout();
window.jsonIsUserLoggedIn = () => jsonAuthManager.isLoggedIn();
window.jsonGetCurrentUser = () => jsonAuthManager.getCurrentUser();
window.jsonAddTermoToUser = (email, data) => jsonAuthManager.addTermoToUser(email, data);
window.jsonGetUserTermos = async (email) => await jsonAuthManager.getUserTermos(email);
window.jsonExportData = () => jsonAuthManager.exportData();
window.jsonImportData = (data) => jsonAuthManager.importData(data);

window.jsonHasPermission = (permission) => jsonAuthManager.hasPermission(permission);
window.jsonGetUserPermissions = () => jsonAuthManager.getUserPermissions();
window.jsonGetSectorInfo = () => jsonAuthManager.getSectorInfo();

window.jsonDebug = {
  clearData: () => {
    localStorage.removeItem('json_auth_backup');
    localStorage.removeItem('json_auth_session');
    console.log('Dados limpos');
  },
  showData: () => {
    const backup = localStorage.getItem('json_auth_backup');
    const session = localStorage.getItem('json_auth_session');
    console.log('Backup:', backup ? JSON.parse(backup) : 'Nenhum');
    console.log('Sessão:', session ? JSON.parse(session) : 'Nenhuma');
  },
  createTestUser: async () => {
    const testUser = {
      name: 'Usuário Teste',
      email: 'teste@empresa.com',
      password: '123456',
      sector: 'RH',
      company: 'Empresa Teste'
    };
    try {
      await jsonAuthManager.registerUser(testUser);
      console.log('Usuário de teste criado:', testUser);
    } catch (error) {
      console.error('Erro ao criar usuário de teste:', error);
    }
  },
  exportUsersJSON: () => {
    const backup = localStorage.getItem('json_auth_backup');
    if (backup) {
      const data = JSON.parse(backup);
      console.log('Dados para salvar no users.json:');
      console.log(JSON.stringify(data, null, 2));
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.json';
      a.click();
      URL.revokeObjectURL(url);
      
      return data;
    } else {
      console.log('Nenhum dado encontrado no localStorage');
      return null;
    }
  },
  importUsersJSON: (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      localStorage.setItem('json_auth_backup', JSON.stringify(data));
      console.log('Dados importados com sucesso:', data);
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
};
