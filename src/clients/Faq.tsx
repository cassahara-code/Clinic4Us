import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Link,
  MenuItem
} from '@mui/material';
import { ExpandMore, FilterAltOff } from '@mui/icons-material';
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { FaqButton } from "../components/FaqButton";
import StandardPagination from "../components/Pagination/StandardPagination";
import { colors, typography, inputs } from "../theme/designSystem";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const hasFilters = searchTerm !== "" || selectedCategory !== "all";

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

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
                FAQ - Perguntas Frequentes
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary
                }}
              >
                Encontre respostas para as dúvidas mais comuns sobre o sistema.
              </Typography>
            </Box>
            <FaqButton />
          </Box>

          {/* Filtros, Paginação e Lista de FAQ */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${colors.backgroundAlt}`,
            }}
          >
            {/* Filtros */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap', mb: 2 }}>
              <TextField
                select
                label="Categoria"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  minWidth: '200px',
                  flex: '1 1 200px',
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
                <MenuItem value="all">Todas as categorias</MenuItem>
                {categories.filter(cat => cat !== "all").map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Busca por palavra"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar FAQ"
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

              <IconButton
                onClick={handleClearFilters}
                disabled={!hasFilters}
                title="Limpar filtros"
                sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: hasFilters ? colors.textSecondary : colors.backgroundAlt,
                  color: hasFilters ? colors.white : colors.borderHover,
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: hasFilters ? '#5a6268' : colors.backgroundAlt,
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                <FilterAltOff fontSize="small" />
              </IconButton>
            </Box>

            {/* Paginação */}
            <StandardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredFaq.length}
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Lista de FAQ */}
            <Box sx={{ mt: 2 }}>
            {currentItems.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: colors.textSecondary }}>
                  Nenhum item encontrado para sua busca.
                </Typography>
              </Box>
            ) : (
              currentItems.map((item) => (
                <Accordion
                  key={item.id}
                  expanded={expandedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  elevation={0}
                  sx={{
                    mb: 1,
                    borderRadius: '8px !important',
                    border: `1px solid ${colors.backgroundAlt}`,
                    '&:before': {
                      display: 'none',
                    },
                    '&.Mui-expanded': {
                      margin: '0 0 8px 0',
                    },
                    '&:last-child': {
                      mb: 0,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: colors.primary }} />}
                    sx={{
                      '&.Mui-expanded': {
                        borderBottom: `1px solid ${colors.backgroundAlt}`,
                      },
                    }}
                  >
                    <Box>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          mb: 1,
                          backgroundColor: colors.primaryLight,
                          color: colors.primary,
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.textPrimary,
                        }}
                      >
                        {item.question}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 2 }}>
                    <Typography
                      sx={{
                        fontSize: typography.fontSize.sm,
                        color: colors.textPrimary,
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.7,
                        mb: 2
                      }}
                    >
                      {item.answer}
                    </Typography>

                    {/* Vídeo */}
                    {item.videoUrl && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{
                          position: 'relative',
                          paddingBottom: '56.25%',
                          height: 0,
                          overflow: 'hidden',
                          borderRadius: '8px'
                        }}>
                          <iframe
                            src={item.videoUrl}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              border: 'none'
                            }}
                            allowFullScreen
                            title={item.question}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Links */}
                    {item.links && item.links.length > 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        {item.links.map((link, idx) => (
                          <Link
                            key={idx}
                            href={link.url}
                            sx={{
                              color: colors.primary,
                              fontSize: typography.fontSize.sm,
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            → {link.text}
                          </Link>
                        ))}
                      </Box>
                    )}

                    {/* Configuração especial para item 2 */}
                    {item.id === 2 && (
                      <Box sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: colors.background,
                        borderRadius: '8px'
                      }}>
                        <Typography
                          sx={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.textPrimary,
                            mb: 1
                          }}
                        >
                          Como configurar a disponibilidade de agenda:
                        </Typography>
                        <Box
                          component="ol"
                          sx={{
                            pl: 2,
                            '& li': {
                              fontSize: typography.fontSize.sm,
                              color: colors.textPrimary,
                              mb: 0.5
                            }
                          }}
                        >
                          <li>Com um usuário no perfil "Adm. Cliente", acesse o menu <strong>"Entidades"</strong>.</li>
                          <li>Clique no ícone <strong>"Usuários"</strong> para visualizar os profissionais cadastrados.</li>
                          <li>Encontre o profissional desejado e clique no ícone <strong>"Disponibilidade"</strong>.</li>
                          <li>Clique no ícone <strong>"+"</strong> para incluir um novo período de disponibilidade para o profissional.</li>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: typography.fontSize.sm,
                            color: colors.textSecondary,
                            mt: 1,
                            fontStyle: 'italic'
                          }}
                        >
                          <strong>Observação:</strong> A disponibilidade é definida por dia da semana. Certifique-se de excluir os horários de intervalo, como nos exemplos abaixo:
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            )}
            </Box>

            {/* Paginação Inferior */}
            {currentItems.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <StandardPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredFaq.length}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    setTimeout(scrollToTop, 100);
                  }}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      <FooterInternal />
    </Box>
  );
};

export default Faq;
