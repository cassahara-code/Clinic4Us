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
import { Delete, Edit, Settings } from '@mui/icons-material';
import ConfirmModal from "../components/modals/ConfirmModal";
import FunctionalityModal, { FunctionalityData } from "../components/modals/FunctionalityModal";
import CategoryModal from "../components/modals/CategoryModal";
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

interface Functionality {
  id: string;
  name: string;
  order: number;
  category: string;
  url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const AdminFunctionalities: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard, goToSchedule, goToPatients } = useNavigation();
  const { toast, showToast, hideToast } = useToast();

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Estado da ordenação
  const [sortField, setSortField] = useState<'name' | 'order' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados dos modais
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [functionalityToDelete, setFunctionalityToDelete] = useState<Functionality | null>(null);
  const [functionalityToEdit, setFunctionalityToEdit] = useState<Functionality | null>(null);

  // Estados do modal de funcionalidade
  const [isFunctionalityModalOpen, setIsFunctionalityModalOpen] = useState(false);
  const [functionalityModalMode, setFunctionalityModalMode] = useState<'create' | 'edit'>('create');

  // Estado do modal de categorias
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Estado para detectar mudanças nos filtros
  const [hasFilterChanges, setHasFilterChanges] = useState(false);

  // Valores iniciais dos filtros
  const initialFilters = {
    searchTerm: '',
    categoryFilter: 'Todos',
    sortField: 'name' as 'name' | 'order' | 'category',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

  // Lista de categorias disponíveis
  const categories = [
    'Todos',
    'Navegação - Todos os usuários',
    'Cliente - Usuários Cliente'
  ];

  // Dados de exemplo das funcionalidades baseados na imagem
  const [functionalities] = useState<Functionality[]>([
    {
      id: '1',
      name: 'Inicial',
      order: 1,
      category: 'Navegação - Todos os usuários',
      url: 'home',
      description: 'Acompanhe os indicadores da entidade selecionada.',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-02-20T14:30:00Z'
    },
    {
      id: '2',
      name: 'Home',
      order: 1,
      category: 'Navegação - Todos os usuários',
      url: 'index',
      description: 'Página inicial deslogada.',
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-03-10T16:45:00Z'
    },
    {
      id: '3',
      name: 'Paciente',
      order: 1,
      category: 'Cliente - Usuários Cliente',
      url: 'patient',
      description: 'Informações do paciente',
      createdAt: '2024-02-01T11:30:00Z',
      updatedAt: '2024-03-15T13:20:00Z'
    },
    {
      id: '4',
      name: 'Paciente - Cadastro',
      order: 1,
      category: 'Cliente - Usuários Cliente',
      url: 'PatientNewView',
      description: 'Informações do paciente',
      createdAt: '2024-02-05T14:20:00Z',
      updatedAt: '2024-03-20T10:15:00Z'
    },
    {
      id: '5',
      name: 'Paciente - Acessos',
      order: 1,
      category: 'Cliente - Usuários Cliente',
      url: 'PatientAccess',
      description: 'Acessos autorizados às informações do paciente.',
      createdAt: '2024-02-10T08:30:00Z',
      updatedAt: '2024-03-25T15:45:00Z'
    },
    {
      id: '6',
      name: 'Paciente - Agenda',
      order: 1,
      category: 'Cliente - Usuários Cliente',
      url: 'PatientSchedule',
      description: 'Agenda do paciente',
      createdAt: '2024-02-15T10:00:00Z',
      updatedAt: '2024-03-28T11:30:00Z'
    }
  ]);

  // Filtrar e ordenar funcionalidades
  const filteredAndSortedFunctionalities = functionalities
    .filter(func => {
      const matchesSearch = func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           func.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           func.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'Todos' || func.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'name') {
        compareValue = a.name.localeCompare(b.name, 'pt-BR');
      } else if (sortField === 'order') {
        compareValue = a.order - b.order;
      } else if (sortField === 'category') {
        compareValue = a.category.localeCompare(b.category, 'pt-BR');
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  // Calcular paginação
  const totalPages = Math.ceil(filteredAndSortedFunctionalities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFunctionalities = filteredAndSortedFunctionalities.slice(startIndex, endIndex);

  useEffect(() => {
    const simulatedUserSession: UserSession = {
      email: "admin@clinic4us.com",
      alias: "Admin Demo",
      clinicName: "Admin Dashboard",
      role: "Administrator",
      permissions: ["admin_access", "manage_functionalities", "view_all"],
      menuItems: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Funcionalidades", href: "/admin-functionalities" },
        { label: "Perfis", href: "/admin-profiles" },
        { label: "Usuários", href: "/admin-users" }
      ],
      loginTime: new Date().toISOString()
    };

    setUserSession(simulatedUserSession);
  }, []);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // Verificar se há mudanças nos filtros
  useEffect(() => {
    const hasChanges =
      searchTerm !== initialFilters.searchTerm ||
      categoryFilter !== initialFilters.categoryFilter ||
      sortField !== initialFilters.sortField ||
      sortOrder !== initialFilters.sortOrder;

    setHasFilterChanges(hasChanges);
  }, [searchTerm, categoryFilter, sortField, sortOrder]);

  const clearFilters = () => {
    setSearchTerm(initialFilters.searchTerm);
    setCategoryFilter(initialFilters.categoryFilter);
    setSortField(initialFilters.sortField);
    setSortOrder(initialFilters.sortOrder);
    setCurrentPage(1);
    setHasFilterChanges(false);
  };

  const scrollToTop = () => {
    const listContainer = document.querySelector('.admin-functionalities-list-container');
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

  const handleSort = (field: 'name' | 'order' | 'category') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleAddFunctionality = () => {
    setFunctionalityModalMode('create');
    setFunctionalityToEdit(null);
    setIsFunctionalityModalOpen(true);
  };

  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategories = (categories: any[]) => {
    console.log('Categorias atualizadas:', categories);
    showToast('Categorias atualizadas com sucesso!', 'success');
  };

  const handleSaveFunctionality = (data: FunctionalityData) => {
    if (functionalityModalMode === 'create') {
      const newFunctionality: Functionality = {
        id: `functionality-${Date.now()}`,
        name: data.name,
        order: data.order,
        category: data.category,
        url: data.url,
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('Nova funcionalidade criada:', newFunctionality);
      showToast('Funcionalidade criada com sucesso!', 'success');
    } else {
      console.log('Funcionalidade editada:', {
        ...functionalityToEdit,
        name: data.name,
        order: data.order,
        category: data.category,
        url: data.url,
        description: data.description,
        updatedAt: new Date().toISOString()
      });
      showToast('Funcionalidade editada com sucesso!', 'success');
    }
    setIsFunctionalityModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!functionalityToDelete) return;

    try {
      console.log(`Excluindo funcionalidade: ${functionalityToDelete.name} (ID: ${functionalityToDelete.id})`);
      setIsDeleteModalOpen(false);
      setFunctionalityToDelete(null);
      showToast('Funcionalidade excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir funcionalidade:', error);
      showToast('Erro ao excluir funcionalidade', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setFunctionalityToDelete(null);
  };

  const handleFunctionalityAction = (action: string, functionalityId: string) => {
    const functionality = functionalities.find(f => f.id === functionalityId);

    if (action === 'edit' && functionality) {
      setFunctionalityModalMode('edit');
      setFunctionalityToEdit(functionality);
      setIsFunctionalityModalOpen(true);
    } else if (action === 'delete' && functionality) {
      setFunctionalityToDelete(functionality);
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
                Funcionalidades
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary
                }}
              >
                Gestão de páginas de funcionalidades de todo o sistema.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaqButton />
              <IconButton
                onClick={handleOpenCategoryModal}
                title="Gerenciar categorias"
                className="btn-settings"
                sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: colors.textSecondary,
                  color: colors.white,
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#5a6268',
                  },
                }}
              >
                <Settings />
              </IconButton>
              <AddButton onClick={handleAddFunctionality} title="Adicionar nova funcionalidade" />
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
                label="Busca por palavra"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar"
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
                label="Filtro por categoria"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category === 'Todos' ? 'Categoria' : category}
                  </MenuItem>
                ))}
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
              totalItems={filteredAndSortedFunctionalities.length}
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Lista de Funcionalidades */}
            <Box className="admin-functionalities-list-container" sx={{ mt: 2 }}>
            <Box className="admin-plans-table" style={{ display: 'block' }}>
              <Box className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ textAlign: 'left', flex: '0 0 180px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('name')}
                  title="Ordenar por funcionalidade"
                >
                  Funcionalidade {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ textAlign: 'left', flex: '0 0 80px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('order')}
                  title="Ordenar por ordem"
                >
                  Ordem {sortField === 'order' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ textAlign: 'left', flex: '0 0 220px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('category')}
                  title="Ordenar por categoria"
                >
                  Categoria {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box className="admin-plans-header-cell" sx={{ textAlign: 'left', flex: '0 0 180px' }}>URL</Box>
                <Box className="admin-plans-header-cell" sx={{ textAlign: 'left', flex: '1 1 auto' }}>Descrição</Box>
                <Box className="admin-plans-header-cell" sx={{ justifyContent: 'flex-end', flex: '0 0 100px' }}>Ações</Box>
              </Box>

              <Box className="admin-plans-table-body">
                {paginatedFunctionalities.map((functionality) => (
                  <Box
                    key={functionality.id}
                    className="admin-plans-table-row"
                    sx={{ cursor: 'default', display: 'flex', gridTemplateColumns: 'unset' }}
                  >
                    <Box className="admin-plans-cell admin-plans-name" data-label="Funcionalidade" sx={{ textAlign: 'left', flex: '0 0 180px' }}>
                      {functionality.name}
                    </Box>
                    <Box className="admin-plans-cell" data-label="Ordem" sx={{ textAlign: 'left', flex: '0 0 80px' }}>
                      {functionality.order}
                    </Box>
                    <Box className="admin-plans-cell admin-plans-description" data-label="Categoria" sx={{ textAlign: 'left', flex: '0 0 220px' }}>
                      {functionality.category}
                    </Box>
                    <Box className="admin-plans-cell" data-label="URL" sx={{ textAlign: 'left', flex: '0 0 180px' }}>
                      {functionality.url}
                    </Box>
                    <Box className="admin-plans-cell admin-plans-description" data-label="Descrição" sx={{
                      textAlign: 'left',
                      flex: '1 1 auto',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}>
                      {functionality.description}
                    </Box>
                    <Box className="admin-plans-cell admin-plans-actions" data-label="Ações" sx={{
                      textAlign: 'right',
                      flex: '0 0 100px',
                      justifyContent: 'flex-end',
                      display: 'flex'
                    }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleFunctionalityAction('edit', functionality.id); }}
                          title="Editar funcionalidade"
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
                          onClick={(e) => { e.stopPropagation(); handleFunctionalityAction('delete', functionality.id); }}
                          title="Excluir funcionalidade"
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
                totalItems={filteredAndSortedFunctionalities.length}
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
        message={`Tem certeza que deseja excluir a funcionalidade ${functionalityToDelete?.name}?`}
        warningMessage="Esta ação não poderá ser desfeita e afetará todos os perfis que utilizam esta funcionalidade."
        confirmButtonText="Excluir Funcionalidade"
        cancelButtonText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />

      <FunctionalityModal
        isOpen={isFunctionalityModalOpen}
        onClose={() => setIsFunctionalityModalOpen(false)}
        onSave={handleSaveFunctionality}
        mode={functionalityModalMode}
        initialData={functionalityToEdit ? {
          category: functionalityToEdit.category,
          name: functionalityToEdit.name,
          description: functionalityToEdit.description,
          url: functionalityToEdit.url,
          order: functionalityToEdit.order,
          isLoggedArea: true,
          isPublicArea: false,
          showInMenu: false,
          relatedFAQs: []
        } : undefined}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategories}
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

export default AdminFunctionalities;
