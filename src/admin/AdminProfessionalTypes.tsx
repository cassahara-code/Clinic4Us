import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Add, FilterAltOff } from '@mui/icons-material';
import ConfirmModal from "../components/modals/ConfirmModal";
import ProfessionalTypeModal from "../components/modals/ProfessionalTypeModal";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { FaqButton } from "../components/FaqButton";
import Pagination from "../components/Pagination";

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

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('Todos');
    setSortField('name');
    setSortOrder('asc');
    setCurrentPage(1);
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
    return <div>Carregando...</div>;
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
    <div className="professional-schedule">
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

      <main style={{
        padding: '1rem',
        paddingTop: '0.25rem',
        minHeight: 'calc(100vh - 120px)',
        background: '#f8f9fa',
        marginTop: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0',
          padding: '0'
        }}>
          {/* Título da Lista de Tipos de Profissionais */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              margin: '0',
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#6c757d'
            }}>
              Gestão de Tipos de Profissionais
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaqButton />
              <button
                onClick={handleAddType}
                title="Adicionar novo tipo de profissional"
                className="btn-add"
              >
                <Add />
              </button>
            </div>
          </div>

          {/* Filtros da lista de tipos */}
          <div className="schedule-filters" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginBottom: '1rem'
          }}>
            <div className="schedule-filters-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {/* Busca por nome */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Nome do Tipo</label>
                <input
                  type="text"
                  placeholder="Buscar tipo de profissional"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#03B4C6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 180, 198, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#03B4C6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 180, 198, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="Todos">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Botão limpar filtros */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '2px'
              }}>
                <button
                  onClick={clearFilters}
                  title="Limpar filtros"
                  className="btn-clear-filters"
                >
                  <FilterAltOff fontSize="small" />
                </button>
              </div>
            </div>
          </div>

          {/* Paginação superior */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginBottom: '1rem'
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              itemsPerPageOptions={itemsPerPageOptions}
              totalItems={filteredAndSortedTypes.length}
              itemLabel="tipos"
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>

          {/* Lista de tipos */}
          <div className="admin-plans-list-container">
            <div className="admin-plans-table" style={{ display: 'block' }}>
              <div className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <div
                  className="admin-plans-header-cell"
                  style={{ textAlign: 'left', flex: '0 0 250px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('name')}
                  title="Ordenar por tipo de profissional"
                >
                  Tipo de Profissional {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left', flex: '1 1 auto' }}>Descrição</div>
                <div
                  className="admin-plans-header-cell"
                  style={{ textAlign: 'center', flex: '0 0 100px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('status')}
                  title="Ordenar por status"
                >
                  Status {sortField === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </div>
                <div className="admin-plans-header-cell" style={{ justifyContent: 'flex-end', flex: '0 0 140px' }}>Ações</div>
              </div>

              <div className="admin-plans-table-body">
                {paginatedTypes.map((type) => (
                  <div
                    key={type.id}
                    className="admin-plans-table-row"
                    style={{ cursor: 'default', display: 'flex', gridTemplateColumns: 'unset' }}
                  >
                    <div className="admin-plans-cell admin-plans-name" data-label="Tipo de Profissional" style={{ textAlign: 'left', flex: '0 0 250px' }}>
                      {type.name}
                    </div>
                    <div className="admin-plans-cell admin-plans-description" data-label="Descrição" style={{
                      textAlign: 'left',
                      flex: '1 1 auto',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}>
                      {type.description || '-'}
                    </div>
                    <div className="admin-plans-cell" data-label="Status" style={{ textAlign: 'center', flex: '0 0 100px' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        background: type.active ? '#d4edda' : '#f8d7da',
                        color: type.active ? '#155724' : '#721c24'
                      }}>
                        {type.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="admin-plans-cell admin-plans-actions" data-label="Ações" style={{
                      textAlign: 'right',
                      flex: '0 0 140px',
                      justifyContent: 'flex-end',
                      display: 'flex'
                    }}>
                      <button
                        className="btn-action-edit"
                        onClick={(e) => { e.stopPropagation(); handleTypeAction('edit', type.id); }}
                        title="Editar tipo"
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        className="btn-action-delete"
                        onClick={(e) => { e.stopPropagation(); handleTypeAction('delete', type.id); }}
                        title="Excluir tipo"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Paginação inferior */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginTop: '1rem'
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              itemsPerPageOptions={itemsPerPageOptions}
              totalItems={filteredAndSortedTypes.length}
              itemLabel="tipos"
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      </main>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />

      {/* Modal de criar/editar tipo */}
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

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o tipo ${typeToDelete?.name}?`}
        warningMessage="Esta ação não poderá ser desfeita e pode afetar profissionais associados a este tipo."
        confirmButtonText="Excluir Tipo"
        cancelButtonText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />

      {/* Toast de notificação */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AdminProfessionalTypes;
