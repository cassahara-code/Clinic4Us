import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Add, FirstPage, LastPage, ChevronLeft, ChevronRight } from '@mui/icons-material';
import ConfirmModal from "../components/modals/ConfirmModal";
import FaqModal, { FaqData } from "../components/modals/FaqModal";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { FaqButton } from "../components/FaqButton";

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

interface FaqItem extends FaqData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const AdminFaq: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard } = useNavigation();
  const { toast, showToast, hideToast } = useToast();

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Estado da ordenação
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados dos modais
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);
  const [faqToEdit, setFaqToEdit] = useState<FaqItem | null>(null);

  // Estados do modal de FAQ
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqModalMode, setFaqModalMode] = useState<'create' | 'edit'>('create');

  // Dados de exemplo dos FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: '1',
      category: 'Administração Cliente',
      question: 'Cadastrando novos usuários',
      answer: 'Para cadastrar novos usuários, acesse o menu "Entidades", clique no ícone "Usuários" e depois no botão "+" para incluir um novo usuário.',
      links: [
        { text: 'Ver tutorial completo', url: '#tutorial-usuarios' }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-02-20T14:30:00Z'
    },
    {
      id: '2',
      category: 'Administração Cliente',
      question: 'Configurando disponibilidade de profissionais',
      answer: 'A configuração da disponibilidade de um profissional afeta diretamente o agendamento de seus atendimentos. O sistema verifica se:\n\n• O período informado está dentro da disponibilidade do profissional.\n• O agendamento não conflita com outros compromissos já registrados.\n• A duração do agendamento respeita o tempo previsto para o tipo de atendimento escolhido.',
      videoUrl: 'https://www.youtube.com/embed/exemplo',
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-03-10T16:45:00Z'
    },
    {
      id: '3',
      category: 'Agendamentos',
      question: 'Como agendar uma consulta?',
      answer: 'Para agendar uma consulta, acesse o menu "Agenda", selecione o profissional desejado, clique no horário disponível e preencha os dados do paciente.',
      links: [
        { text: 'Manual de agendamentos', url: '#manual-agendamentos' },
        { text: 'Vídeo tutorial', url: '#video-agendamentos' }
      ],
      createdAt: '2024-02-01T11:30:00Z',
      updatedAt: '2024-03-15T13:20:00Z'
    },
    {
      id: '4',
      category: 'Pacientes',
      question: 'Como cadastrar um novo paciente?',
      answer: 'Acesse o menu "Cadastro Paciente", preencha todos os campos obrigatórios (nome, CPF, data de nascimento, contato) e clique em "Salvar". O paciente ficará disponível para agendamentos imediatamente.',
      videoUrl: 'https://www.youtube.com/embed/exemplo-paciente',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T08:00:00Z'
    },
    {
      id: '5',
      category: 'Planos',
      question: 'Como criar um novo plano de atendimento?',
      answer: 'No menu "Planos", clique no botão "+" para adicionar um novo plano. Defina o nome, tipo (consulta única ou recorrente), valor e funcionalidades incluídas no plano.',
      createdAt: '2024-02-05T14:20:00Z',
      updatedAt: '2024-03-20T10:15:00Z'
    }
  ]);

  // Obter categorias únicas
  const categories = ['Todos', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  // Filtrar e ordenar FAQs
  const filteredAndSortedFaqs = faqs
    .filter(faq => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'Todos' || faq.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const compareValue = a.question.localeCompare(b.question);
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedFaqs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFaqs = filteredAndSortedFaqs.slice(startIndex, endIndex);

  const itemsPerPageOptions = [10, 25, 50, 100];

  useEffect(() => {
    const sessionData = localStorage.getItem('clinic4us-user-session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setUserSession(session);
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        window.location.href = window.location.origin + '/?page=login&clinic=ninho';
      }
    } else {
      window.location.href = window.location.origin + '/?page=login&clinic=ninho';
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('Todos');
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Handlers do modal
  const handleOpenCreateModal = () => {
    setFaqModalMode('create');
    setFaqToEdit(null);
    setIsFaqModalOpen(true);
  };

  const handleOpenEditModal = (faq: FaqItem) => {
    setFaqModalMode('edit');
    setFaqToEdit(faq);
    setIsFaqModalOpen(true);
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
    setFaqToEdit(null);
  };

  const handleSaveFaq = (data: FaqData) => {
    if (faqModalMode === 'create') {
      const newFaq: FaqItem = {
        ...data,
        id: String(faqs.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFaqs([...faqs, newFaq]);
      showToast('Item FAQ criado com sucesso!', 'success');
    } else {
      setFaqs(faqs.map(faq =>
        faq.id === data.id
          ? { ...data as FaqItem, updatedAt: new Date().toISOString() }
          : faq
      ));
      showToast('Item FAQ atualizado com sucesso!', 'success');
    }
    handleCloseFaqModal();
  };

  const handleOpenDeleteModal = (faq: FaqItem) => {
    setFaqToDelete(faq);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setFaqToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (faqToDelete) {
      setFaqs(faqs.filter(faq => faq.id !== faqToDelete.id));
      showToast('Item FAQ excluído com sucesso!', 'success');
      handleCloseDeleteModal();
    }
  };

  const handleRevalidateLogin = () => {
    console.log("Revalidar login");
  };

  const handleNotificationClick = () => {
    console.log("Notificações clicadas");
  };

  const handleUserClick = () => {
    console.log("Usuário clicado");
  };

  const handleLogoClick = () => {
    goToDashboard();
  };

  if (!userSession) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="admin-plans-page">
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

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-content">
            {/* Título da Página */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h1 className="page-title">Gestão de FAQ</h1>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <FaqButton />
                <button
                  onClick={handleOpenCreateModal}
                  title="Adicionar novo item FAQ"
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

            {/* Filtros e Ações */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                alignItems: 'end'
              }}>
                {/* Busca */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    color: '#6c757d',
                    marginBottom: '0.5rem'
                  }}>Buscar</label>
                  <input
                    type="text"
                    placeholder="Pesquisar por pergunta, resposta ou categoria"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      color: '#495057',
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

                {/* Filtro por Categoria */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    color: '#6c757d',
                    marginBottom: '0.5rem'
                  }}>Categoria</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      color: '#495057',
                      background: 'white',
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
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Botão limpar filtros */}
                <div>
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

              {/* Paginação e Ações */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '1rem',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Contador de itens */}
                  <span style={{ fontSize: '0.85rem', color: '#6c757d', whiteSpace: 'nowrap' }}>
                    Mostrando {filteredAndSortedFaqs.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredAndSortedFaqs.length)} de {filteredAndSortedFaqs.length} itens
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#6c757d', whiteSpace: 'nowrap' }}>Itens por página:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
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
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                      <FirstPage />
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
                      <ChevronLeft />
                    </button>

                    <span style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      color: '#495057'
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
                      <ChevronRight />
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
                      <LastPage />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de FAQs */}
            <div className="admin-plans-list-container">
              <div className="admin-plans-table">
                {/* Header */}
                <div className="admin-plans-table-header" style={{ display: 'flex' }}>
                  <div
                    className="admin-plans-header-cell"
                    style={{ flex: '0 0 250px', cursor: 'pointer' }}
                    onClick={toggleSortOrder}
                    title="Ordenar por pergunta"
                  >
                    Pergunta {sortOrder === 'asc' ? '↑' : '↓'}
                  </div>
                  <div className="admin-plans-header-cell" style={{ flex: '0 0 150px' }}>Categoria</div>
                  <div className="admin-plans-header-cell" style={{ flex: '1 1 auto' }}>Resposta (Prévia)</div>
                  <div className="admin-plans-header-cell" style={{ flex: '0 0 80px' }}>Vídeo</div>
                  <div className="admin-plans-header-cell" style={{ flex: '0 0 80px' }}>Links</div>
                  <div className="admin-plans-header-cell" style={{ flex: '0 0 150px' }}>Ações</div>
                </div>

                {/* Linhas */}
                {currentFaqs.length === 0 ? (
                  <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#6c757d',
                    background: 'white',
                    borderRadius: '8px',
                    marginTop: '1rem'
                  }}>
                    Nenhum item FAQ encontrado.
                  </div>
                ) : (
                  currentFaqs.map((faq) => (
                    <div key={faq.id} className="admin-plans-table-row" style={{ display: 'flex' }}>
                      <div className="admin-plans-cell" style={{ flex: '0 0 250px' }}>
                        <strong>{faq.question}</strong>
                      </div>
                      <div className="admin-plans-cell" style={{ flex: '0 0 150px' }}>
                        <span className="badge badge-info">{faq.category}</span>
                      </div>
                      <div className="admin-plans-cell" style={{ flex: '1 1 auto', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {faq.answer.substring(0, 150)}...
                      </div>
                      <div className="admin-plans-cell" style={{ flex: '0 0 80px', textAlign: 'center' }}>
                        {faq.videoUrl ? 'Sim' : 'Não'}
                      </div>
                      <div className="admin-plans-cell" style={{ flex: '0 0 80px', textAlign: 'center' }}>
                        {faq.links?.length || 0}
                      </div>
                      <div className="admin-plans-actions" style={{ flex: '0 0 150px' }}>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleOpenEditModal(faq)}
                          title="Editar FAQ"
                        >
                          <Edit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleOpenDeleteModal(faq)}
                          title="Excluir FAQ"
                        >
                          <Delete />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Paginação Inferior */}
            {currentFaqs.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '1rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#6c757d', whiteSpace: 'nowrap' }}>Itens por página:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
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

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                      <FirstPage />
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
                      <ChevronLeft />
                    </button>

                    <span style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      color: '#495057'
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
                      <ChevronRight />
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
                      <LastPage />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterInternal />

      {/* Modais */}
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={handleCloseFaqModal}
        onSave={handleSaveFaq}
        faqData={faqToEdit || undefined}
        mode={faqModalMode}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o item FAQ "${faqToDelete?.question}"?`}
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AdminFaq;
