import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Add } from '@mui/icons-material';
import PlanModal, { PlanData } from "../components/modals/PlanModal";
import ConfirmModal from "../components/modals/ConfirmModal";
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
  const { toast, showToast, hideToast } = useToast();

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
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);

  // Estados do modal de plano
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planModalMode, setPlanModalMode] = useState<'create' | 'edit'>('create');

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
    setPlanModalMode('create');
    setPlanToEdit(null);
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (data: PlanData) => {
    // Converter features de array de objetos para array de strings incluídas
    const includedFeatures = data.features
      .filter(f => f.included)
      .map(f => f.name);

    if (planModalMode === 'create') {
      const newPlan: Plan = {
        id: `plan-${Date.now()}`,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        maxUsers: data.maxUsers,
        features: includedFeatures,
        status: data.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('Novo plano criado:', newPlan);
      // Aqui você adicionaria o plano à lista de planos
      showToast('Plano criado com sucesso!', 'success');
    } else {
      console.log('Plano editado:', {
        ...planToEdit,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        maxUsers: data.maxUsers,
        features: includedFeatures,
        status: data.status,
        updatedAt: new Date().toISOString()
      });
      // Aqui você atualizaria o plano na lista
      showToast('Plano editado com sucesso!', 'success');
    }
    setIsPlanModalOpen(false);
  };

  const handlePlanRowClick = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setPlanModalMode('edit');
      setPlanToEdit(plan);
      setIsPlanModalOpen(true);
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

      // Exibir toast de sucesso
      showToast('Plano excluído com sucesso!', 'success');

      // TODO: Atualizar lista de planos após exclusão
      // refetchPlans();

    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      showToast('Erro ao excluir plano', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };


  const handlePlanAction = (action: string, planId: string) => {
    const plan = plans.find(p => p.id === planId);

    if (action === 'edit' && plan) {
      setPlanModalMode('edit');
      setPlanToEdit(plan);
      setIsPlanModalOpen(true);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaqButton />
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
                <Add />
              </button>
            </div>
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
                  title="Limpar filtros"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#5a6268';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#6c757d';
                  }}
                >
                  <Delete fontSize="small" />
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
              totalItems={filteredAndSortedPlans.length}
              itemLabel="planos"
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>

          {/* Lista de planos */}
          <div className="admin-plans-list-container">
            <div className="admin-plans-table">
              <div className="admin-plans-table-header">
                <div className="admin-plans-header-cell" style={{ textAlign: 'left' }}>Nome</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left' }}>Descrição</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left' }}>Preço</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left' }}>Duração</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left' }}>Max Usuários</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left' }}>Status</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left' }}>Criado em</div>
                <div className="admin-plans-header-cell" style={{ textAlign: 'left' }}>Ações</div>
              </div>

              <div className="admin-plans-table-body">
                {paginatedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="admin-plans-table-row"
                    onClick={() => handlePlanRowClick(plan.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="admin-plans-cell admin-plans-name" data-label="Nome" style={{ textAlign: 'left' }}>
                      {plan.name}
                    </div>
                    <div className="admin-plans-cell admin-plans-description" data-label="Descrição" style={{ textAlign: 'left' }}>
                      {plan.description}
                    </div>
                    <div className="admin-plans-cell admin-plans-price" data-label="Preço" style={{ textAlign: 'left' }}>
                      {formatPrice(plan.price)}
                    </div>
                    <div className="admin-plans-cell admin-plans-duration" data-label="Duração" style={{ textAlign: 'left' }}>
                      {plan.duration} {plan.duration === 1 ? 'mês' : 'meses'}
                    </div>
                    <div className="admin-plans-cell admin-plans-users" data-label="Max Usuários" style={{ textAlign: 'left' }}>
                      {plan.maxUsers} usuários
                    </div>
                    <div className="admin-plans-cell admin-plans-status" data-label="Status" style={{ textAlign: 'left' }}>
                      <span className={`plan-status-indicator ${plan.status === 'Ativo' ? 'active' : 'inactive'}`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="admin-plans-cell admin-plans-created" data-label="Criado em" style={{ textAlign: 'left' }}>
                      {formatDate(plan.createdAt)}
                    </div>
                    <div className="admin-plans-cell admin-plans-actions" data-label="Ações" style={{ textAlign: 'left' }}>
                      <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); handlePlanAction('edit', plan.id); }}
                        title="Editar plano"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); handlePlanAction('delete', plan.id); }}
                        title="Excluir plano"
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
              totalItems={filteredAndSortedPlans.length}
              itemLabel="planos"
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

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o plano ${planToDelete?.name}?`}
        warningMessage="Esta ação não poderá ser desfeita e afetará todos os usuários que utilizam este plano."
        confirmButtonText="Excluir Plano"
        cancelButtonText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />

      {/* Modal de adicionar/editar plano */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={handleSavePlan}
        mode={planModalMode}
        initialData={planToEdit ? {
          name: planToEdit.name,
          description: planToEdit.description,
          price: planToEdit.price,
          annualPrice: planToEdit.price * 12 * 0.9, // Valor anual com 10% de desconto por padrão
          duration: planToEdit.duration,
          maxUsers: planToEdit.maxUsers,
          features: planToEdit.features.map(f => ({ name: f, included: true })),
          status: planToEdit.status
        } : undefined}
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

export default AdminPlans;
