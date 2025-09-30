import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";

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

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // em meses
  maxUsers: number;
  features: string[];
  status: 'Ativo' | 'Inativo';
  createdAt: string;
  updatedAt: string;
}

const AdminPlans: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard, goToSchedule, goToPatients } = useNavigation();

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativo' | 'Inativo'>('Ativo');

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Estado da ordenação
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados dos modais
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);

  // Dados de exemplo dos planos - geração de dados para testar paginação
  const [plans] = useState<Plan[]>(() => {
    const basePlans = [
      {
        id: '1',
        name: 'Plano Básico',
        description: 'Plano ideal para clínicas pequenas',
        price: 199.90,
        duration: 12,
        maxUsers: 5,
        features: ['Agenda básica', 'Cadastro de pacientes', 'Relatórios simples'],
        status: 'Ativo' as const,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z'
      },
      {
        id: '2',
        name: 'Plano Professional',
        description: 'Para clínicas em crescimento',
        price: 399.90,
        duration: 12,
        maxUsers: 15,
        features: ['Agenda avançada', 'Múltiplos profissionais', 'Relatórios completos', 'Integração WhatsApp'],
        status: 'Ativo' as const,
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-03-10T16:45:00Z'
      },
      {
        id: '3',
        name: 'Plano Enterprise',
        description: 'Para grandes clínicas e hospitais',
        price: 799.90,
        duration: 12,
        maxUsers: 50,
        features: ['Recursos ilimitados', 'API personalizada', 'Suporte 24/7', 'Customizações'],
        status: 'Ativo' as const,
        createdAt: '2024-02-01T11:30:00Z',
        updatedAt: '2024-03-15T13:20:00Z'
      },
      {
        id: '4',
        name: 'Plano Teste',
        description: 'Plano para demonstrações',
        price: 0,
        duration: 1,
        maxUsers: 2,
        features: ['Funcionalidades limitadas', 'Apenas para testes'],
        status: 'Inativo' as const,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z'
      }
    ];

    // Gerar dados adicionais para testar paginação
    const additionalPlans = [];
    const planTypes = ['Básico', 'Standard', 'Premium', 'Enterprise', 'Corporate', 'Starter'];
    const descriptions = [
      'Ideal para pequenos consultórios',
      'Perfeito para clínicas médias',
      'Desenvolvido para hospitais',
      'Customizado para grandes redes',
      'Solução corporativa completa',
      'Plano inicial econômico'
    ];

    for (let i = 5; i <= 120; i++) {
      const planType = planTypes[i % planTypes.length];
      const description = descriptions[i % descriptions.length];
      const isActive = Math.random() > 0.3; // 70% ativos

      additionalPlans.push({
        id: i.toString(),
        name: `${planType} ${i}`,
        description: `${description} - Versão ${i}`,
        price: Math.round((Math.random() * 800 + 100) * 100) / 100,
        duration: [6, 12, 24][Math.floor(Math.random() * 3)],
        maxUsers: [5, 10, 25, 50, 100][Math.floor(Math.random() * 5)],
        features: [`Recurso ${i}A`, `Funcionalidade ${i}B`, `Feature ${i}C`],
        status: isActive ? 'Ativo' as const : 'Inativo' as const,
        createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString(),
        updatedAt: new Date(2024, Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 28) + 1).toISOString()
      });
    }

    return [...basePlans, ...additionalPlans];
  });

  // Filtrar e ordenar planos
  const filteredAndSortedPlans = plans
    .filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'Todos' || plan.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB, 'pt-BR');
      } else {
        return nameB.localeCompare(nameA, 'pt-BR');
      }
    });

  // Calcular paginação
  const totalPages = Math.ceil(filteredAndSortedPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlans = filteredAndSortedPlans.slice(startIndex, endIndex);

  // Função para rolar para o início da lista
  const scrollToTop = () => {
    const listContainer = document.querySelector('.admin-plans-list-container');
    if (listContainer) {
      const containerRect = listContainer.getBoundingClientRect();
      const offset = 100; // Margem superior para não ficar escondido pelo header
      const targetPosition = window.pageYOffset + containerRect.top - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback: rolar para o topo da página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Funções de paginação com scroll
  const goToFirstPage = () => {
    setCurrentPage(1);
    setTimeout(scrollToTop, 100);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    setTimeout(scrollToTop, 100);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    setTimeout(scrollToTop, 100);
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    setTimeout(scrollToTop, 100);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
    setTimeout(scrollToTop, 100);
  };

  const handleSortOrderChange = (newSortOrder: 'asc' | 'desc') => {
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset para primeira página
    setTimeout(scrollToTop, 100);
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
      permissions: ["admin_access", "manage_plans", "view_all"],
      menuItems: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Planos", href: "/admin-plans" },
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

  // Função para formatar data
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para formatar preço
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('Ativo');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const handleAddPlan = () => {
    alert("Funcionalidade de adicionar plano em desenvolvimento");
  };

  const handlePlanRowClick = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setPlanToEdit(plan);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    try {
      console.log(`Excluindo plano: ${planToDelete.name} (ID: ${planToDelete.id})`);

      // TODO: Implementar chamada da API
      // await deletePlanAPI(planToDelete.id);

      // Fechar modal
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);

      // TODO: Atualizar lista de planos após exclusão
      // refetchPlans();

    } catch (error) {
      console.error('Erro ao excluir plano:', error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setPlanToEdit(null);
  };

  const handleEditSave = () => {
    if (!planToEdit) return;

    try {
      console.log(`Salvando alterações do plano: ${planToEdit.name} (ID: ${planToEdit.id})`);

      // TODO: Implementar chamada da API
      // await updatePlanAPI(planToEdit);

      // Fechar modal
      setIsEditModalOpen(false);
      setPlanToEdit(null);

      // TODO: Atualizar lista de planos após edição
      // refetchPlans();

    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
    }
  };

  const handlePlanAction = (action: string, planId: string) => {
    const plan = plans.find(p => p.id === planId);

    if (action === 'edit' && plan) {
      setPlanToEdit(plan);
      setIsEditModalOpen(true);
    } else if (action === 'delete' && plan) {
      setPlanToDelete(plan);
      setIsDeleteModalOpen(true);
    } else if (action === 'duplicate' && plan) {
      console.log(`Duplicando plano: ${plan.name}`);
      alert("Funcionalidade de duplicar plano em desenvolvimento");
    } else if (action === 'toggle-status' && plan) {
      console.log(`Alterando status do plano: ${plan.name}`);
      alert("Funcionalidade de alterar status em desenvolvimento");
    }
  };

  if (!userSession) {
    return <div>Carregando...</div>;
  }

  const loggedMenuItems = [
    { label: "Dashboard", href: "#", onClick: () => goToDashboard() },
    { label: "Agenda", href: "#", onClick: () => goToSchedule() },
    { label: "Pacientes", href: "#", onClick: () => goToPatients() },
    { label: "Admin", href: "#", onClick: () => alert("Menu Admin em desenvolvimento") }
  ];

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
        menuItems={[]}
        loggedMenuItems={loggedMenuItems}
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
          {/* Título da Lista de Planos */}
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
              Gestão de Planos
            </h1>
            <button
              onClick={handleAddPlan}
              title="Adicionar novo plano"
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
              +
            </button>
          </div>

          {/* Filtros da lista de planos */}
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
                }}>Nome do Plano</label>
                <input
                  type="text"
                  placeholder="Buscar plano"
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
                    boxSizing: 'border-box'
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
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Todos">Todos</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Ordenação */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Ordenação</label>
                <select
                  value={sortOrder}
                  onChange={(e) => handleSortOrderChange(e.target.value as 'asc' | 'desc')}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
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
                  title="Limpar todos os filtros"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'transparent',
                    color: '#6c757d',
                    border: '1px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.style.color = '#495057';
                    e.currentTarget.style.borderColor = '#ced4da';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6c757d';
                    e.currentTarget.style.borderColor = '#e9ecef';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Botões de ação e paginação */}
            <div className="schedule-filters-actions" style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                color: '#4a5568',
                fontSize: '0.9rem'
              }}>
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAndSortedPlans.length)} de <strong style={{
                  color: '#2d3748',
                  fontWeight: '600'
                }}>{filteredAndSortedPlans.length}</strong> planos
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {/* Seletor de itens por página */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.85rem',
                    color: '#6c757d',
                    whiteSpace: 'nowrap'
                  }}>
                    Itens por página:
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#495057',
                      background: 'white'
                    }}
                  >
                    {itemsPerPageOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Navegação de páginas */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    title="Primeira página"
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: currentPage === 1 ? '#e9ecef' : '#007bff',
                      color: currentPage === 1 ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ⏪
                  </button>

                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    title="Página anterior"
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: currentPage === 1 ? '#e9ecef' : '#007bff',
                      color: currentPage === 1 ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ◀
                  </button>

                  <span style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.85rem',
                    color: '#495057',
                    whiteSpace: 'nowrap'
                  }}>
                    {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    title="Próxima página"
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: currentPage === totalPages ? '#e9ecef' : '#007bff',
                      color: currentPage === totalPages ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ▶
                  </button>

                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    title="Última página"
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: currentPage === totalPages ? '#e9ecef' : '#007bff',
                      color: currentPage === totalPages ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ⏩
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de planos */}
          <div className="admin-plans-list-container">
            <div className="admin-plans-table">
              <div className="admin-plans-table-header">
                <div className="admin-plans-header-cell">Nome</div>
                <div className="admin-plans-header-cell">Descrição</div>
                <div className="admin-plans-header-cell">Preço</div>
                <div className="admin-plans-header-cell">Duração</div>
                <div className="admin-plans-header-cell">Max Usuários</div>
                <div className="admin-plans-header-cell">Status</div>
                <div className="admin-plans-header-cell">Criado em</div>
                <div className="admin-plans-header-cell">Ações</div>
              </div>

              <div className="admin-plans-table-body">
                {paginatedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="admin-plans-table-row"
                    onClick={() => handlePlanRowClick(plan.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="admin-plans-cell admin-plans-name" data-label="Nome">
                      {plan.name}
                    </div>
                    <div className="admin-plans-cell admin-plans-description" data-label="Descrição">
                      {plan.description}
                    </div>
                    <div className="admin-plans-cell admin-plans-price" data-label="Preço">
                      {formatPrice(plan.price)}
                    </div>
                    <div className="admin-plans-cell admin-plans-duration" data-label="Duração">
                      {plan.duration} {plan.duration === 1 ? 'mês' : 'meses'}
                    </div>
                    <div className="admin-plans-cell admin-plans-users" data-label="Max Usuários">
                      {plan.maxUsers} usuários
                    </div>
                    <div className="admin-plans-cell admin-plans-status" data-label="Status">
                      <span className={`plan-status-indicator ${plan.status === 'Ativo' ? 'active' : 'inactive'}`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="admin-plans-cell admin-plans-created" data-label="Criado em">
                      {formatDate(plan.createdAt)}
                    </div>
                    <div className="admin-plans-cell admin-plans-actions" data-label="Ações">
                      <button
                        className="admin-action-btn"
                        onClick={(e) => { e.stopPropagation(); handlePlanAction('edit', plan.id); }}
                        title="Editar plano"
                        style={{ backgroundColor: '#ffc107', color: '#212529' }}
                      >
                        ✏️
                      </button>
                      <button
                        className="admin-action-btn"
                        onClick={(e) => { e.stopPropagation(); handlePlanAction('duplicate', plan.id); }}
                        title="Duplicar plano"
                        style={{ backgroundColor: '#17a2b8', color: 'white' }}
                      >
                        📋
                      </button>
                      <button
                        className="admin-action-btn"
                        onClick={(e) => { e.stopPropagation(); handlePlanAction('toggle-status', plan.id); }}
                        title="Alterar status"
                        style={{ backgroundColor: plan.status === 'Ativo' ? '#dc3545' : '#28a745', color: 'white' }}
                      >
                        {plan.status === 'Ativo' ? '🚫' : '✅'}
                      </button>
                      <button
                        className="admin-action-btn"
                        onClick={(e) => { e.stopPropagation(); handlePlanAction('delete', plan.id); }}
                        title="Excluir plano"
                        style={{ backgroundColor: '#dc3545', color: 'white' }}
                      >
                        🗑️
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
            <div className="schedule-filters-actions" style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                color: '#4a5568',
                fontSize: '0.9rem'
              }}>
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAndSortedPlans.length)} de <strong style={{
                  color: '#2d3748',
                  fontWeight: '600'
                }}>{filteredAndSortedPlans.length}</strong> planos
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {/* Seletor de itens por página */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.85rem',
                    color: '#6c757d',
                    whiteSpace: 'nowrap'
                  }}>
                    Itens por página:
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#495057',
                      background: 'white'
                    }}
                  >
                    {itemsPerPageOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Navegação de páginas */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    title="Primeira página"
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: currentPage === 1 ? '#e9ecef' : '#007bff',
                      color: currentPage === 1 ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ⏪
                  </button>

                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    title="Página anterior"
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: currentPage === 1 ? '#e9ecef' : '#007bff',
                      color: currentPage === 1 ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ◀
                  </button>

                  <span style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.85rem',
                    color: '#495057',
                    whiteSpace: 'nowrap'
                  }}>
                    {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    title="Próxima página"
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: currentPage === totalPages ? '#e9ecef' : '#007bff',
                      color: currentPage === totalPages ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ▶
                  </button>

                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    title="Última página"
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: currentPage === totalPages ? '#e9ecef' : '#007bff',
                      color: currentPage === totalPages ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    ⏩
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />

      {/* Modal de confirmação de exclusão */}
      {isDeleteModalOpen && planToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
            </div>
            <div className="modal-body">
              <p>
                Tem certeza que deseja excluir o plano <strong>{planToDelete.name}</strong>?
              </p>
              <p className="warning-text">
                ⚠️ Esta ação não poderá ser desfeita e afetará todos os usuários que utilizam este plano.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={handleDeleteCancel}
              >
                Cancelar
              </button>
              <button
                className="btn-delete"
                onClick={handleDeleteConfirm}
              >
                Excluir Plano
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {isEditModalOpen && planToEdit && (
        <div className="modal-overlay">
          <div className="modal-content admin-plans-modal-content">
            <div className="modal-header">
              <h3>Editar Plano</h3>
            </div>
            <div className="modal-body">
              <div className="admin-plans-form-field">
                <label>Nome do Plano</label>
                <input
                  type="text"
                  value={planToEdit.name}
                  onChange={(e) => setPlanToEdit({ ...planToEdit, name: e.target.value })}
                />
              </div>

              <div className="admin-plans-form-field">
                <label>Descrição</label>
                <textarea
                  value={planToEdit.description}
                  onChange={(e) => setPlanToEdit({ ...planToEdit, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="admin-plans-form-grid">
                <div className="admin-plans-form-field">
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={planToEdit.price}
                    onChange={(e) => setPlanToEdit({ ...planToEdit, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="admin-plans-form-field">
                  <label>Max Usuários</label>
                  <input
                    type="number"
                    value={planToEdit.maxUsers}
                    onChange={(e) => setPlanToEdit({ ...planToEdit, maxUsers: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="admin-plans-form-field">
                <label>Funcionalidades (uma por linha)</label>
                <textarea
                  value={planToEdit.features.join('\n')}
                  onChange={(e) => setPlanToEdit({ ...planToEdit, features: e.target.value.split('\n').filter(f => f.trim()) })}
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={handleEditCancel}
              >
                Cancelar
              </button>
              <button
                className="btn-delete"
                onClick={handleEditSave}
                style={{ background: '#28a745' }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;