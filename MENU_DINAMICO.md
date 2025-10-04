# Sistema de Menu Dinâmico por Perfil

## Visão Geral

O sistema de menu do header é carregado dinamicamente com base no perfil do usuário logado. As funcionalidades disponíveis são determinadas pelo papel (role) do usuário e armazenadas no **Context API** (AuthContext).

## Arquitetura

### 1. Armazenamento (Context API)
- **Local**: `src/contexts/AuthContext.tsx`
- **Método**: Context API com persistência em `localStorage`
- **Vantagem**: Dados sincronizados em toda aplicação, performance superior

### 2. Estrutura de Dados

```typescript
interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  menuItems: MenuItem[]; // Funcionalidades habilitadas
  loginTime: string;
  loginTimestamp: number;
  sessionDuration: number;
  clinic?: string;
}
```

### 3. Funcionalidades por Perfil (Mock)

#### Administrator (Sistema)
**Operacional:**
- Dashboard
- Agenda Profissional
- Lista de Pacientes
- Cadastro de Paciente

**Gestão Administrativa:**
- Gestão de Entidades
- Gestão de Funcionalidades
- Gestão de Perfis
- Gestão de Planos
- Tipos de Profissionais
- Gestão de FAQ

**Usuário:**
- FAQ
- Meu Perfil

#### Cliente admin (Diretoria/Gestão)
**Operacional:**
- Dashboard
- Agenda Profissional
- Lista de Pacientes
- Cadastro de Paciente

**Gestão:**
- Tipos de Profissionais

**Usuário:**
- FAQ
- Meu Perfil

#### Recepcionista (Atendimento)
**Operacional:**
- Dashboard
- Agenda Profissional
- Lista de Pacientes
- Cadastro de Paciente

**Usuário:**
- FAQ
- Meu Perfil

#### Profissional (Médico/Terapeuta)
**Operacional:**
- Agenda Profissional
- Lista de Pacientes

**Usuário:**
- FAQ
- Meu Perfil

## Como Funciona

### 1. No Login
```typescript
// AuthContext.tsx - função login()
const userSession: UserSession = {
  // ... outros dados
  menuItems: getMenuItemsForRole(validUser.role), // Carrega funcionalidades do perfil
  // ...
};
```

### 2. No HeaderInternal
```typescript
// HeaderInternal.tsx
const { user } = useAuth();
const actualMenuItems = menuItems || user?.menuItems || [];

// Menu renderizado dinamicamente
{actualMenuItems.map((item, index) => (
  <ListItem href={item.href}>
    <ListItemText primary={item.label} />
  </ListItem>
))}
```

### 3. Ao Trocar de Perfil
```typescript
// AuthContext.tsx - função updateProfile()
const updatedSession: UserSession = {
  ...user,
  role: profile,
  menuItems: getMenuItemsForRole(profile), // Atualiza menu
};
```

## Integração com API (Produção)

### Mock Atual
```typescript
const getMenuItemsForRole = (role: string): MenuItem[] => {
  // Mock estático baseado em role
  const roleMenuItems: { [key: string]: MenuItem[] } = {
    'Administrator': [...],
    'Cliente admin': [...],
    // ...
  };
  return roleMenuItems[role] || [];
};
```

### Integração com API
```typescript
const getMenuItemsForRole = async (role: string): Promise<MenuItem[]> => {
  try {
    // Consultar API que retorna funcionalidades do perfil
    const response = await fetch(`/api/profiles/${role}/functionalities`);
    const data = await response.json();

    return data.functionalities.map(func => ({
      id: func.id,
      label: func.name,
      href: func.route,
      icon: func.icon
    }));
  } catch (error) {
    console.error('Erro ao carregar funcionalidades:', error);
    return []; // Fallback
  }
};
```

## Testes

### Testar Diferentes Perfis

1. **Administrator (Sistema)**
   - Email: `admin@clinic4us.com`
   - Senha: `123456`
   - Menu: Todas as funcionalidades (12 itens)

2. **Cliente admin (Diretoria)**
   - Email: `diretoria@ninhoinstituto.com.br`
   - Senha: `123456`
   - Menu: Operacional + Gestão limitada (7 itens)

3. **Recepcionista (Atendimento)**
   - Email: `recepcao@clinic4us.com`
   - Senha: `123456`
   - Menu: Apenas operações essenciais (6 itens)

4. **Profissional (Médico/Terapeuta)**
   - Email: `profissional@clinic4us.com`
   - Senha: `123456`
   - Menu: Agenda e pacientes (4 itens)

## Manutenção

### Adicionar Nova Funcionalidade

1. **Adicionar no mock** (`AuthContext.tsx`):
```typescript
const allMenuItems: { [key: string]: MenuItem } = {
  // ... itens existentes
  novaFuncionalidade: {
    id: 'novaFuncionalidade',
    label: 'Nova Funcionalidade',
    href: '?page=nova-funcionalidade'
  },
};
```

2. **Associar ao perfil**:
```typescript
const roleMenuItems: { [key: string]: MenuItem[] } = {
  'Administrator': [
    // ... itens existentes
    allMenuItems.novaFuncionalidade,
  ],
  // ...
};
```

### Adicionar Novo Perfil

```typescript
// 1. Adicionar credencial em validCredentials
const validCredentials: { [key: string]: { password: string; role: string; alias: string } } = {
  // ... credenciais existentes
  'usuario@email.com': { password: '123456', role: 'Novo Perfil', alias: 'Nome do Usuário' }
};

// 2. Definir menu em roleMenuItems
const roleMenuItems: { [key: string]: MenuItem[] } = {
  // ... perfis existentes
  'Novo Perfil': [
    allMenuItems.dashboard,
    allMenuItems.schedule,
    allMenuItems.userProfile,
    // ... outras funcionalidades
  ],
};
```

## Observações Importantes

- ✅ Menu carregado do **Context** (não precisa passar props)
- ✅ Sincronização automática em toda aplicação
- ✅ Persistência em `localStorage`
- ✅ Atualização automática ao trocar perfil
- ✅ Fallback seguro se perfil não encontrado
- ⚠️ Mock atual será substituído por API em produção
