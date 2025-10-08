import React, { useState, useEffect } from "react";
import { UserSession } from "../interfaces/UserSession";
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
import PlanModal from "../components/modals/PlanModal";
import { PlanData } from "../interfaces/PlanData";
import { Plano } from "../interfaces/Plano";
import ConfirmModal from "../components/modals/ConfirmModal";
import BenefitsModal from "../components/modals/BenefitsModal";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { FaqButton } from "../components/FaqButton";
import StandardPagination from "../components/Pagination/StandardPagination";
import AddButton from "../components/AddButton";
import ClearFiltersButton from "../components/ClearFiltersButton";
import { colors, typography, inputs } from "../theme/designSystem";
import { planoService } from "../services/planoService";

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
  const [planToDelete, setPlanToDelete] = useState<Plano | null>(null);
  const [planToEdit, setPlanToEdit] = useState<Plano | null>(null);

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

  // Busca lista de planos do backend
  const [plans, setPlans] = useState<Plano[]>([]);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const planos = await planoService.getAllPlanos();
        // Mapear os dados recebidos para o tipo Plan
        const mappedPlans: Plano[] = planos.map((plano: any) => ({
          id: plano.id,
          planTitle: plano.planTitle,
          description: plano.description,
          monthlyValue: plano.monthlyValue,
          anualyValue: plano.anualyValue,
          createdAt: plano.createdAt,
          updatedAt: plano.updatedAt,
          createdBy: plano.createdBy,
          updatedBy: plano.updatedBy,
          active: plano.active,
          plansBenefits: plano.plansBenefits ?? [],
        }));
        console.log("Planos recebidos do backend:", planos);
        console.log("Planos mapeados:", mappedPlans);
        setPlans(mappedPlans);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      }
    };
    fetchPlans();
  }, []);

  const filteredAndSortedPlans = plans
    .filter((plan) => {
      // Deriva status textual
      const statusText = plan.active === 1 ? "Ativo" : "Inativo";
      const statusNormalized = statusText.toLowerCase();
      const statusFilterNormalized = statusFilter.toLowerCase();

      const matchesStatus =
        statusFilterNormalized === "todos" ||
        statusNormalized === statusFilterNormalized ||
        (statusFilterNormalized === "ativo" &&
          ["ativo", "active"].includes(statusNormalized)) ||
        (statusFilterNormalized === "inativo" &&
          ["inativo", "inactive"].includes(statusNormalized));

      // Busca insensível a maiúsculas/minúsculas e ignora acentuação
      const normalize = (str: string | undefined): string =>
        (str || "")
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      const name = normalize(plan?.planTitle);
      const description = normalize(plan?.description);
      const search = normalize(searchTerm);
      const matchesSearch =
        name.includes(search) || description.includes(search);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Deriva campos para ordenação
      const priceA = a.monthlyValue;
      const priceB = b.monthlyValue;
      const durationA = a.plansBenefits.length;
      const durationB = b.plansBenefits.length;
      const maxUsersA = a.plansBenefits.length; // Ajuste conforme campo real
      const maxUsersB = b.plansBenefits.length; // Ajuste conforme campo real
      const statusA = a.active === 1 ? "Ativo" : "Inativo";
      const statusB = b.active === 1 ? "Ativo" : "Inativo";

      let compareValue = 0;
      if (sortField === "name") {
        compareValue = a.planTitle.localeCompare(b.planTitle, "pt-BR");
      } else if (sortField === "price") {
        compareValue = priceA - priceB;
      } else if (sortField === "duration") {
        compareValue = durationA - durationB;
      } else if (sortField === "maxUsers") {
        compareValue = maxUsersA - maxUsersB;
      } else if (sortField === "status") {
        compareValue = statusA.localeCompare(statusB, "pt-BR");
      } else if (sortField === "createdAt") {
        compareValue =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === "asc" ? compareValue : -compareValue;
    });
  console.log("filteredAndSortedPlans:", filteredAndSortedPlans);

  const totalPages = Math.ceil(filteredAndSortedPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlans = Array.isArray(filteredAndSortedPlans)
    ? filteredAndSortedPlans.slice(startIndex, endIndex)
    : [];

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
    // Inicializa a sessão do usuário automaticamente ao carregar os planos
    if (!userSession && plans.length > 0) {
      setUserSession({
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
      });
    }
  }, [userSession, plans]);

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
  }, [
    searchTerm,
    statusFilter,
    sortField,
    sortOrder,
    initialFilters.searchTerm,
    initialFilters.statusFilter,
    initialFilters.sortField,
    initialFilters.sortOrder,
  ]);

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
    const benefits = data.features.map((f) => ({
      id: crypto.randomUUID(),
      planId: planToEdit?.id || "",
      itenDescription: f.name,
      covered: f.included,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "system",
      updatedBy: "system",
    }));

    if (planModalMode === "create") {
      const newPlan: Plano = {
        id: crypto.randomUUID(),
        planTitle: data.name,
        description: data.description,
        monthlyValue: data.price,
        anualyValue: data.annualPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
        updatedBy: "system",
        active: data.status === "Ativo" ? 1 : 0,
        plansBenefits: benefits,
      };
      console.log("Novo plano criado:", newPlan);
      showToast("Plano criado com sucesso!", "success");
    } else if (planToEdit) {
      const updatedPlan: Plano = {
        ...planToEdit,
        planTitle: data.name,
        description: data.description,
        monthlyValue: data.price,
        anualyValue: data.annualPrice,
        updatedAt: new Date().toISOString(),
        active: data.status === "Ativo" ? 1 : 0,
        plansBenefits: benefits,
      };
      console.log("Plano editado:", updatedPlan);
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
        `Excluindo plano: ${planToDelete.planTitle} (ID: ${planToDelete.id})`
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
      console.log(`Duplicando plano: ${plan.planTitle}`);
      alert("Funcionalidade de duplicar plano em desenvolvimento");
    } else if (action === "toggle-status" && plan) {
      console.log(`Alterando status do plano: ${plan.planTitle}`);
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
                  {paginatedPlans.length === 0 ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: colors.textSecondary,
                      }}
                    >
                      Nenhum plano encontrado.
                    </Box>
                  ) : (
                    paginatedPlans.map((plan) => (
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
                          {plan.planTitle}
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
                          {formatPrice(plan.monthlyValue)}
                        </Box>
                        <Box
                          className="admin-plans-cell admin-plans-duration"
                          data-label="Duração"
                          sx={{ textAlign: "left" }}
                        >
                          {plan.plansBenefits.length} benefícios
                        </Box>
                        <Box
                          className="admin-plans-cell admin-plans-users"
                          data-label="Max Usuários"
                          sx={{ textAlign: "left" }}
                        >
                          {plan.plansBenefits.length} usuários
                        </Box>
                        <Box
                          className="admin-plans-cell admin-plans-status"
                          data-label="Status"
                          sx={{ textAlign: "left" }}
                        >
                          <span
                            className={`plan-status-indicator ${
                              plan.active === 1 ? "active" : "inactive"
                            }`}
                          >
                            {plan.active === 1 ? "Ativo" : "Inativo"}
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
        message={`Tem certeza que deseja excluir o plano ${planToDelete?.planTitle}?`}
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
                name: planToEdit.planTitle,
                description: planToEdit.description,
                price: planToEdit.monthlyValue,
                annualPrice: planToEdit.anualyValue,
                duration: planToEdit.plansBenefits.length,
                maxUsers: planToEdit.plansBenefits.length,
                features: planToEdit.plansBenefits.map((b) => ({
                  name: b.itenDescription,
                  included: b.covered,
                })),
                status: planToEdit.active === 1 ? "Ativo" : "Inativo",
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
