import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Paper,
} from "@mui/material";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Settings } from "@mui/icons-material";
import PlanModal, { PlanData } from "../components/modals/PlanModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import BenefitsModal from "../components/modals/BenefitsModal";
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
  duration: number;
  maxUsers: number;
  features: string[];
  status: "Ativo" | "Inativo";
  createdAt: string;
  updatedAt: string;
}

const AdminPlans: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard } = useNavigation();
  const { toast, showToast, hideToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "Todos" | "Ativo" | "Inativo"
  >("Ativo");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const [sortField, setSortField] = useState<
    "name" | "price" | "duration" | "maxUsers" | "status" | "createdAt"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planModalMode, setPlanModalMode] = useState<"create" | "edit">(
    "create"
  );

  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);
  const [hasFilterChanges, setHasFilterChanges] = useState(false);

  // Valores iniciais dos filtros
  const initialFilters = {
    searchTerm: "",
    statusFilter: "Ativo" as "Todos" | "Ativo" | "Inativo",
    sortField: "name" as
      | "name"
      | "price"
      | "duration"
      | "maxUsers"
      | "status"
      | "createdAt",
    sortOrder: "asc" as "asc" | "desc",
  };

  const [plans] = useState<Plan[]>(() => {
    const basePlans = [
      {
        id: "1",
        name: "Plano Básico",
        description: "Plano ideal para clínicas pequenas",
        price: 199.9,
        duration: 12,
        maxUsers: 5,
        features: [
          "Agenda básica",
          "Cadastro de pacientes",
          "Relatórios simples",
        ],
        status: "Ativo" as const,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-02-20T14:30:00Z",
      },
      {
        id: "2",
        name: "Plano Professional",
        description: "Para clínicas em crescimento",
        price: 399.9,
        duration: 12,
        maxUsers: 15,
        features: [
          "Agenda avançada",
          "Múltiplos profissionais",
          "Relatórios completos",
          "Integração WhatsApp",
        ],
        status: "Ativo" as const,
        createdAt: "2024-01-20T09:15:00Z",
        updatedAt: "2024-03-10T16:45:00Z",
      },
      {
        id: "3",
        name: "Plano Enterprise",
        description: "Para grandes clínicas e hospitais",
        price: 799.9,
        duration: 12,
        maxUsers: 50,
        features: [
          "Recursos ilimitados",
          "API personalizada",
          "Suporte 24/7",
          "Customizações",
        ],
        status: "Ativo" as const,
        createdAt: "2024-02-01T11:30:00Z",
        updatedAt: "2024-03-15T13:20:00Z",
      },
      {
        id: "4",
        name: "Plano Teste",
        description: "Plano para demonstrações",
        price: 0,
        duration: 1,
        maxUsers: 2,
        features: ["Funcionalidades limitadas", "Apenas para testes"],
        status: "Inativo" as const,
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-01-10T08:00:00Z",
      },
    ];

    const additionalPlans = [];
    const planTypes = [
      "Básico",
      "Standard",
      "Premium",
      "Enterprise",
      "Corporate",
      "Starter",
    ];
    const descriptions = [
      "Ideal para pequenos consultórios",
      "Perfeito para clínicas médias",
      "Desenvolvido para hospitais",
      "Customizado para grandes redes",
      "Solução corporativa completa",
      "Plano inicial econômico",
    ];

    for (let i = 5; i <= 120; i++) {
      const planType = planTypes[i % planTypes.length];
      const description = descriptions[i % descriptions.length];
      const isActive = Math.random() > 0.3;

      additionalPlans.push({
        id: i.toString(),
        name: `${planType} ${i}`,
        description: `${description} - Versão ${i}`,
        price: Math.round((Math.random() * 800 + 100) * 100) / 100,
        duration: [6, 12, 24][Math.floor(Math.random() * 3)],
        maxUsers: [5, 10, 25, 50, 100][Math.floor(Math.random() * 5)],
        features: [`Recurso ${i}A`, `Funcionalidade ${i}B`, `Feature ${i}C`],
        status: isActive ? ("Ativo" as const) : ("Inativo" as const),
        createdAt: new Date(
          2024,
          Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 28) + 1
        ).toISOString(),
        updatedAt: new Date(
          2024,
          Math.floor(Math.random() * 3) + 1,
          Math.floor(Math.random() * 28) + 1
        ).toISOString(),
      });
    }

    return [...basePlans, ...additionalPlans];
  });

  const filteredAndSortedPlans = plans
    .filter((plan) => {
      const matchesSearch =
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "Todos" || plan.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let compareValue = 0;

      if (sortField === "name") {
        compareValue = a.name.localeCompare(b.name, "pt-BR");
      } else if (sortField === "price") {
        compareValue = a.price - b.price;
      } else if (sortField === "duration") {
        compareValue = a.duration - b.duration;
      } else if (sortField === "maxUsers") {
        compareValue = a.maxUsers - b.maxUsers;
      } else if (sortField === "status") {
        compareValue = a.status.localeCompare(b.status, "pt-BR");
      } else if (sortField === "createdAt") {
        compareValue =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  const totalPages = Math.ceil(filteredAndSortedPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlans = filteredAndSortedPlans.slice(startIndex, endIndex);

  const scrollToTop = () => {
    const listContainer = document.querySelector(".admin-plans-list-container");
    if (listContainer) {
      const containerRect = listContainer.getBoundingClientRect();
      const offset = 100;
      const targetPosition = window.pageYOffset + containerRect.top - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setTimeout(scrollToTop, 100);
  };

  const handleSort = (
    field: "name" | "price" | "duration" | "maxUsers" | "status" | "createdAt"
  ) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

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
        { label: "Relatórios", href: "/admin-reports" },
      ],
      loginTime: new Date().toISOString(),
    };

    setUserSession(simulatedUserSession);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOrder]);

  // Verificar se há mudanças nos filtros
  useEffect(() => {
    const hasChanges =
      searchTerm !== initialFilters.searchTerm ||
      statusFilter !== initialFilters.statusFilter ||
      sortField !== initialFilters.sortField ||
      sortOrder !== initialFilters.sortOrder;

    setHasFilterChanges(hasChanges);
  }, [searchTerm, statusFilter, sortField, sortOrder]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const clearFilters = () => {
    setSearchTerm(initialFilters.searchTerm);
    setStatusFilter(initialFilters.statusFilter);
    setSortField(initialFilters.sortField);
    setSortOrder(initialFilters.sortOrder);
    setCurrentPage(1);
    setHasFilterChanges(false);
  };

  const handleAddPlan = () => {
    setPlanModalMode("create");
    setPlanToEdit(null);
    setIsPlanModalOpen(true);
  };

  const handleOpenBenefitsModal = () => {
    setIsBenefitsModalOpen(true);
  };

  const handleSaveBenefits = (benefits: any[]) => {
    console.log("Benefícios atualizados:", benefits);
    showToast("Benefícios atualizados com sucesso!", "success");
  };

  const handleSavePlan = (data: PlanData) => {
    const includedFeatures = data.features
      .filter((f) => f.included)
      .map((f) => f.name);

    if (planModalMode === "create") {
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
        updatedAt: new Date().toISOString(),
      };
      console.log("Novo plano criado:", newPlan);
      showToast("Plano criado com sucesso!", "success");
    } else {
      console.log("Plano editado:", {
        ...planToEdit,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        maxUsers: data.maxUsers,
        features: includedFeatures,
        status: data.status,
        updatedAt: new Date().toISOString(),
      });
      showToast("Plano editado com sucesso!", "success");
    }
    setIsPlanModalOpen(false);
  };

  const handlePlanRowClick = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setPlanModalMode("edit");
      setPlanToEdit(plan);
      setIsPlanModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    try {
      console.log(
        `Excluindo plano: ${planToDelete.name} (ID: ${planToDelete.id})`
      );

      setIsDeleteModalOpen(false);
      setPlanToDelete(null);

      showToast("Plano excluído com sucesso!", "success");
    } catch (error) {
      showToast("Erro ao excluir plano", "error");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handlePlanAction = (action: string, planId: string) => {
    const plan = plans.find((p) => p.id === planId);

    if (action === "edit" && plan) {
      setPlanModalMode("edit");
      setPlanToEdit(plan);
      setIsPlanModalOpen(true);
    } else if (action === "delete" && plan) {
      setPlanToDelete(plan);
      setIsDeleteModalOpen(true);
    } else if (action === "duplicate" && plan) {
      console.log(`Duplicando plano: ${plan.name}`);
      alert("Funcionalidade de duplicar plano em desenvolvimento");
    } else if (action === "toggle-status" && plan) {
      console.log(`Alterando status do plano: ${plan.name}`);
      alert("Funcionalidade de alterar status em desenvolvimento");
    }
  };

  if (!userSession) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  const handleRevalidateLogin = () => {
    localStorage.removeItem("clinic4us-user-session");
    localStorage.removeItem("clinic4us-remember-me");
    alert("Sessão encerrada. Redirecionando para login..");
    window.location.href = window.location.origin + "/?page=login&clinic=ninho";
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
          padding: "1rem",
          minHeight: "calc(100vh - 120px)",
          background: colors.background,
          marginTop: "85px",
          flex: 1,
        }}
      >
        <Container maxWidth={false} disableGutters>
          {/* Título da Página */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "1.3rem",
                  mb: 1,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary,
                }}
              >
                Gestão de Planos
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary,
                  pb: "15px",
                }}
              >
                Gestão de planos e serviços oferecidos pela clínica.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FaqButton />
              <IconButton
                onClick={handleOpenBenefitsModal}
                title="Gerenciar benefícios"
                className="btn-settings"
                sx={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: colors.textSecondary,
                  color: colors.white,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#5a6268",
                  },
                }}
              >
                <Settings />
              </IconButton>
              <AddButton onClick={handleAddPlan} title="Adicionar novo plano" />
            </Box>
          </Box>

          {/* Filtros, Paginação e Lista */}
          <Paper
            elevation={0}
            sx={{
              padding: "1.5rem",
              mb: 2,
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              border: `1px solid ${colors.backgroundAlt}`,
            }}
          >
            {/* Filtros */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  label="Nome do Plano"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar plano"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    flex: "2 1 300px",
                    "& .MuiOutlinedInput-root": {
                      height: inputs.default.height,
                      "& fieldset": {
                        borderColor: colors.border,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.border,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: inputs.default.labelFontSize,
                      color: colors.textSecondary,
                      backgroundColor: colors.white,
                      padding: inputs.default.labelPadding,
                      "&.Mui-focused": {
                        color: colors.primary,
                      },
                    },
                  }}
                />

                <TextField
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    minWidth: "150px",
                    flex: "1 1 150px",
                    "& .MuiOutlinedInput-root": {
                      height: inputs.default.height,
                      "& fieldset": {
                        borderColor: colors.border,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.border,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: inputs.default.labelFontSize,
                      color: colors.textSecondary,
                      backgroundColor: colors.white,
                      padding: inputs.default.labelPadding,
                      "&.Mui-focused": {
                        color: colors.primary,
                      },
                    },
                  }}
                >
                  <MenuItem value="Ativo">Ativo</MenuItem>
                  <MenuItem value="Todos">Todos</MenuItem>
                  <MenuItem value="Inativo">Inativo</MenuItem>
                </TextField>

                <Box
                  sx={{
                    opacity: hasFilterChanges ? 1 : 0.5,
                    pointerEvents: hasFilterChanges ? "auto" : "none",
                  }}
                >
                  <ClearFiltersButton onClick={clearFilters} />
                </Box>
              </Box>
            </Box>

            {/* Paginação */}
            <StandardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedPlans.length}
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Lista de Planos */}
            <Box className="admin-plans-list-container" sx={{ mt: 2 }}>
              <Box className="admin-plans-table">
                <Box className="admin-plans-table-header">
                  <Box
                    className="admin-plans-header-cell"
                    sx={{
                      textAlign: "left",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => handleSort("name")}
                    title="Ordenar por nome"
                  >
                    Nome{" "}
                    {sortField === "name"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </Box>
                  <Box
                    className="admin-plans-header-cell"
                    sx={{ textAlign: "left" }}
                  >
                    Descrição
                  </Box>
                  <Box
                    className="admin-plans-header-cell"
                    sx={{
                      textAlign: "left",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => handleSort("price")}
                    title="Ordenar por preço"
                  >
                    Preço{" "}
                    {sortField === "price"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </Box>
                  <Box
                    className="admin-plans-header-cell"
                    sx={{
                      textAlign: "left",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => handleSort("duration")}
                    title="Ordenar por duração"
                  >
                    Duração{" "}
                    {sortField === "duration"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </Box>
                  <Box
                    className="admin-plans-header-cell"
                    sx={{
                      textAlign: "left",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => handleSort("maxUsers")}
                    title="Ordenar por máx usuários"
                  >
                    Max Usuários{" "}
                    {sortField === "maxUsers"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </Box>
                  <Box
                    className="admin-plans-header-cell"
                    sx={{
                      textAlign: "left",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => handleSort("status")}
                    title="Ordenar por status"
                  >
                    Status{" "}
                    {sortField === "status"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </Box>
                  <Box
                    className="admin-plans-header-cell"
                    sx={{
                      textAlign: "left",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => handleSort("createdAt")}
                    title="Ordenar por data de criação"
                  >
                    Criado em{" "}
                    {sortField === "createdAt"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </Box>
                  <Box
                    className="admin-plans-header-cell"
                    sx={{ justifyContent: "flex-end" }}
                  >
                    Ações
                  </Box>
                </Box>

                <Box className="admin-plans-table-body">
                  {paginatedPlans.map((plan) => (
                    <Box
                      key={plan.id}
                      className="admin-plans-table-row"
                      onClick={() => handlePlanRowClick(plan.id)}
                      sx={{ cursor: "pointer" }}
                    >
                      <Box
                        className="admin-plans-cell admin-plans-name"
                        data-label="Nome"
                        sx={{ textAlign: "left" }}
                      >
                        {plan.name}
                      </Box>
                      <Box
                        className="admin-plans-cell admin-plans-description"
                        data-label="Descrição"
                        sx={{ textAlign: "left" }}
                      >
                        {plan.description}
                      </Box>
                      <Box
                        className="admin-plans-cell admin-plans-price"
                        data-label="Preço"
                        sx={{ textAlign: "left" }}
                      >
                        {formatPrice(plan.price)}
                      </Box>
                      <Box
                        className="admin-plans-cell admin-plans-duration"
                        data-label="Duração"
                        sx={{ textAlign: "left" }}
                      >
                        {plan.duration} {plan.duration === 1 ? "mês" : "meses"}
                      </Box>
                      <Box
                        className="admin-plans-cell admin-plans-users"
                        data-label="Max Usuários"
                        sx={{ textAlign: "left" }}
                      >
                        {plan.maxUsers} usuários
                      </Box>
                      <Box
                        className="admin-plans-cell admin-plans-status"
                        data-label="Status"
                        sx={{ textAlign: "left" }}
                      >
                        <span
                          className={`plan-status-indicator ${
                            plan.status === "Ativo" ? "active" : "inactive"
                          }`}
                        >
                          {plan.status}
                        </span>
                      </Box>
                      <Box
                        className="admin-plans-cell admin-plans-created"
                        data-label="Criado em"
                        sx={{ textAlign: "left" }}
                      >
                        {formatDate(plan.createdAt)}
                      </Box>
                      <Box
                        className="admin-plans-cell admin-plans-actions"
                        data-label="Ações"
                        sx={{ textAlign: "right" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlanAction("edit", plan.id);
                            }}
                            title="Editar plano"
                            sx={{
                              backgroundColor: "#03B4C6",
                              color: "white",
                              width: "32px",
                              height: "32px",
                              "&:hover": {
                                backgroundColor: "#029AAB",
                              },
                            }}
                          >
                            <Edit sx={{ fontSize: "1rem" }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlanAction("delete", plan.id);
                            }}
                            title="Excluir plano"
                            sx={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              width: "32px",
                              height: "32px",
                              "&:hover": {
                                backgroundColor: "#c82333",
                              },
                            }}
                          >
                            <Delete sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Paginação Inferior */}
            <Box sx={{ mt: 2 }}>
              <StandardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredAndSortedPlans.length}
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

      <FooterInternal simplified={true} className="login-footer-component" />

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

      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={handleSavePlan}
        mode={planModalMode}
        initialData={
          planToEdit
            ? {
                name: planToEdit.name,
                description: planToEdit.description,
                price: planToEdit.price,
                annualPrice: planToEdit.price * 12 * 0.9,
                duration: planToEdit.duration,
                maxUsers: planToEdit.maxUsers,
                features: planToEdit.features.map((f) => ({
                  name: f,
                  included: true,
                })),
                status: planToEdit.status,
              }
            : undefined
        }
      />

      <BenefitsModal
        isOpen={isBenefitsModalOpen}
        onClose={() => setIsBenefitsModalOpen(false)}
        onSave={handleSaveBenefits}
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

export default AdminPlans;
