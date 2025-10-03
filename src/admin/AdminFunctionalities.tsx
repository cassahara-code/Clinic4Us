import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Add, Settings, FilterAltOff } from '@mui/icons-material';
import ConfirmModal from "../components/modals/ConfirmModal";
import FunctionalityModal, { FunctionalityData } from "../components/modals/FunctionalityModal";
import CategoryModal from "../components/modals/CategoryModal";
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

  // Estados dos modais
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [functionalityToDelete, setFunctionalityToDelete] = useState<Functionality | null>(null);
  const [functionalityToEdit, setFunctionalityToEdit] = useState<Functionality | null>(null);

  // Estados do modal de funcionalidade
  const [isFunctionalityModalOpen, setIsFunctionalityModalOpen] = useState(false);
  const [functionalityModalMode, setFunctionalityModalMode] = useState<'create' | 'edit'>('create');

  // Estado do modal de categorias
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

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

  // Filtrar funcionalidades
  const filteredFunctionalities = functionalities.filter(func => {
    const matchesSearch = func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         func.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         func.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'Todos' || func.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Calcular paginação
  const totalPages = Math.ceil(filteredFunctionalities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFunctionalities = filteredFunctionalities.slice(startIndex, endIndex);

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

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('Todos');
    setCurrentPage(1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
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
          {/* Título da página */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h1 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#6c757d'
              }}>
                Funcionalidades
              </h1>
              <p style={{
                margin: 0,
                fontSize: '0.95rem',
                color: '#868e96'
              }}>
                Gestão de páginas de funcionalidades de todo o sistema.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <FaqButton />
              <button
                onClick={handleOpenCategoryModal}
                title="Gerenciar categorias"
                className="btn-settings"
              >
                <Settings />
              </button>
              <button
                onClick={handleAddFunctionality}
                title="Adicionar nova funcionalidade"
                style={{
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#38a169'}
                onMouseOut={(e) => e.currentTarget.style.background = '#48bb78'}
              >
                <Add />
              </button>
            </div>
          </div>

          {/* Filtros */}
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
              {/* Busca por palavra */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Busca por palavra</label>
                <input
                  type="text"
                  placeholder="Buscar"
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

              {/* Filtro por categoria */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Filtro por categoria</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
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
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category === 'Todos' ? 'Categoria' : category}
                    </option>
                  ))}
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
              totalItems={filteredFunctionalities.length}
              itemLabel="funcionalidades"
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>

          {/* Lista de funcionalidades */}
          <div className="admin-plans-list-container">
            <div className="admin-plans-table" style={{ display: 'block' }}>
              <div className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left', flex: '0 0 180px' }}>Funcionalidade</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left', flex: '0 0 80px' }}>Ordem</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left', flex: '0 0 220px' }}>Categoria</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left', flex: '0 0 180px' }}>URL</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left', flex: '1 1 auto' }}>Descrição</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'right', flex: '0 0 100px' }}>Ações</div>
              </div>

              <div className="admin-plans-table-body">
                {paginatedFunctionalities.map((functionality) => (
                  <div
                    key={functionality.id}
                    className="admin-plans-table-row"
                    style={{ cursor: 'default', display: 'flex', gridTemplateColumns: 'unset' }}
                  >
                    <div className="admin-plans-cell admin-plans-name" data-label="Funcionalidade" style={{ textAlign: 'left', flex: '0 0 180px' }}>
                      {functionality.name}
                    </div>
                    <div className="admin-plans-cell" data-label="Ordem" style={{ textAlign: 'left', flex: '0 0 80px' }}>
                      {functionality.order}
                    </div>
                    <div className="admin-plans-cell admin-plans-description" data-label="Categoria" style={{ textAlign: 'left', flex: '0 0 220px' }}>
                      {functionality.category}
                    </div>
                    <div className="admin-plans-cell" data-label="URL" style={{ textAlign: 'left', flex: '0 0 180px' }}>
                      {functionality.url}
                    </div>
                    <div className="admin-plans-cell admin-plans-description" data-label="Descrição" style={{
                      textAlign: 'left',
                      flex: '1 1 auto',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}>
                      {functionality.description}
                    </div>
                    <div className="admin-plans-cell admin-plans-actions" data-label="Ações" style={{
                      textAlign: 'right',
                      flex: '0 0 100px',
                      justifyContent: 'flex-end',
                      display: 'flex'
                    }}>
                      <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); handleFunctionalityAction('edit', functionality.id); }}
                        title="Editar funcionalidade"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); handleFunctionalityAction('delete', functionality.id); }}
                        title="Excluir funcionalidade"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
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
              totalItems={filteredFunctionalities.length}
              itemLabel="funcionalidades"
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

      {/* Modal de criar/editar funcionalidade */}
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

      {/* Modal de gestão de categorias */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategories}
      />

      {/* Modal de confirmação de exclusão */}
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

export default AdminFunctionalities;
