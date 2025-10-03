import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Add, FilterAltOff, FirstPage, ChevronLeft, ChevronRight, LastPage } from '@mui/icons-material';
import ConfirmModal from "../components/modals/ConfirmModal";
import FaqModal, { FaqData } from "../components/modals/FaqModal";
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
  const [sortField, setSortField] = useState<'question' | 'category'>('question');
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
      let compareValue = 0;
      if (sortField === 'question') {
        compareValue = a.question.localeCompare(b.question);
      } else if (sortField === 'category') {
        compareValue = a.category.localeCompare(b.category);
      }
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

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('Todos');
    setCurrentPage(1);
  };

  const handleSort = (field: 'question' | 'category') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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
            <div className="page-header-container">
              <div className="page-header-content">
                <h1 className="page-header-title">Gestão de FAQ</h1>
                <p className="page-header-description">Gestão de perguntas frequentes e respostas do sistema.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <FaqButton />
                <button
                  onClick={handleOpenCreateModal}
                  title="Adicionar novo item FAQ"
                  className="btn-add"
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
                      minWidth: '120px',
                      width: '100%',
                      paddingRight: '2rem',
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
                totalItems={filteredAndSortedFaqs.length}
                itemLabel="itens"
                onPageChange={(page) => {
                  setCurrentPage(page);
                  setTimeout(scrollToTop, 100);
                }}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>

            {/* Tabela de FAQs */}
            <div className="admin-plans-list-container">
              <div className="admin-plans-table">
                {/* Header */}
                <div className="admin-plans-table-header" style={{ display: 'flex' }}>
                  <div
                    className="admin-plans-header-cell"
                    style={{ flex: '0 0 250px', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('question')}
                    title="Ordenar por pergunta"
                  >
                    Pergunta {sortField === 'question' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </div>
                  <div
                    className="admin-plans-header-cell"
                    style={{ flex: '0 0 150px', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('category')}
                    title="Ordenar por categoria"
                  >
                    Categoria {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </div>
                  <div className="admin-plans-header-cell" style={{ flex: '1 1 auto' }}>Resposta (Prévia)</div>
                  <div className="admin-plans-header-cell" style={{ flex: '0 0 80px' }}>Vídeo</div>
                  <div className="admin-plans-header-cell" style={{ flex: '0 0 80px' }}>Links</div>
                  <div className="admin-plans-header-cell" style={{ flex: '0 0 150px', justifyContent: 'flex-end' }}>Ações</div>
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
                          className="btn-action-edit"
                          onClick={() => handleOpenEditModal(faq)}
                          title="Editar FAQ"
                        >
                          <Edit fontSize="small" />
                        </button>
                        <button
                          className="btn-action-delete"
                          onClick={() => handleOpenDeleteModal(faq)}
                          title="Excluir FAQ"
                        >
                          <Delete fontSize="small" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
                totalItems={filteredAndSortedFaqs.length}
                itemLabel="itens"
                onPageChange={(page) => {
                  setCurrentPage(page);
                  setTimeout(scrollToTop, 100);
                }}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
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
