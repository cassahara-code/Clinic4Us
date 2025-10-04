import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Paper
} from '@mui/material';
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit } from '@mui/icons-material';
import ConfirmModal from "../components/modals/ConfirmModal";
import ProfileModal, { ProfileData } from "../components/modals/ProfileModal";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { FaqButton } from "../components/FaqButton";
import StandardPagination from "../components/Pagination/StandardPagination";
import AddButton from "../components/AddButton";
import ClearFiltersButton from "../components/ClearFiltersButton";
import { colors, typography, inputs } from "../theme/designSystem";

interface MenuItemProps {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  menuItems: MenuItemProps[];
  loginTime: string;
}

interface Profile {
  id: string;
  name: string;
  description?: string;
  type: 'Nativo Cliente' | 'Paciente' | 'Sistema' | 'Nativo Sistema';
  functionalities: string[];
  createdAt: string;
  updatedAt: string;
}

const AdminProfiles: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard, goToSchedule, goToPatients } = useNavigation();
  const { toast, showToast, hideToast } = useToast();

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Nativo Cliente' | 'Paciente' | 'Sistema' | 'Nativo Sistema'>('Todos');

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Estado da ordenação
  const [sortField, setSortField] = useState<'name' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados dos modais
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null);

  // Estados do modal de perfil
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState<'create' | 'edit'>('create');
  const [hasFilterChanges, setHasFilterChanges] = useState(false);

  // Valores iniciais dos filtros
  const initialFilters = {
    searchTerm: '',
    typeFilter: 'Todos' as 'Todos' | 'Nativo Cliente' | 'Paciente' | 'Sistema' | 'Nativo Sistema',
    sortField: 'name' as 'name' | 'type',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

  // Dados de exemplo dos perfis
  const [profiles] = useState<Profile[]>(() => {
    const baseProfiles = [
      {
        id: '1',
        name: 'Secretário',
        type: 'Nativo Cliente' as const,
        functionalities: [
          'Meu perfil',
          'Inicial',
          'Fale conosco',
          'Quem Somos',
          'Home',
          'Sair',
          'FAQ',
          'Agenda Profissional',
          'Lista de Pacientes'
        ],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z'
      },
      {
        id: '2',
        name: 'Profissional',
        type: 'Nativo Cliente' as const,
        functionalities: [
          'Meu perfil',
          'Inicial',
          'Fale conosco',
          'Home',
          'Sair',
          'FAQ',
          'Agenda Profissional',
          'Lista de Pacientes',
          'Paciente'
        ],
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-03-10T16:45:00Z'
      },
      {
        id: '3',
        name: 'Paciente',
        type: 'Paciente' as const,
        functionalities: [
          'FAQ',
          'Disponib. Profissionais'
        ],
        createdAt: '2024-02-01T11:30:00Z',
        updatedAt: '2024-03-15T13:20:00Z'
      },
      {
        id: '4',
        name: 'Manut. Formulários',
        type: 'Sistema' as const,
        functionalities: [
          'Relatórios',
          'Sair',
          'FAQ'
        ],
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z'
      },
      {
        id: '5',
        name: 'Adm. Owner',
        type: 'Nativo Sistema' as const,
        functionalities: [
          'Clientes',
          'Funcionalidades',
          'Perfis',
          'Usuários',
          'Meu perfil',
          'Relatórios',
          'Inicial',
          'Entidades',
          'Sair',
          'Usuários da'
        ],
        createdAt: '2024-02-05T14:20:00Z',
        updatedAt: '2024-03-20T10:15:00Z'
      }
    ];

    return baseProfiles;
  });

  // Filtrar e ordenar perfis
  const filteredAndSortedProfiles = profiles
    .filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'Todos' || profile.type === typeFilter;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'name') {
        compareValue = a.name.localeCompare(b.name, 'pt-BR');
      } else if (sortField === 'type') {
        compareValue = a.type.localeCompare(b.type, 'pt-BR');
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  // Calcular paginação
  const totalPages = Math.ceil(filteredAndSortedProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProfiles = filteredAndSortedProfiles.slice(startIndex, endIndex);

  // Função para rolar para o início da lista
  const scrollToTop = () => {
    const listContainer = document.querySelector('.admin-plans-list-container');
    if (listContainer) {
      const containerRect = listContainer.getBoundingClientRect();
      const offset = 100;
      const targetPosition = window.pageYOffset + containerRect.top - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setTimeout(scrollToTop, 100);
  };

  const handleSort = (field: 'name' | 'type') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Gerar opções para o seletor de itens por página
  const itemsPerPageOptions = [];
  for (let i = 50; i <= 200; i += 10) {
    itemsPerPageOptions.push(i);
  }

  useEffect(() => {
    const simulatedUserSession: UserSession = {
      email: "admin@clinic4us.com",
      alias: "Admin Demo",
      clinicName: "Admin Dashboard",
      role: "Administrator",
      permissions: ["admin_access", "manage_profiles", "view_all"],
      menuItems: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Perfis", href: "/admin-profiles" },
        { label: "Usuários", href: "/admin-users" },
        { label: "Relatórios", href: "/admin-reports" }
      ],
      loginTime: new Date().toISOString()
    };

    setUserSession(simulatedUserSession);
  }, []);

  // Reset página quando filtros ou ordenação mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, sortOrder]);

  // Verificar se há mudanças nos filtros
  useEffect(() => {
    const hasChanges =
      searchTerm !== initialFilters.searchTerm ||
      typeFilter !== initialFilters.typeFilter ||
      sortField !== initialFilters.sortField ||
      sortOrder !== initialFilters.sortOrder;

    setHasFilterChanges(hasChanges);
  }, [searchTerm, typeFilter, sortField, sortOrder]);

  const clearFilters = () => {
    setSearchTerm(initialFilters.searchTerm);
    setTypeFilter(initialFilters.typeFilter);
    setSortField(initialFilters.sortField);
    setSortOrder(initialFilters.sortOrder);
    setCurrentPage(1);
    setHasFilterChanges(false);
  };

  const handleAddProfile = () => {
    setProfileModalMode('create');
    setProfileToEdit(null);
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = (data: ProfileData) => {
    // Converter functionalities de array de objetos para array de strings incluídas
    const includedFunctionalities = data.functionalities
      .filter(f => f.included)
      .map(f => f.name);

    if (profileModalMode === 'create') {
      const newProfile: Profile = {
        id: `profile-${Date.now()}`,
        name: data.name,
        description: data.description,
        type: data.type,
        functionalities: includedFunctionalities,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('Novo perfil criado:', newProfile);
      showToast('Perfil criado com sucesso!', 'success');
    } else {
      console.log('Perfil editado:', {
        ...profileToEdit,
        name: data.name,
        description: data.description,
        type: data.type,
        functionalities: includedFunctionalities,
        updatedAt: new Date().toISOString()
      });
      showToast('Perfil editado com sucesso!', 'success');
    }
    setIsProfileModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!profileToDelete) return;

    try {
      console.log(`Excluindo perfil: ${profileToDelete.name} (ID: ${profileToDelete.id})`);
      setIsDeleteModalOpen(false);
      setProfileToDelete(null);
      showToast('Perfil excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      showToast('Erro ao excluir perfil', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setProfileToDelete(null);
  };

  const handleProfileAction = (action: string, profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);

    if (action === 'edit' && profile) {
      setProfileModalMode('edit');
      setProfileToEdit(profile);
      setIsProfileModalOpen(true);
    } else if (action === 'delete' && profile) {
      setProfileToDelete(profile);
      setIsDeleteModalOpen(true);
    }
  };

  if (!userSession) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }


  const handleRevalidateLogin = () => {
    localStorage.removeItem('clinic4us-user-session');
    localStorage.removeItem('clinic4us-remember-me');
    alert("Sessão encerrada. Redirecionando para login..");
    window.location.href = window.location.origin + '/?page=login&clinic=ninho';
  };

  const handleNotificationClick = () => {
    alert("Sistema de notificações - 5 notificações administrativas");
  };

  const handleUserClick = () => {
    alert("Configurações do administrador - funcionalidade em desenvolvimento");
  };

  const handleLogoClick = () => {
    goToDashboard();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HeaderInternal
        showCTAButton={false}
        className="login-header"
        isLoggedIn={true}
        userEmail={userSession.email}
        userProfile={userSession.role}
        clinicName={userSession.clinicName}
        notificationCount={5}
        onRevalidateLogin={handleRevalidateLogin}
        onNotificationClick={handleNotificationClick}
        onUserClick={handleUserClick}
        onLogoClick={handleLogoClick}
      />

      <Box
        component="main"
        sx={{
          padding: '1rem',
          minHeight: 'calc(100vh - 120px)',
          background: colors.background,
          marginTop: '85px',
          flex: 1
        }}
      >
        <Container maxWidth={false} disableGutters>
          {/* Título da Página */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            gap: 2
          }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: '1.3rem',
                  mb: 1,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary
                }}
              >
                Gestão de Perfis
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary
                }}
              >
                Gestão de perfis de acesso e permissões do sistema.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaqButton />
              <AddButton onClick={handleAddProfile} title="Adicionar novo perfil" />
            </Box>
          </Box>

          {/* Filtros, Paginação e Lista */}
          <Paper
            elevation={0}
            sx={{
              padding: '1.5rem',
              mb: 2,
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${colors.backgroundAlt}`,
            }}
          >
            {/* Filtros */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <TextField
                label="Nome do Perfil"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar perfil"
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: '2 1 300px',
                  '& .MuiOutlinedInput-root': {
                    height: inputs.default.height,
                    '& fieldset': {
                      borderColor: colors.border,
                    },
                    '&:hover fieldset': {
                      borderColor: colors.border,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: inputs.default.labelFontSize,
                    color: colors.textSecondary,
                    backgroundColor: colors.white,
                    padding: inputs.default.labelPadding,
                    '&.Mui-focused': {
                      color: colors.primary,
                    },
                  },
                }}
              />

              <TextField
                select
                label="Tipo de Perfil"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  minWidth: '150px',
                  flex: '1 1 150px',
                  '& .MuiOutlinedInput-root': {
                    height: inputs.default.height,
                    '& fieldset': {
                      borderColor: colors.border,
                    },
                    '&:hover fieldset': {
                      borderColor: colors.border,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: inputs.default.labelFontSize,
                    color: colors.textSecondary,
                    backgroundColor: colors.white,
                    padding: inputs.default.labelPadding,
                    '&.Mui-focused': {
                      color: colors.primary,
                    },
                  },
                }}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Nativo Cliente">Nativo Cliente</MenuItem>
                <MenuItem value="Paciente">Paciente</MenuItem>
                <MenuItem value="Sistema">Sistema</MenuItem>
                <MenuItem value="Nativo Sistema">Nativo Sistema</MenuItem>
              </TextField>

              <Box sx={{ opacity: hasFilterChanges ? 1 : 0.5, pointerEvents: hasFilterChanges ? 'auto' : 'none' }}>
                <ClearFiltersButton onClick={clearFilters} />
              </Box>
              </Box>
            </Box>

            {/* Paginação */}
            <StandardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedProfiles.length}
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Lista de Perfis */}
            <Box className="admin-plans-list-container" sx={{ mt: 2 }}>
            <Box className="admin-plans-table" style={{ display: 'block' }}>
              <Box className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <Box
                  className="admin-plans-header-cell"
                  style={{ textAlign: 'left', flex: '0 0 200px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('name')}
                  title="Ordenar por perfil"
                >
                  Perfil {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box
                  className="admin-plans-header-cell"
                  style={{ textAlign: 'left', flex: '0 0 200px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('type')}
                  title="Ordenar por tipo"
                >
                  Tipo {sortField === 'type' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box className="admin-plans-header-cell" style={{ textAlign: 'left', flex: '1 1 auto' }}>Funcionalidades</Box>
                <Box className="admin-plans-header-cell" style={{ justifyContent: 'flex-end', flex: '0 0 140px' }}>Ações</Box>
              </Box>

              <Box className="admin-plans-table-body">
                {paginatedProfiles.map((profile) => (
                  <Box
                    key={profile.id}
                    className="admin-plans-table-row"
                    style={{ cursor: 'default', display: 'flex', gridTemplateColumns: 'unset' }}
                  >
                    <Box className="admin-plans-cell admin-plans-name" data-label="Perfil" style={{ textAlign: 'left', flex: '0 0 200px' }}>
                      {profile.name}
                    </Box>
                    <Box className="admin-plans-cell admin-plans-description" data-label="Tipo" style={{ textAlign: 'left', flex: '0 0 200px' }}>
                      {profile.type}
                    </Box>
                    <Box className="admin-plans-cell admin-plans-description" data-label="Funcionalidades" style={{
                      textAlign: 'left',
                      flex: '1 1 auto',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}>
                      {profile.functionalities.join(', ')}
                    </Box>
                    <Box className="admin-plans-cell admin-plans-actions" data-label="Ações" style={{
                      textAlign: 'right',
                      flex: '0 0 140px',
                      justifyContent: 'flex-end',
                      display: 'flex'
                    }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleProfileAction('edit', profile.id); }}
                          title="Editar perfil"
                          sx={{
                            backgroundColor: '#03B4C6',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            '&:hover': {
                              backgroundColor: '#029AAB',
                            }
                          }}
                        >
                          <Edit sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleProfileAction('delete', profile.id); }}
                          title="Excluir perfil"
                          sx={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            '&:hover': {
                              backgroundColor: '#c82333',
                            }
                          }}
                        >
                          <Delete sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            </Box>

            {/* Paginação Inferior */}
            <Box sx={{ mt: 2 }}>
              <StandardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredAndSortedProfiles.length}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  setTimeout(scrollToTop, 100);
                }}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </Box>
          </Paper>
        </Container>
      </Box>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />

      {/* Modal de criar/editar perfil */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        mode={profileModalMode}
        initialData={profileToEdit ? {
          name: profileToEdit.name,
          description: profileToEdit.description || '',
          type: profileToEdit.type,
          functionalities: profileToEdit.functionalities.map(name => ({
            name,
            included: true
          }))
        } : undefined}
      />

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o perfil ${profileToDelete?.name}?`}
        warningMessage="Esta ação não poderá ser desfeita e afetará todos os usuários que utilizam este perfil."
        confirmButtonText="Excluir Perfil"
        cancelButtonText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </Box>
  );
};

export default AdminProfiles;
