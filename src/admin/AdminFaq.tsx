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
import FaqModal, { FaqData } from "../components/modals/FaqModal";
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
  icon?: string;
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

  // Estado de mudanças nos filtros
  const [hasFilterChanges, setHasFilterChanges] = useState(false);

  // Valores iniciais dos filtros
  const initialFilters = {
    searchTerm: '',
    categoryFilter: 'Todos',
    sortField: 'question' as 'question' | 'category',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

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

  // Verificar se há mudanças nos filtros
  useEffect(() => {
    const hasChanges =
      searchTerm !== initialFilters.searchTerm ||
      categoryFilter !== initialFilters.categoryFilter ||
      sortField !== initialFilters.sortField ||
      sortOrder !== initialFilters.sortOrder;

    setHasFilterChanges(hasChanges);
  }, [searchTerm, categoryFilter, sortField, sortOrder, initialFilters.searchTerm, initialFilters.categoryFilter, initialFilters.sortField, initialFilters.sortOrder]);

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
    setSearchTerm(initialFilters.searchTerm);
    setCategoryFilter(initialFilters.categoryFilter);
    setSortField(initialFilters.sortField);
    setSortOrder(initialFilters.sortOrder);
    setCurrentPage(1);
    setHasFilterChanges(false);
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
                Gestão de FAQ
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary
                }}
              >
                Gestão de perguntas frequentes e respostas do sistema.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaqButton />
              <AddButton onClick={handleOpenCreateModal} title="Adicionar novo item FAQ" />
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
                label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por pergunta, resposta ou categoria"
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
                label="Categoria"
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
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
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
              totalItems={filteredAndSortedFaqs.length}
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Lista de FAQs */}
            <Box className="admin-plans-list-container" sx={{ mt: 2 }}>
            <Box className="admin-plans-table">
              <Box className="admin-plans-table-header" sx={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 3fr 0.8fr 0.8fr 1.5fr', width: '100%' }}>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('question')}
                  title="Ordenar por pergunta"
                >
                  Pergunta {sortField === 'question' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box
                  className="admin-plans-header-cell"
                  sx={{ textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('category')}
                  title="Ordenar por categoria"
                >
                  Categoria {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </Box>
                <Box className="admin-plans-header-cell" sx={{ textAlign: 'left' }}>Resposta (Prévia)</Box>
                <Box className="admin-plans-header-cell" sx={{ textAlign: 'center' }}>Vídeo</Box>
                <Box className="admin-plans-header-cell" sx={{ textAlign: 'center' }}>Links</Box>
                <Box className="admin-plans-header-cell" sx={{ justifyContent: 'flex-end' }}>Ações</Box>
              </Box>

              <Box className="admin-plans-table-body">
                {currentFaqs.length === 0 ? (
                  <Box sx={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: colors.textSecondary,
                    background: colors.white,
                    borderRadius: '8px',
                    marginTop: '1rem'
                  }}>
                    Nenhum item FAQ encontrado.
                  </Box>
                ) : (
                  currentFaqs.map((faq) => (
                    <Box key={faq.id} className="admin-plans-table-row" sx={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 3fr 0.8fr 0.8fr 1.5fr', width: '100%' }}>
                      <Box className="admin-plans-cell" data-label="Pergunta" sx={{ textAlign: 'left' }}>
                        <strong>{faq.question}</strong>
                      </Box>
                      <Box className="admin-plans-cell" data-label="Categoria" sx={{ textAlign: 'left' }}>
                        <span className="badge badge-info">{faq.category}</span>
                      </Box>
                      <Box className="admin-plans-cell" data-label="Resposta" sx={{ textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {faq.answer.substring(0, 150)}...
                      </Box>
                      <Box className="admin-plans-cell" data-label="Vídeo" sx={{ textAlign: 'center' }}>
                        {faq.videoUrl ? 'Sim' : 'Não'}
                      </Box>
                      <Box className="admin-plans-cell" data-label="Links" sx={{ textAlign: 'center' }}>
                        {faq.links?.length || 0}
                      </Box>
                      <Box className="admin-plans-cell admin-plans-actions" data-label="Ações" sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditModal(faq)}
                            title="Editar FAQ"
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
                            onClick={() => handleOpenDeleteModal(faq)}
                            title="Excluir FAQ"
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
                  ))
                )}
              </Box>
            </Box>
            </Box>

            {/* Paginação Inferior */}
            <Box sx={{ mt: 2 }}>
              <StandardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredAndSortedFaqs.length}
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
    </Box>
  );
};

export default AdminFaq;
