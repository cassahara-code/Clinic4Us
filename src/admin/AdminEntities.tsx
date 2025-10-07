import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Paper,
  Button
} from '@mui/material';
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Person, ViewModule } from '@mui/icons-material';
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import EntityModal, { EntityData } from "../components/modals/EntityModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import { FaqButton } from "../components/FaqButton";
import StandardPagination from "../components/Pagination/StandardPagination";
import AddButton from "../components/AddButton";
import ClearFiltersButton from "../components/ClearFiltersButton";
import { colors, typography, inputs } from "../theme/designSystem";

interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  loginTime: string;
}

interface Entity {
  id: string;
  fantasyName: string;
  cnpjCpf: string;
  socialName: string;
  workingHours: string;
}

const AdminEntities: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard } = useNavigation();
  const { toast, showToast, hideToast } = useToast();

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Estado da ordenação
  const [sortField, setSortField] = useState<'fantasyName' | 'cnpjCpf' | 'socialName'>('fantasyName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados dos modais
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [entityModalMode, setEntityModalMode] = useState<'create' | 'edit'>('create');
  const [entityToEdit, setEntityToEdit] = useState<Entity | null>(null);
  const [hasFilterChanges, setHasFilterChanges] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<Entity | null>(null);

  // Valores iniciais dos filtros
  const initialFilters = {
    searchTerm: '',
    sortField: 'fantasyName' as 'fantasyName' | 'cnpjCpf' | 'socialName',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

  // Dados de exemplo das entidades
  const [entities] = useState<Entity[]>(() => {
    const baseEntities = [
      {
        id: '1',
        fantasyName: 'Instituto Ninho',
        cnpjCpf: '44594155000179',
        socialName: 'Azevedo Marinho Fonoaudiologia',
        workingHours: '08:00 - 20:00'
      },
      {
        id: '2',
        fantasyName: 'Clínica Saúde Total',
        cnpjCpf: '12345678000190',
        socialName: 'Clínica Saúde Total Ltda',
        workingHours: '07:00 - 19:00'
      },
      {
        id: '3',
        fantasyName: 'Centro Médico Esperança',
        cnpjCpf: '98765432000111',
        socialName: 'Centro Médico Esperança SA',
        workingHours: '08:00 - 18:00'
      }
    ];

    // Gerar mais entidades para teste de paginação
    const entities: Entity[] = [];
    for (let i = 0; i < 5; i++) {
      baseEntities.forEach((entity, index) => {
        entities.push({
          ...entity,
          id: `${i * baseEntities.length + index + 1}`,
          fantasyName: `${entity.fantasyName} ${i > 0 ? i + 1 : ''}`.trim()
        });
      });
    }
    return entities;
  });

  // Lógica de filtragem e ordenação
  const filteredAndSortedEntities = entities
    .filter(entity => {
      const matchesSearch = searchTerm === '' ||
        entity.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.cnpjCpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.socialName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'fantasyName') {
        compareValue = a.fantasyName.localeCompare(b.fantasyName, 'pt-BR');
      } else if (sortField === 'cnpjCpf') {
        compareValue = a.cnpjCpf.localeCompare(b.cnpjCpf);
      } else if (sortField === 'socialName') {
        compareValue = a.socialName.localeCompare(b.socialName, 'pt-BR');
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  // Lógica de paginação
  const totalPages = Math.ceil(filteredAndSortedEntities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntities = filteredAndSortedEntities.slice(startIndex, endIndex);

  const handleRevalidateLogin = () => {
    console.log('Revalidando login...');
  };

  const handleNotificationClick = () => {
    console.log('Notificações clicadas');
  };

  const handleUserClick = () => {
    console.log('Perfil de usuário clicado');
  };

  const handleLogoClick = () => {
    goToDashboard();
  };

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

  const handleSort = (field: 'fantasyName' | 'cnpjCpf' | 'socialName') => {
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
      permissions: ["admin_access", "manage_entities", "view_all"],
      loginTime: new Date().toISOString()
    };

    setUserSession(simulatedUserSession);
  }, []);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  // Verificar se há mudanças nos filtros
  useEffect(() => {
    const hasChanges =
      searchTerm !== initialFilters.searchTerm ||
      sortField !== initialFilters.sortField ||
      sortOrder !== initialFilters.sortOrder;

    setHasFilterChanges(hasChanges);
  }, [searchTerm, sortField, sortOrder]);

  const clearFilters = () => {
    setSearchTerm(initialFilters.searchTerm);
    setSortField(initialFilters.sortField);
    setSortOrder(initialFilters.sortOrder);
    setCurrentPage(1);
    setHasFilterChanges(false);
  };

  const handleAddEntity = () => {
    setEntityModalMode('create');
    setEntityToEdit(null);
    setIsEntityModalOpen(true);
  };

  const handleEntityAction = (action: string, entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;

    switch (action) {
      case 'view':
        showToast(`Visualizando entidade: ${entity.fantasyName}`, 'info');
        break;
      case 'user':
        showToast(`Gerenciar usuários da entidade: ${entity.fantasyName}`, 'info');
        break;
      case 'edit':
        setEntityModalMode('edit');
        setEntityToEdit(entity);
        setIsEntityModalOpen(true);
        break;
      case 'delete':
        setEntityToDelete(entity);
        setIsDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = () => {
    if (entityToDelete) {
      showToast(`Entidade ${entityToDelete.fantasyName} removida com sucesso`, 'success');
      setIsDeleteModalOpen(false);
      setEntityToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEntityToDelete(null);
  };

  const handleSaveEntity = (data: EntityData) => {
    if (entityModalMode === 'create') {
      showToast('Entidade cadastrada com sucesso', 'success');
    } else {
      showToast('Entidade atualizada com sucesso', 'success');
    }
    setIsEntityModalOpen(false);
  };

  const handleEntityRowClick = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity) {
      showToast(`Visualizando detalhes da entidade: ${entity.fantasyName}`, 'info');
    }
  };

  if (!userSession) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

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
                Entidades
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary,
                  pb: '15px'
                }}
              >
                Gestão de clínicas e unidades cadastradas no sistema.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaqButton />
              <AddButton onClick={handleAddEntity} title="Adicionar nova entidade" />
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

              <Box sx={{ opacity: hasFilterChanges ? 1 : 0.5, pointerEvents: hasFilterChanges ? 'auto' : 'none' }}>
                <ClearFiltersButton onClick={clearFilters} />
              </Box>
              </Box>
            </Box>

            {/* Contador de registros */}
            <Box sx={{ mb: 2, px: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                <strong>{filteredAndSortedEntities.length}</strong> entidades encontradas
              </Typography>
            </Box>

            {/* Lista de Entidades */}
            <Box className="admin-plans-list-container" sx={{ mt: 2 }}>
            <Box className="admin-plans-table">
              <Box className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ flex: '0 0 250px', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('fantasyName')}
                  title="Ordenar por nome fantasia"
                >
                  N.Fantasia/Apelido {sortField === 'fantasyName' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ flex: '0 0 180px', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('cnpjCpf')}
                  title="Ordenar por CNPJ/CPF"
                >
                  CNPJ/CPF {sortField === 'cnpjCpf' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ flex: '1 1 auto', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('socialName')}
                  title="Ordenar por razão social"
                >
                  Razão Social/Nome {sortField === 'socialName' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box className="admin-plans-header-cell" sx={{ flex: '0 0 180px', textAlign: 'left' }}>Horário de funcionamento</Box>
                <Box className="admin-plans-header-cell" sx={{ flex: '0 0 200px', justifyContent: 'flex-end' }}>Ações</Box>
              </Box>

              <Box className="admin-plans-table-body">
                {paginatedEntities.map((entity) => (
                  <Box
                    key={entity.id}
                    className="admin-plans-table-row"
                    onClick={() => handleEntityRowClick(entity.id)}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      gridTemplateColumns: 'unset'
                    }}
                  >
                    <Box className="admin-plans-cell" sx={{ flex: '0 0 250px', textAlign: 'left' }} data-label="N.Fantasia/Apelido">
                      {entity.fantasyName}
                    </Box>
                    <Box className="admin-plans-cell" sx={{ flex: '0 0 180px', textAlign: 'left' }} data-label="CNPJ/CPF">
                      {entity.cnpjCpf}
                    </Box>
                    <Box className="admin-plans-cell" sx={{ flex: '1 1 auto', textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-word' }} data-label="Razão Social/Nome">
                      {entity.socialName}
                    </Box>
                    <Box className="admin-plans-cell" sx={{ flex: '0 0 180px', textAlign: 'left' }} data-label="Horário de funcionamento">
                      {entity.workingHours}
                    </Box>
                    <Box className="admin-plans-cell admin-plans-actions" sx={{ flex: '0 0 200px', textAlign: 'right' }} data-label="Ações">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleEntityAction('view', entity.id); }}
                          title="Visualizar entidade"
                          sx={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            '&:hover': {
                              backgroundColor: '#5a6268',
                            }
                          }}
                        >
                          <ViewModule sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleEntityAction('user', entity.id); }}
                          title="Gerenciar usuários"
                          sx={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            '&:hover': {
                              backgroundColor: '#218838',
                            }
                          }}
                        >
                          <Person sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleEntityAction('edit', entity.id); }}
                          title="Editar entidade"
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
                          onClick={(e) => { e.stopPropagation(); handleEntityAction('delete', entity.id); }}
                          title="Excluir entidade"
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
                totalItems={filteredAndSortedEntities.length}
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

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Entidade"
        message={entityToDelete
          ? `Tem certeza que deseja excluir a entidade "${entityToDelete.fantasyName}" (${entityToDelete.cnpjCpf})?`
          : "Tem certeza que deseja excluir esta entidade?"}
        warningMessage="Esta ação não poderá ser desfeita."
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
        type="danger"
      />

      <EntityModal
        isOpen={isEntityModalOpen}
        onClose={() => setIsEntityModalOpen(false)}
        onSave={handleSaveEntity}
        mode={entityModalMode}
        initialData={entityToEdit ? {
          entityType: 'juridica',
          cnpj: entityToEdit.cnpjCpf,
          inscEstadual: '',
          inscMunicipal: '',
          fantasyName: entityToEdit.fantasyName,
          socialName: entityToEdit.socialName,
          ddd: '',
          phone: '',
          email: '',
          cep: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          startTime: entityToEdit.workingHours.split(' - ')[0] || '08:00',
          endTime: entityToEdit.workingHours.split(' - ')[1] || '18:00'
        } : undefined}
      />
    </Box>
  );
};

export default AdminEntities;
