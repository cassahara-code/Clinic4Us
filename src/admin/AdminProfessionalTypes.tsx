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
import ProfessionalTypeModal from "../components/modals/ProfessionalTypeModal";
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

interface ProfessionalType {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const AdminProfessionalTypes: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard } = useNavigation();
  const { toast, showToast, hideToast } = useToast();


  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos');

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Estado da ordenação
  const [sortField, setSortField] = useState<'name' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados dos modais
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<ProfessionalType | null>(null);
  const [typeToEdit, setTypeToEdit] = useState<ProfessionalType | null>(null);

  // Estados do modal de tipo profissional
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [typeModalMode, setTypeModalMode] = useState<'create' | 'edit'>('create');

  // Estado de mudanças nos filtros
  const [hasFilterChanges, setHasFilterChanges] = useState(false);

  // Valores iniciais dos filtros
  const initialFilters = {
    searchTerm: '',
    statusFilter: 'Todos' as 'Todos' | 'Ativo' | 'Inativo',
    sortField: 'name' as 'name' | 'status',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

  // Dados de exemplo dos tipos profissionais
  const [professionalTypes] = useState<ProfessionalType[]>(() => {
    const baseTypes = [
      {
        id: '1',
        name: 'Psicólogo(a)',
        description: 'Profissional especializado em saúde mental e comportamento',
        active: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z'
      },
      {
        id: '2',
        name: 'Fonoaudiólogo(a)',
        description: 'Profissional da área de comunicação humana',
        active: true,
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-03-10T16:45:00Z'
      },
      {
        id: '3',
        name: 'Fisioterapeuta',
        description: 'Profissional especializado em reabilitação física',
        active: true,
        createdAt: '2024-02-01T11:30:00Z',
        updatedAt: '2024-03-15T13:20:00Z'
      },
      {
        id: '4',
        name: 'Terapeuta Ocupacional',
        description: 'Profissional que atua na promoção da saúde e qualidade de vida',
        active: true,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z'
      },
      {
        id: '5',
        name: 'Nutricionista',
        description: 'Profissional especializado em alimentação e nutrição',
        active: false,
        createdAt: '2024-02-05T14:20:00Z',
        updatedAt: '2024-03-20T10:15:00Z'
      }
    ];

    return baseTypes;
  });

  // Filtrar e ordenar tipos
  const filteredAndSortedTypes = professionalTypes
    .filter(type => {
      const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (type.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesStatus = statusFilter === 'Todos' ||
                           (statusFilter === 'Ativo' && type.active) ||
                           (statusFilter === 'Inativo' && !type.active);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'name') {
        compareValue = a.name.localeCompare(b.name, 'pt-BR');
      } else if (sortField === 'status') {
        const statusA = a.active ? 'Ativo' : 'Inativo';
        const statusB = b.active ? 'Ativo' : 'Inativo';
        compareValue = statusA.localeCompare(statusB, 'pt-BR');
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  // Calcular paginação
  const totalPages = Math.ceil(filteredAndSortedTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTypes = filteredAndSortedTypes.slice(startIndex, endIndex);

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

  const handleSort = (field: 'name' | 'status') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    const simulatedUserSession: UserSession = {
      email: "admin@clinic4us.com",
      alias: "Admin Demo",
      clinicName: "Admin Dashboard",
      role: "Administrator",
      permissions: ["admin_access", "manage_professional_types", "view_all"],
      menuItems: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Tipos de Profissionais", href: "/admin-professional-types" },
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
  }, [searchTerm, statusFilter, sortOrder]);

  // Verificar se há mudanças nos filtros
  useEffect(() => {
    const hasChanges =
      searchTerm !== initialFilters.searchTerm ||
      statusFilter !== initialFilters.statusFilter ||
      sortField !== initialFilters.sortField ||
      sortOrder !== initialFilters.sortOrder;

    setHasFilterChanges(hasChanges);
  }, [searchTerm, statusFilter, sortField, sortOrder]);

  const clearFilters = () => {
    setSearchTerm(initialFilters.searchTerm);
    setStatusFilter(initialFilters.statusFilter);
    setSortField(initialFilters.sortField);
    setSortOrder(initialFilters.sortOrder);
    setCurrentPage(1);
    setHasFilterChanges(false);
  };

  const handleAddType = () => {
    setTypeModalMode('create');
    setTypeToEdit(null);
    setIsTypeModalOpen(true);
  };

  const handleSaveType = (data: { name: string; description: string; active: boolean }) => {
    if (typeModalMode === 'create') {
      const newType: ProfessionalType = {
        id: `type-${Date.now()}`,
        name: data.name,
        description: data.description,
        active: data.active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('Novo tipo criado:', newType);
      showToast('Tipo de profissional criado com sucesso!', 'success');
    } else {
      console.log('Tipo editado:', {
        ...typeToEdit,
        name: data.name,
        description: data.description,
        active: data.active,
        updatedAt: new Date().toISOString()
      });
      showToast('Tipo de profissional editado com sucesso!', 'success');
    }
    setIsTypeModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!typeToDelete) return;

    try {
      console.log(`Excluindo tipo: ${typeToDelete.name} (ID: ${typeToDelete.id})`);
      setIsDeleteModalOpen(false);
      setTypeToDelete(null);
      showToast('Tipo de profissional excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir tipo:', error);
      showToast('Erro ao excluir tipo de profissional', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTypeToDelete(null);
  };

  const handleTypeAction = (action: string, typeId: string) => {
    const type = professionalTypes.find(t => t.id === typeId);

    if (action === 'edit' && type) {
      setTypeModalMode('edit');
      setTypeToEdit(type);
      setIsTypeModalOpen(true);
    } else if (action === 'delete' && type) {
      setTypeToDelete(type);
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
            mb: 1,
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
                Gestão de Tipos de Profissionais
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary,
                  pb: '15px'
                }}
              >
                Gestão dos tipos de profissionais que atuam na clínica.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaqButton />
              <AddButton onClick={handleAddType} title="Adicionar novo tipo de profissional" />
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
                label="Nome do Tipo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tipo de profissional"
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
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
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
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
              </TextField>

              <Box sx={{ opacity: hasFilterChanges ? 1 : 0.5, pointerEvents: hasFilterChanges ? 'auto' : 'none' }}>
                <ClearFiltersButton onClick={clearFilters} />
              </Box>
              </Box>
            </Box>

            {/* Contador de registros */}
            <Box sx={{ mb: 2, px: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                <strong>{filteredAndSortedTypes.length}</strong> tipos profissionais encontrados
              </Typography>
            </Box>

            {/* Lista de Tipos */}
            <Box className="admin-plans-list-container" sx={{ mt: 2 }}>
            <Box className="admin-plans-table">
              <Box className="admin-plans-table-header" sx={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1.5fr', width: '100%' }}>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('name')}
                  title="Ordenar por tipo de profissional"
                >
                  Tipo de Profissional {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box className="admin-plans-header-cell" sx={{ textAlign: 'left' }}>Descrição</Box>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ textAlign: 'center', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('status')}
                  title="Ordenar por status"
                >
                  Status {sortField === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box className="admin-plans-header-cell" sx={{ justifyContent: 'flex-end' }}>Ações</Box>
              </Box>

              <Box className="admin-plans-table-body">
                {paginatedTypes.map((type) => (
                  <Box
                    key={type.id}
                    className="admin-plans-table-row"
                    sx={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1.5fr', width: '100%', cursor: 'default' }}
                  >
                    <Box className="admin-plans-cell admin-plans-name" data-label="Tipo de Profissional" sx={{ textAlign: 'left' }}>
                      {type.name}
                    </Box>
                    <Box className="admin-plans-cell admin-plans-description" data-label="Descrição" sx={{
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}>
                      {type.description || '-'}
                    </Box>
                    <Box className="admin-plans-cell" data-label="Status" sx={{ textAlign: 'center' }}>
                      <span className={`plan-status-indicator ${type.active ? 'active' : 'inactive'}`}>
                        {type.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </Box>
                    <Box className="admin-plans-cell admin-plans-actions" data-label="Ações" sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleTypeAction('edit', type.id); }}
                          title="Editar tipo"
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
                          onClick={(e) => { e.stopPropagation(); handleTypeAction('delete', type.id); }}
                          title="Excluir tipo"
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
                totalItems={filteredAndSortedTypes.length}
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o tipo ${typeToDelete?.name}?`}
        warningMessage="Esta ação não poderá ser desfeita e pode afetar profissionais associados a este tipo."
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />

      <ProfessionalTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSave={handleSaveType}
        mode={typeModalMode}
        initialData={typeToEdit ? {
          name: typeToEdit.name,
          description: typeToEdit.description || '',
          active: typeToEdit.active
        } : undefined}
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

export default AdminProfessionalTypes;
