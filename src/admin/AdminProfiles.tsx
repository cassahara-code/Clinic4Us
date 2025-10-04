import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Add, FilterAltOff } from '@mui/icons-material';
import ConfirmModal from "../components/modals/ConfirmModal";
import ProfileModal, { ProfileData } from "../components/modals/ProfileModal";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { FaqButton } from "../components/FaqButton";
import StandardPagination from "../components/Pagination/StandardPagination";

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

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('Todos');
    setSortField('name');
    setSortOrder('asc');
    setCurrentPage(1);
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
        minHeight: 'calc(100vh - 120px)',
        background: '#f8f9fa',
        marginTop: '85px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0',
          padding: '0'
        }}>
          {/* Título da Lista de Perfis */}
          <div className="page-header-container">
            <div className="page-header-content">
              <h1 className="page-header-title">Gestão de Perfis</h1>
              <p className="page-header-description">Gestão de perfis de acesso e permissões do sistema.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaqButton />
              <button
                onClick={handleAddProfile}
                title="Adicionar novo perfil"
                className="btn-add"
              >
                <Add />
              </button>
            </div>
          </div>

          {/* Filtros da lista de perfis */}
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
                }}>Nome do Perfil</label>
                <input
                  type="text"
                  placeholder="Buscar perfil"
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

              {/* Tipo de Perfil */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Tipo de Perfil</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  style={{
                    minWidth: '120px',
                    width: '100%',
                    paddingRight: '2rem',
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
                  <option value="Nativo Cliente">Nativo Cliente</option>
                  <option value="Paciente">Paciente</option>
                  <option value="Sistema">Sistema</option>
                  <option value="Nativo Sistema">Nativo Sistema</option>
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
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginBottom: '1rem',
            overflow: 'hidden'
          }}>
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
          </div>

          {/* Lista de perfis */}
          <div className="admin-plans-list-container">
            <div className="admin-plans-table" style={{ display: 'block' }}>
              <div className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <div
                  className="admin-plans-header-cell"
                  style={{ textAlign: 'left', flex: '0 0 200px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('name')}
                  title="Ordenar por perfil"
                >
                  Perfil {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </div>
                <div
                  className="admin-plans-header-cell"
                  style={{ textAlign: 'left', flex: '0 0 200px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('type')}
                  title="Ordenar por tipo"
                >
                  Tipo {sortField === 'type' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left', flex: '1 1 auto' }}>Funcionalidades</div>
                <div className="admin-plans-header-cell" style={{ justifyContent: 'flex-end', flex: '0 0 140px' }}>Ações</div>
              </div>

              <div className="admin-plans-table-body">
                {paginatedProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="admin-plans-table-row"
                    style={{ cursor: 'default', display: 'flex', gridTemplateColumns: 'unset' }}
                  >
                    <div className="admin-plans-cell admin-plans-name" data-label="Perfil" style={{ textAlign: 'left', flex: '0 0 200px' }}>
                      {profile.name}
                    </div>
                    <div className="admin-plans-cell admin-plans-description" data-label="Tipo" style={{ textAlign: 'left', flex: '0 0 200px' }}>
                      {profile.type}
                    </div>
                    <div className="admin-plans-cell admin-plans-description" data-label="Funcionalidades" style={{
                      textAlign: 'left',
                      flex: '1 1 auto',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}>
                      {profile.functionalities.join(', ')}
                    </div>
                    <div className="admin-plans-cell admin-plans-actions" data-label="Ações" style={{
                      textAlign: 'right',
                      flex: '0 0 140px',
                      justifyContent: 'flex-end',
                      display: 'flex'
                    }}>
                      <button
                        className="btn-action-edit"
                        onClick={(e) => { e.stopPropagation(); handleProfileAction('edit', profile.id); }}
                        title="Editar perfil"
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        className="btn-action-delete"
                        onClick={(e) => { e.stopPropagation(); handleProfileAction('delete', profile.id); }}
                        title="Excluir perfil"
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
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginTop: '1rem',
            overflow: 'hidden'
          }}>
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
          </div>
        </div>
      </main>

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

export default AdminProfiles;
