import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { FaqButton } from "../components/FaqButton";
import { ExpandMore, ExpandLess, Delete, FirstPage, LastPage, ChevronLeft, ChevronRight } from '@mui/icons-material';

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
  loginTime: string;
}

interface FaqItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  videoUrl?: string;
  links?: { text: string; url: string }[];
}

const Faq: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { goToDashboard } = useNavigation();

  const faqData: FaqItem[] = [
    {
      id: 1,
      category: "Administração Cliente",
      question: "Cadastrando novos usuários",
      answer: "Para cadastrar novos usuários, acesse o menu 'Entidades', clique no ícone 'Usuários' e depois no botão '+' para incluir um novo usuário.",
      links: [
        { text: "Ver tutorial completo", url: "#tutorial-usuarios" }
      ]
    },
    {
      id: 2,
      category: "Administração Cliente",
      question: "Configurando disponibilidade de profissionais",
      answer: "A configuração da disponibilidade de um profissional afeta diretamente o agendamento de seus atendimentos. O sistema verifica se:\n\n• O período informado está dentro da disponibilidade do profissional.\n• O agendamento não conflita com outros compromissos já registrados. (Este item depende dos agendamentos do profissional, não de configurações específicas.)\n• A duração do agendamento respeita o tempo previsto para o tipo de atendimento escolhido.",
      videoUrl: "https://www.youtube.com/embed/exemplo"
    },
    {
      id: 3,
      category: "Agendamentos",
      question: "Como agendar uma consulta?",
      answer: "Para agendar uma consulta, acesse o menu 'Agenda', selecione o profissional desejado, clique no horário disponível e preencha os dados do paciente.",
      links: [
        { text: "Manual de agendamentos", url: "#manual-agendamentos" },
        { text: "Vídeo tutorial", url: "#video-agendamentos" }
      ]
    },
    {
      id: 4,
      category: "Pacientes",
      question: "Como cadastrar um novo paciente?",
      answer: "Acesse o menu 'Cadastro Paciente', preencha todos os campos obrigatórios (nome, CPF, data de nascimento, contato) e clique em 'Salvar'. O paciente ficará disponível para agendamentos imediatamente.",
      videoUrl: "https://www.youtube.com/embed/exemplo-paciente"
    },
    {
      id: 5,
      category: "Planos",
      question: "Como criar um novo plano de atendimento?",
      answer: "No menu 'Planos', clique no botão '+' para adicionar um novo plano. Defina o nome, tipo (consulta única ou recorrente), valor e funcionalidades incluídas no plano.",
    }
  ];

  const categories = ["all", ...Array.from(new Set(faqData.map(item => item.category)))];

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

  const toggleItem = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaq = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredFaq.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredFaq.slice(startIndex, endIndex);

  const itemsPerPageOptions = [5, 10, 20, 50];

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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  if (!userSession) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="login-page">
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
              <h1 className="page-title">FAQ</h1>
              <FaqButton />
            </div>

            {/* Busca e Filtros */}
            <div className="faq-filters-container">
              <div className="faq-filters-grid">
                {/* Dropdown de Categorias */}
                <div className="faq-filter-group">
                  <label>Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="faq-category-select"
                    style={{
                      minWidth: '120px',
                      width: '100%',
                      paddingRight: '2rem'
                    }}
                  >
                    <option value="all">Todas as categorias</option>
                    {categories.filter(cat => cat !== "all").map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Campo de Busca */}
                <div className="faq-filter-group">
                  <label>Busca por palavra</label>
                  <input
                    type="text"
                    placeholder="Pesquisar FAQ"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="faq-search-input"
                  />
                </div>

                {/* Botão limpar filtros */}
                <div className="faq-clear-button-wrapper">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    title="Limpar filtros"
                    className="faq-clear-button"
                  >
                    <Delete fontSize="small" />
                  </button>
                </div>
              </div>

              {/* Paginação */}
              <div className="faq-pagination-wrapper" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e9ecef' }}>
                <div className="pagination-container">
                  <div className="items-per-page-selector">
                    <label>Itens por página:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      style={{
                        minWidth: '120px',
                        width: '100%',
                        paddingRight: '2rem'
                      }}
                    >
                      {itemsPerPageOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pagination-navigation">
                    <button
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      title="Primeira página"
                      className="pagination-btn"
                    >
                      <FirstPage />
                    </button>

                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      title="Página anterior"
                      className="pagination-btn"
                    >
                      <ChevronLeft />
                    </button>

                    <span className="pagination-info">
                      {currentPage} de {totalPages}
                    </span>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      title="Próxima página"
                      className="pagination-btn"
                    >
                      <ChevronRight />
                    </button>

                    <button
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      title="Última página"
                      className="pagination-btn"
                    >
                      <LastPage />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de FAQ */}
            <div className="faq-list-container">
              {currentItems.length === 0 ? (
                <div className="faq-empty-state">
                  Nenhum item encontrado para sua busca.
                </div>
              ) : (
                currentItems.map((item) => (
                  <div key={item.id} className="faq-item">
                    {/* Pergunta - Clicável */}
                    <div
                      onClick={() => toggleItem(item.id)}
                      className={`faq-question-header ${expandedItems.includes(item.id) ? 'expanded' : ''}`}
                    >
                      <div className="faq-question-content">
                        <div className="faq-category-label">
                          {item.category}
                        </div>
                        <div className="faq-question-text">
                          {item.question}
                        </div>
                      </div>
                      {expandedItems.includes(item.id) ? (
                        <ExpandLess style={{ color: '#03B4C6' }} />
                      ) : (
                        <ExpandMore style={{ color: '#6c757d' }} />
                      )}
                    </div>

                    {/* Resposta - Expansível */}
                    {expandedItems.includes(item.id) && (
                      <div className="faq-answer-container">
                        <div className="faq-answer-text">
                          {item.answer}
                        </div>

                        {/* Vídeo (se houver) */}
                        {item.videoUrl && (
                          <div className="faq-video-wrapper">
                            <div className="faq-video-container">
                              <iframe
                                src={item.videoUrl}
                                className="faq-video-iframe"
                                allowFullScreen
                                title={item.question}
                              />
                            </div>
                          </div>
                        )}

                        {/* Links (se houver) */}
                        {item.links && item.links.length > 0 && (
                          <div className="faq-links-container">
                            {item.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                className="faq-link"
                              >
                                → {link.text}
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Como configurar a disponibilidade de agenda */}
                        {item.id === 2 && (
                          <div className="faq-config-steps">
                            <div className="faq-config-title">
                              Como configurar a disponibilidade de agenda:
                            </div>
                            <ol className="faq-config-list">
                              <li>Com um usuário no perfil "Adm. Cliente", acesse o menu <strong>"Entidades"</strong>.</li>
                              <li>Clique no ícone <strong>"Usuários"</strong> para visualizar os profissionais cadastrados.</li>
                              <li>Encontre o profissional desejado e clique no ícone <strong>"Disponibilidade"</strong>.</li>
                              <li>Clique no ícone <strong>"+"</strong> para incluir um novo período de disponibilidade para o profissional.</li>
                            </ol>
                            <div className="faq-config-note">
                              <strong>Observação:</strong> A disponibilidade é definida por dia da semana. Certifique-se de excluir os horários de intervalo, como nos exemplos abaixo:
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Paginação Inferior */}
            {currentItems.length > 0 && (
              <div className="faq-filters-container" style={{ marginTop: '1.5rem' }}>
                <div className="faq-pagination-wrapper">
                  <div className="pagination-container">
                    <div className="items-per-page-selector">
                      <label>Itens por página:</label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        style={{
                          minWidth: '120px',
                          width: '100%',
                          paddingRight: '2rem'
                        }}
                      >
                        {itemsPerPageOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pagination-navigation">
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        title="Primeira página"
                        className="pagination-btn"
                      >
                        <FirstPage />
                      </button>

                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        title="Página anterior"
                        className="pagination-btn"
                      >
                        <ChevronLeft />
                      </button>

                      <span className="pagination-info">
                        {currentPage} de {totalPages}
                      </span>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        title="Próxima página"
                        className="pagination-btn"
                      >
                        <ChevronRight />
                      </button>

                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        title="Última página"
                        className="pagination-btn"
                      >
                        <LastPage />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterInternal />
    </div>
  );
};

export default Faq;
