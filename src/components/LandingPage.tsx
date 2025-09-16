import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./LandingPage.css";
import logo from "../images/logo_clinic4us.png";
import fabio from "../images/Fabio.jpg";
import hiltonCeo from "../images/hilton_ceo.png";
import atalitaFono from "../images/atalita_fono.png";
import laizaResolve from "../images/laiza_resolve.png";
import formContactImage from "../images/form_contact_image.jpg";
import freeEvaluationImage from "../images/free_evaluation.jpg";
import ingridResolve from "../images/ingrid_resolve.png";
import hellenStudio from "../images/hellen_studio.png";
import fernandaNinho from "../images/fernanda_ninho.png";
import Grid from "@mui/material/Grid";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [showTrialSuccess, setShowTrialSuccess] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    period: string;
    features: string[];
  } | null>(null);
  const [trialFormData, setTrialFormData] = useState({
    nomeCompleto: "",
    email: "",
    whatsapp: "",
    qtdProfissionais: "",
  });
  const [trialSelectedCountry, setTrialSelectedCountry] = useState({
    code: "BR",
    name: "Brasil",
    prefix: "+55",
    flag: "BR",
  });
  const [isTrialCountryDropdownOpen, setIsTrialCountryDropdownOpen] =
    useState(false);
  const [subscriptionFormData, setSubscriptionFormData] = useState({
    nomeCompleto: "",
    email: "",
    cpfCnpj: "",
    razaoSocial: "",
    telefone: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    whatsapp: "",
    assunto: "",
    mensagem: "",
  });
  const [selectedCountry, setSelectedCountry] = useState({
    code: "BR",
    name: "Brasil",
    prefix: "+55",
    flag: "BR",
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries = [
    { code: "BR", name: "Brasil", prefix: "+55", flag: "BR" },
    { code: "US", name: "Estados Unidos", prefix: "+1", flag: "US" },
    { code: "CA", name: "Canadá", prefix: "+1", flag: "CA" },
    { code: "AR", name: "Argentina", prefix: "+54", flag: "AR" },
    { code: "CL", name: "Chile", prefix: "+56", flag: "CL" },
    { code: "CO", name: "Colômbia", prefix: "+57", flag: "CO" },
    { code: "MX", name: "México", prefix: "+52", flag: "MX" },
    { code: "PE", name: "Peru", prefix: "+51", flag: "PE" },
    { code: "UY", name: "Uruguai", prefix: "+598", flag: "UY" },
    { code: "PY", name: "Paraguai", prefix: "+595", flag: "PY" },
    { code: "BO", name: "Bolívia", prefix: "+591", flag: "BO" },
    { code: "VE", name: "Venezuela", prefix: "+58", flag: "VE" },
    { code: "EC", name: "Equador", prefix: "+593", flag: "EC" },
    { code: "CR", name: "Costa Rica", prefix: "+506", flag: "CR" },
    { code: "PA", name: "Panamá", prefix: "+507", flag: "PA" },
    { code: "GT", name: "Guatemala", prefix: "+502", flag: "GT" },
    { code: "PT", name: "Portugal", prefix: "+351", flag: "PT" },
    { code: "ES", name: "Espanha", prefix: "+34", flag: "ES" },
    { code: "FR", name: "França", prefix: "+33", flag: "FR" },
    { code: "IT", name: "Itália", prefix: "+39", flag: "IT" },
    { code: "DE", name: "Alemanha", prefix: "+49", flag: "DE" },
    { code: "UK", name: "Reino Unido", prefix: "+44", flag: "UK" },
    { code: "AU", name: "Austrália", prefix: "+61", flag: "AU" },
    { code: "JP", name: "Japão", prefix: "+81", flag: "JP" },
    { code: "CN", name: "China", prefix: "+86", flag: "CN" },
    { code: "IN", name: "Índia", prefix: "+91", flag: "IN" },
    { code: "ZA", name: "África do Sul", prefix: "+27", flag: "ZA" },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCountryDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest(".country-selector")) {
          setIsCountryDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCountryDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openContactModal = (
    e: React.MouseEvent,
    preSelectedSubject?: string
  ) => {
    e.preventDefault();
    if (preSelectedSubject) {
      setFormData((prev) => ({
        ...prev,
        assunto: preSelectedSubject,
      }));
    }
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setShowThankYou(false);
  };

  const openTrialModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTrialModalOpen(true);
  };

  const closeTrialModal = () => {
    setIsTrialModalOpen(false);
    setShowTrialSuccess(false);
    setTrialFormData({
      nomeCompleto: "",
      email: "",
      whatsapp: "",
      qtdProfissionais: "",
    });
    setTrialSelectedCountry({
      code: "BR",
      name: "Brasil",
      prefix: "+55",
      flag: "BR",
    });
  };

  const openSubscriptionModal = (
    planName: string,
    planPrice: string,
    planPeriod: string,
    planFeatures: string[]
  ) => {
    setSelectedPlan({
      name: planName,
      price: planPrice,
      period: planPeriod,
      features: planFeatures,
    });
    setIsSubscriptionModalOpen(true);
  };

  const closeSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false);
    setShowSubscriptionSuccess(false);
    setSelectedPlan(null);
    setSubscriptionFormData({
      nomeCompleto: "",
      email: "",
      cpfCnpj: "",
      razaoSocial: "",
      telefone: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
    });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trialFormData.nomeCompleto) {
      alert("Por favor, informe seu nome completo!");
      return;
    }

    if (!trialFormData.email) {
      alert("Por favor, informe seu email!");
      return;
    }

    if (!isValidEmail(trialFormData.email)) {
      alert("Por favor, informe um email válido!");
      return;
    }

    if (!trialFormData.whatsapp) {
      alert("Por favor, informe seu WhatsApp!");
      return;
    }

    if (!trialFormData.qtdProfissionais) {
      alert("Por favor, selecione a quantidade de profissionais!");
      return;
    }

    // Simulação de envio - aqui você integraria com sua API
    console.log(
      "Dados para teste grátis:",
      trialFormData,
      "País:",
      trialSelectedCountry
    );
    setShowTrialSuccess(true);
  };

  const formatWhatsApp = (value: string, country: string = "BR") => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    if (country === "BR") {
      // Formato brasileiro: (11) 99999-9999
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 7)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    } else if (country === "US") {
      // Formato americano: (123) 456-7890
      if (numbers.length <= 3) return `(${numbers}`;
      if (numbers.length <= 6)
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
        6,
        10
      )}`;
    } else {
      // Formato genérico para outros países
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6)
        return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
      if (numbers.length <= 9)
        return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
          6
        )}`;
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
        6,
        9
      )} ${numbers.slice(9, 12)}`;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      const formatted = formatWhatsApp(value, selectedCountry.code);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCountryChange = (country: typeof selectedCountry) => {
    setSelectedCountry(country);
    // Limpar o campo WhatsApp quando mudar o país
    setFormData((prev) => ({
      ...prev,
      whatsapp: "",
    }));
  };

  const handleTrialInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      const formatted = formatWhatsApp(value, trialSelectedCountry.code);
      setTrialFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setTrialFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTrialCountryChange = (country: typeof trialSelectedCountry) => {
    setTrialSelectedCountry(country);
    // Limpar o campo WhatsApp quando mudar o país
    setTrialFormData((prev) => ({
      ...prev,
      whatsapp: "",
    }));
  };

  const formatCardNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");
    // Adiciona espaços a cada 4 dígitos
    return numbers.replace(/(\d{4})(?=\d)/g, "$1 ").substr(0, 19);
  };

  const formatCardExpiry = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");
    // Formato MM/YY
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + "/" + numbers.slice(2, 4);
    }
    return numbers;
  };

  const formatCPFCNPJ = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      // Formato CPF: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // Formato CNPJ: 00.000.000/0000-00
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  };

  const formatCEP = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");
    // Formato 00000-000
    return numbers.replace(/(\d{5})(\d)/, "$1-$2").substr(0, 9);
  };

  const isCNPJ = (cpfCnpj: string) => {
    // Remove caracteres não numéricos
    const numbers = cpfCnpj.replace(/\D/g, "");
    // CNPJ tem 14 dígitos, CPF tem 11
    return numbers.length > 11;
  };

  const buscarCEP = async (cep: string) => {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, "");

    // Verifica se o CEP tem 8 dígitos
    if (cleanCEP.length !== 8) {
      return;
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCEP}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        // Preenche automaticamente os campos de endereço
        setSubscriptionFormData((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          uf: data.uf || "",
        }));
      } else {
        // CEP não encontrado
        console.log("CEP não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleSubscriptionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "cardExpiry") {
      formattedValue = formatCardExpiry(value);
    } else if (name === "cpfCnpj") {
      formattedValue = formatCPFCNPJ(value);
      // Se mudou de CNPJ para CPF, limpar razão social
      if (!isCNPJ(formattedValue)) {
        setSubscriptionFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
          razaoSocial: "",
        }));
        return;
      }
    } else if (name === "cep") {
      formattedValue = formatCEP(value);
      // Buscar endereço automaticamente quando CEP estiver completo
      const cleanCEP = formattedValue.replace(/\D/g, "");
      if (cleanCEP.length === 8) {
        buscarCEP(formattedValue);
      }
    } else if (name === "cardCvv") {
      formattedValue = value.replace(/\D/g, "").substr(0, 4);
    }

    setSubscriptionFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubscriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica (complemento é opcional)
    let requiredFields = [
      "nomeCompleto",
      "email",
      "cpfCnpj",
      "telefone",
      "endereco",
      "numero",
      "bairro",
      "cidade",
      "uf",
      "cep",
      "cardNumber",
      "cardName",
      "cardExpiry",
      "cardCvv",
    ];

    // Se for CNPJ, incluir razão social como campo obrigatório
    if (isCNPJ(subscriptionFormData.cpfCnpj)) {
      requiredFields.push("razaoSocial");
    }

    for (const field of requiredFields) {
      if (!subscriptionFormData[field as keyof typeof subscriptionFormData]) {
        const fieldNames: { [key: string]: string } = {
          nomeCompleto: "Nome Completo",
          email: "Email",
          cpfCnpj: "CPF/CNPJ",
          razaoSocial: "Razão Social",
          telefone: "Telefone",
          endereco: "Endereço",
          numero: "Número",
          complemento: "Complemento",
          bairro: "Bairro",
          cidade: "Cidade",
          uf: "UF",
          cep: "CEP",
          cardNumber: "Número do Cartão",
          cardName: "Nome no Cartão",
          cardExpiry: "Validade do Cartão",
          cardCvv: "CVV",
        };
        alert(`Por favor, preencha o campo ${fieldNames[field] || field}!`);
        return;
      }
    }

    if (!isValidEmail(subscriptionFormData.email)) {
      alert("Por favor, informe um email válido!");
      return;
    }

    // Simulação de processamento - aqui você integraria com o Mercado Pago
    console.log(
      "Dados da assinatura:",
      subscriptionFormData,
      "Plano selecionado:",
      selectedPlan
    );
    setShowSubscriptionSuccess(true);
  };

  const clearForm = () => {
    setFormData({
      nomeCompleto: "",
      email: "",
      whatsapp: "",
      assunto: "",
      mensagem: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (
      !formData.nomeCompleto ||
      !formData.email ||
      !formData.whatsapp ||
      !formData.assunto ||
      !formData.mensagem
    ) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    // Criar link mailto
    const subject = encodeURIComponent(formData.assunto);
    const body = encodeURIComponent(`
Nome: ${formData.nomeCompleto}
Email: ${formData.email}
WhatsApp: ${selectedCountry.prefix} ${formData.whatsapp}
País: ${selectedCountry.name}
Assunto: ${formData.assunto}

Mensagem:
${formData.mensagem}
    `);

    const mailtoLink = `mailto:adm.clinic4us@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");

    // Limpar formulário e mostrar tela de agradecimento
    clearForm();
    setShowThankYou(true);
  };

  return (
    <Box className="landing-page" sx={{ minHeight: "100vh" }}>
      {/* Header */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ background: "#fff", mb: 2, boxShadow: 0, borderRadius: 2 }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 6 }, minHeight: 80, height: 110 }}>
          {/* Logo à esquerda */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="CLINIC4US"
              style={{ cursor: "pointer", width: 237, height: 98 }}
              onClick={scrollToTop}
            />
          </Box>
          {/* Menu centralizado */}
          <Box
            sx={{
              flex: 2,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Button
              href="#funcionalidades"
              sx={{
                color: "#222",
                fontWeight: 500,
                fontSize: 16,
                textTransform: "none",
              }}
            >
              Funcionalidades
            </Button>
            <Button
              href="#planos"
              sx={{
                color: "#222",
                fontWeight: 500,
                fontSize: 16,
                textTransform: "none",
              }}
            >
              Planos
            </Button>
            <Button
              href="#comparacao"
              sx={{
                color: "#222",
                fontWeight: 500,
                fontSize: 16,
                textTransform: "none",
              }}
            >
              Comparação
            </Button>
            <Button
              href="#contato"
              onClick={openContactModal}
              sx={{
                color: "#222",
                fontWeight: 500,
                fontSize: 16,
                textTransform: "none",
              }}
            >
              Contato
            </Button>
          </Box>
          {/* CTA à direita */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={openTrialModal}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                fontSize: 16,
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Teste Grátis
            </Button>
            {/* Hamburger Menu Button */}
            <Button
              onClick={toggleMobileMenu}
              sx={{ display: { md: "none" }, minWidth: 0, p: 1 }}
            >
              <span style={{ fontSize: 24 }}>☰</span>
            </Button>
          </Box>
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(0,0,0,0.5)",
                zIndex: 1300,
              }}
              onClick={closeMobileMenu}
            >
              <Box
                sx={{
                  bgcolor: "background.paper",
                  width: 250,
                  height: "100vh",
                  p: 2,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <img src={logo} alt="CLINIC4US" style={{ height: 40 }} />
                </Box>
                <Button
                  fullWidth
                  href="#funcionalidades"
                  onClick={closeMobileMenu}
                >
                  Funcionalidades
                </Button>
                <Button fullWidth href="#planos" onClick={closeMobileMenu}>
                  Planos
                </Button>
                <Button fullWidth href="#comparacao" onClick={closeMobileMenu}>
                  Comparação
                </Button>
                <Button
                  fullWidth
                  href="#contato"
                  onClick={(e) => {
                    openContactModal(e);
                    closeMobileMenu();
                  }}
                >
                  Contato
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    openTrialModal(e);
                    closeMobileMenu();
                  }}
                >
                  Teste Grátis
                </Button>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 6 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid>
              <Typography variant="h2" gutterBottom>
                Transforme sua Clínica com o Sistema de Gestão Mais Completo
              </Typography>
              <Typography variant="body1" gutterBottom>
                Gerencie agendamentos, prontuários, planos de ação e finanças em
                uma única plataforma. Ideal para clínicas multidisciplinares que
                buscam eficiência e crescimento.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openTrialModal}
                >
                  Teste Grátis
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={(e) =>
                    openContactModal(e, "Demonstração do produto")
                  }
                >
                  Agendar Demo
                </Button>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{ bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 2 }}
              >
                {/* ...dashboard mockup... */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Dashboard
                </Typography>
                <Grid container spacing={2}>
                  <Grid>
                    <Box sx={{ bgcolor: "#e3f2fd", borderRadius: 1, p: 2 }}>
                      <Typography variant="subtitle2">
                        Consultas Hoje
                      </Typography>
                      <Typography variant="h5">24</Typography>
                    </Box>
                  </Grid>
                  <Grid>
                    <Box sx={{ bgcolor: "#e3f2fd", borderRadius: 1, p: 2 }}>
                      <Typography variant="subtitle2">
                        Faturamento Mês
                      </Typography>
                      <Typography variant="h5">R$ 45.2k</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="funcionalidades" sx={{ bgcolor: "#fff", py: 6 }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Funcionalidades Completas para sua Clínica
            </Typography>
            <Typography variant="body1">
              Todas as ferramentas que você precisa em uma única plataforma
            </Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">📅</Typography>
                <Typography variant="h5" gutterBottom>
                  Agenda Inteligente
                </Typography>
                <Typography variant="body2">
                  Agendamento online, lembretes automáticos e gestão de horários
                  para múltiplos profissionais.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">📋</Typography>
                <Typography variant="h5" gutterBottom>
                  Prontuários Eletrônicos
                </Typography>
                <Typography variant="body2">
                  Prontuários digitais seguros, com histórico completo e
                  assinatura eletrônica.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">🎯</Typography>
                <Typography variant="h5" gutterBottom>
                  Planos de Ação
                </Typography>
                <Typography variant="body2">
                  Crie e acompanhe planos de tratamento personalizados para cada
                  paciente.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">📊</Typography>
                <Typography variant="h5" gutterBottom>
                  Evoluções e Notas
                </Typography>
                <Typography variant="body2">
                  Registro detalhado de evoluções, com templates customizáveis
                  por especialidade.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">📝</Typography>
                <Typography variant="h5" gutterBottom>
                  Formulários de Avaliação
                </Typography>
                <Typography variant="body2">
                  Formulários dinâmicos e customizáveis para diferentes tipos de
                  avaliação.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">📈</Typography>
                <Typography variant="h5" gutterBottom>
                  Relatórios Gerenciais
                </Typography>
                <Typography variant="body2">
                  Dashboards e relatórios completos para análise de desempenho e
                  faturamento.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">💰</Typography>
                <Typography variant="h5" gutterBottom>
                  Gestão Financeira
                </Typography>
                <Typography variant="body2">
                  Controle financeiro completo, faturamento, repasses e
                  integração com sistemas contábeis.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">👥</Typography>
                <Typography variant="h5" gutterBottom>
                  Controle de Usuários
                </Typography>
                <Typography variant="body2">
                  Gestão de profissionais, permissões e controle de acesso por
                  função.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h2">🔒</Typography>
                <Typography variant="h5" gutterBottom>
                  Base de Dados Exclusiva
                </Typography>
                <Typography variant="body2">
                  Cada cliente possui sua própria base de dados isolada,
                  garantindo máxima segurança, privacidade e conformidade com a
                  LGPD.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Workflow Section */}
      <Box sx={{ bgcolor: "#f9fafb", py: 6 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid>
              <Typography variant="h3" gutterBottom>
                Simplifique o Fluxo de Trabalho da sua Clínica
              </Typography>
              <Typography variant="body1" gutterBottom>
                Veja como o CLINIC4US otimiza cada etapa do atendimento, desde o
                agendamento até o faturamento.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#e3f2fd",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4">1</Typography>
                    <Typography variant="subtitle1">
                      Agendamento Online
                    </Typography>
                    <Typography variant="body2">
                      Pacientes agendam diretamente pela plataforma
                    </Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#e3f2fd",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4">2</Typography>
                    <Typography variant="subtitle1">
                      Atendimento Digital
                    </Typography>
                    <Typography variant="body2">
                      Prontuários e evoluções em tempo real
                    </Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#e3f2fd",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4">3</Typography>
                    <Typography variant="subtitle1">
                      Gestão Automática
                    </Typography>
                    <Typography variant="body2">
                      Relatórios e faturamento automatizados
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid>
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  boxShadow: 1,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  📱 Imagem: Interface do sistema mostrando o fluxo de trabalho
                </Typography>
                <Typography variant="body2">
                  Recomendação: Screenshot do dashboard principal com destaque
                  para as principais funcionalidades
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="planos" sx={{ bgcolor: "#fff", py: 6 }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Planos que se Adaptam ao seu Negócio
            </Typography>
            <Typography variant="body1">
              Escolha o plano ideal para o tamanho da sua clínica
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Typography variant="body2">Mensal</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" />
              <Box
                sx={{
                  width: 32,
                  height: 20,
                  bgcolor: "#e0e0e0",
                  borderRadius: 10,
                  ml: 1,
                }}
              ></Box>
            </Box>
            <Typography variant="body2">
              Anual{" "}
              <Box
                component="span"
                sx={{
                  bgcolor: "#03B4C6",
                  color: "#fff",
                  px: 1,
                  borderRadius: 1,
                  fontSize: 12,
                  ml: 1,
                }}
              >
                -20%
              </Box>
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Clínica Starter
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Para clínicas pequenas com até 2 profissionais
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">R$</Typography>
                  <Typography variant="h3">197</Typography>
                  <Typography variant="body2">/mês</Typography>
                </Box>
                <Box component="ul" sx={{ listStyle: "none", p: 0, mb: 2 }}>
                  <li>✅ Até 2 profissionais</li>
                  <li>✅ Agenda básica</li>
                  <li>✅ Prontuários eletrônicos</li>
                  <li>✅ 500 pacientes</li>
                  <li>✅ Relatórios básicos</li>
                  <li>✅ Suporte por email</li>
                  <li>❌ Planos de ação</li>
                  <li>❌ Formulários customizados</li>
                  <li>❌ API integração</li>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    openSubscriptionModal("Clínica Starter", "197", "/mês", [
                      "Até 2 profissionais",
                      "Agenda básica",
                      "Prontuários eletrônicos",
                      "500 pacientes",
                      "Relatórios básicos",
                      "Suporte por email",
                    ])
                  }
                >
                  Assinar
                </Button>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                  border: "2px solid #03B4C6",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#03B4C6",
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    mb: 1,
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  Mais Popular
                </Box>
                <Typography variant="h5" gutterBottom>
                  Clínica Pro
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Para clínicas médias com até 8 profissionais
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">R$</Typography>
                  <Typography variant="h3">397</Typography>
                  <Typography variant="body2">/mês</Typography>
                </Box>
                <Box component="ul" sx={{ listStyle: "none", p: 0, mb: 2 }}>
                  <li>✅ Até 8 profissionais</li>
                  <li>✅ Agenda avançada com lembretes</li>
                  <li>✅ Prontuários + assinatura digital</li>
                  <li>✅ 2.000 pacientes</li>
                  <li>✅ Planos de ação</li>
                  <li>✅ Formulários customizados</li>
                  <li>✅ Relatórios avançados</li>
                  <li>✅ Gestão financeira</li>
                  <li>✅ Suporte telefônico</li>
                  <li>❌ API integração</li>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    openSubscriptionModal("Clínica Pro", "397", "/mês", [
                      "Até 8 profissionais",
                      "Agenda avançada com lembretes",
                      "Prontuários + assinatura digital",
                      "2.000 pacientes",
                      "Planos de ação",
                      "Formulários customizados",
                      "Relatórios avançados",
                      "Gestão financeira",
                      "Suporte telefônico",
                    ])
                  }
                >
                  Assinar
                </Button>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Clínica Enterprise
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Para clínicas grandes e redes de clínicas
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">R$</Typography>
                  <Typography variant="h3">797</Typography>
                  <Typography variant="body2">/mês</Typography>
                </Box>
                <Box component="ul" sx={{ listStyle: "none", p: 0, mb: 2 }}>
                  <li>✅ Profissionais ilimitados</li>
                  <li>✅ Todas as funcionalidades Pro</li>
                  <li>✅ Pacientes ilimitados</li>
                  <li>✅ API completa</li>
                  <li>✅ Integrações terceiros</li>
                  <li>✅ Dashboard executivo</li>
                  <li>✅ Backup automático</li>
                  <li>✅ Suporte prioritário 24/7</li>
                  <li>✅ Gerente de conta dedicado</li>
                  <li>✅ Treinamento personalizado</li>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    window.open(
                      "https://wa.me/5511972918369?text=Olá! Gostaria de saber mais sobre o plano Enterprise do CLINIC4US.",
                      "_blank"
                    )
                  }
                >
                  Falar com Vendas
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Comparison Table */}
      <Box id="comparacao" sx={{ bgcolor: "#f9fafb", py: 6 }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Compare Todos os Planos
            </Typography>
            <Typography variant="body1">
              Veja em detalhes o que cada plano oferece
            </Typography>
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Funcionalidades
                  </TableCell>
                  <TableCell>Starter</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#e3f2fd" }}>
                    Pro
                  </TableCell>
                  <TableCell>Enterprise</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Número de profissionais</TableCell>
                  <TableCell>Até 2</TableCell>
                  <TableCell>Até 8</TableCell>
                  <TableCell>Ilimitado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pacientes cadastrados</TableCell>
                  <TableCell>500</TableCell>
                  <TableCell>2.000</TableCell>
                  <TableCell>Ilimitado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Agenda online</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Prontuários eletrônicos</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lembretes automáticos</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Planos de ação</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Formulários customizados</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Relatórios avançados</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gestão financeira</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>API de integração</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Backup automático</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>Semanal</TableCell>
                  <TableCell>Diário</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Suporte</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Email + Telefone</TableCell>
                  <TableCell>24/7 Prioritário</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: "#fff", py: 6 }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              O que Nossos Clientes Dizem
            </Typography>
            <Typography variant="body1">
              Depoimentos reais de profissionais que transformaram suas clínicas
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Box
                    component="img"
                    src={fernandaNinho}
                    alt="Fernanda Bragança"
                    sx={{ width: 64, height: 64, borderRadius: "50%" }}
                  />
                </Box>
                <Typography variant="h6">Fernanda Bragança</Typography>
                <Typography variant="body2">
                  Consultora de Atendimento
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Instituto Ninho
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#FFD700", fontSize: 20 }}
                >
                  ⭐⭐⭐⭐⭐
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  "A organização da agenda de diversos profissionais é bem
                  tranquila, fornece uma visão gerencial dos compromissos
                  diminuindo erros e otimizando os atendimentos."
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Box
                    component="img"
                    src={ingridResolve}
                    alt="Ingrid Barbosa"
                    sx={{ width: 64, height: 64, borderRadius: "50%" }}
                  />
                </Box>
                <Typography variant="h6">Ingrid Barbosa</Typography>
                <Typography variant="body2">Assessoria Remota</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Resolve
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#FFD700", fontSize: 20 }}
                >
                  ⭐⭐⭐⭐⭐
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  "A gestão financeira nunca foi tão simples. Os relatórios me
                  ajudam a tomar decisões estratégicas juntamente com nossos
                  clientes."
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Box
                    component="img"
                    src={hellenStudio}
                    alt="Hellen Kleine"
                    sx={{ width: 64, height: 64, borderRadius: "50%" }}
                  />
                </Box>
                <Typography variant="h6">Hellen Kleine</Typography>
                <Typography variant="body2">
                  Fisioterapeuta e Psicomotricista
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Studio Kids Motriz
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#FFD700", fontSize: 20 }}
                >
                  ⭐⭐⭐⭐⭐
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  "Prontuários eletrônicos seguros e planos de ação
                  personalizados. O acompanhamento e a gestão estão muito
                  melhores agora."
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Material UI */}
      <Box sx={{ bgcolor: "#03B4C6", py: 6 }}>
        <Container>
          <Box
            sx={{
              textAlign: "center",
              color: "#fff",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <Typography variant="h3" gutterBottom>
              Pronto para Revolucionar sua Clínica?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Junte-se a centenas de clínicas que já confiam no CLINIC4US
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ minWidth: 200, fontWeight: "bold" }}
                onClick={openTrialModal}
              >
                Teste Grátis de 7 Dias
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                sx={{
                  minWidth: 200,
                  fontWeight: "bold",
                  borderColor: "#fff",
                  color: "#fff",
                }}
                onClick={(e) => openContactModal(e, "Demonstração do produto")}
              >
                Agendar Demonstração
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
              ✅ Sem compromisso • ✅ Sem cartão de crédito • ✅ Suporte
              completo
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* About/Team Section - Material UI */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 6 }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid>
              <Box>
                <Typography variant="h3" gutterBottom>
                  Criado por Especialistas em Saúde e Tecnologia
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Nossa equipe combina anos de experiência em gestão de clínicas
                  com expertise em tecnologia avançada para criar a solução
                  ideal para profissionais de saúde.
                </Typography>
                <Grid container spacing={2}>
                  <Grid>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="h2">🏥</Typography>
                      <Box>
                        <Typography variant="h6">
                          Experiência Clínica
                        </Typography>
                        <Typography variant="body2">
                          Mais de 15 anos gerenciando clínicas
                          multidisciplinares
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="h2">💻</Typography>
                      <Box>
                        <Typography variant="h6">
                          Tecnologia Avançada
                        </Typography>
                        <Typography variant="body2">
                          Sistema desenvolvido com as melhores práticas de
                          segurança
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="h2">🤝</Typography>
                      <Box>
                        <Typography variant="h6">
                          Suporte Especializado
                        </Typography>
                        <Typography variant="body2">
                          Equipe dedicada que entende suas necessidades
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid>
              <Grid container spacing={3} justifyContent="center">
                <Grid>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={hiltonCeo}
                      alt="Hilton CEO"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        mb: 1,
                        objectFit: "cover",
                      }}
                    />
                    <Typography variant="h6">Hilton Cassahara</Typography>
                    <Typography variant="body2">CEO & Fundador</Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={fabio}
                      alt="Fábio Martins CTO"
                      sx={{ width: 80, height: 80, borderRadius: "50%", mb: 1 }}
                    />
                    <Typography variant="h6">Fábio Martins</Typography>
                    <Typography variant="body2">CTO</Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={atalitaFono}
                      alt="Atalita Fonoaudióloga"
                      sx={{ width: 80, height: 80, borderRadius: "50%", mb: 1 }}
                    />
                    <Typography variant="h6">Atalita Azevedo</Typography>
                    <Typography variant="body2">
                      Consultora Fonoaudióloga
                    </Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={laizaResolve}
                      alt="Laiza Especialista"
                      sx={{ width: 80, height: 80, borderRadius: "50%", mb: 1 }}
                    />
                    <Typography variant="h6">Laiza Barros</Typography>
                    <Typography variant="body2">
                      Especialista em Atendimento
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer - Material UI */}
      <Box
        component="footer"
        sx={{ bgcolor: "#222", color: "#fff", pt: 6, pb: 2 }}
      >
        <Container>
          <Grid container spacing={4} justifyContent="center">
            <Grid>
              <Box sx={{ mb: 2 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="CLINIC4US"
                  sx={{ width: 120, cursor: "pointer", mb: 2 }}
                  onClick={scrollToTop}
                />
                <Typography variant="body2">
                  A plataforma completa para gestão de clínicas
                  multidisciplinares.
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Produto
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <li>
                  <a
                    href="#funcionalidades"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a
                    href="#planos"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Planos
                  </a>
                </li>
                <li>
                  <a
                    href="#comparacao"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Comparação
                  </a>
                </li>
              </Box>
            </Grid>
            <Grid>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Suporte
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <li>
                  <a
                    href="#help"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    href="#docs"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Documentação
                  </a>
                </li>
              </Box>
            </Grid>
            <Grid>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Empresa
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <li>
                  <a
                    href="#about"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Termos de Uso
                  </a>
                </li>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: "1px solid #444",
              mt: 4,
              pt: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              &copy; 2024 CLINIC4US. Todos os direitos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Modal de Contato - Material UI */}
      <Dialog
        open={isContactModalOpen}
        onClose={closeContactModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src={logo}
              alt="CLINIC4US"
              sx={{ height: 40 }}
            />
            <Typography variant="h6">Fale Conosco</Typography>
          </Box>
          <IconButton onClick={closeContactModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!showThankYou ? (
            <Grid container spacing={4}>
              <Grid>
                <Box sx={{ mb: 2 }}>
                  <Box
                    component="img"
                    src={formContactImage}
                    alt="Profissional de saúde"
                    sx={{ width: "100%", borderRadius: 2, mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Demonstração personalizada
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Consultoria gratuita
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="WhatsApp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    placeholder={
                      selectedCountry.code === "BR"
                        ? "(11) 99999-9999"
                        : selectedCountry.code === "US"
                        ? "(123) 456-7890"
                        : "123 456 789"
                    }
                  />
                  <TextField
                    fullWidth
                    select
                    label="Assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    SelectProps={{
                      native: true,
                      inputProps: { "aria-label": "Assunto" },
                    }}
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="Informações sobre o sistema">
                      Informações sobre o sistema
                    </option>
                    <option value="Demonstração do produto">
                      Demonstração do produto
                    </option>
                    <option value="Planos e preços">Planos e preços</option>
                    <option value="Suporte técnico">Suporte técnico</option>
                    <option value="Parceria comercial">
                      Parceria comercial
                    </option>
                    <option value="Outros">Outros</option>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    margin="normal"
                    multiline
                    rows={4}
                    required
                  />
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={clearForm}
                    >
                      Limpar Campos
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      Enviar Mensagem
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="CLINIC4US"
                  sx={{ height: 40 }}
                />
              </Box>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Obrigado pelo contato!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Nossos consultores retornarão em breve.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={closeContactModal}
              >
                Fechar
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Teste Grátis - Material UI */}
      <Dialog
        open={isTrialModalOpen}
        onClose={closeTrialModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src={logo}
              alt="CLINIC4US"
              sx={{ height: 40 }}
            />
            <Typography variant="h6">Teste Grátis</Typography>
          </Box>
          <IconButton onClick={closeTrialModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!showTrialSuccess ? (
            <Grid container spacing={4}>
              <Grid>
                <Box sx={{ mb: 2 }}>
                  <Box
                    component="img"
                    src={freeEvaluationImage}
                    alt="Teste Grátis CLINIC4US"
                    sx={{ width: "100%", borderRadius: 2, mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    7 dias de teste completo
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Sem compromisso
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <Box
                  component="form"
                  onSubmit={handleTrialSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    name="nomeCompleto"
                    value={trialFormData.nomeCompleto}
                    onChange={handleTrialInputChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={trialFormData.email}
                    onChange={handleTrialInputChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="WhatsApp"
                    name="whatsapp"
                    value={trialFormData.whatsapp}
                    onChange={handleTrialInputChange}
                    margin="normal"
                    required
                    placeholder={
                      trialSelectedCountry.code === "BR"
                        ? "(11) 99999-9999"
                        : trialSelectedCountry.code === "US"
                        ? "(123) 456-7890"
                        : "123 456 789"
                    }
                  />
                  <TextField
                    fullWidth
                    select
                    label="Quantidade de profissionais"
                    name="qtdProfissionais"
                    value={trialFormData.qtdProfissionais}
                    onChange={handleTrialInputChange}
                    margin="normal"
                    required
                    SelectProps={{
                      native: true,
                      inputProps: {
                        "aria-label": "Quantidade de profissionais",
                      },
                    }}
                  >
                    <option value="">Selecione a quantidade</option>
                    <option value="1">1 profissional</option>
                    <option value="2-5">2 a 5 profissionais</option>
                    <option value="6-10">6 a 10 profissionais</option>
                    <option value="11-20">11 a 20 profissionais</option>
                    <option value="21-50">21 a 50 profissionais</option>
                    <option value="50+">Mais de 50 profissionais</option>
                  </TextField>
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button variant="contained" color="primary" type="submit">
                      Teste Grátis
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                    borderLeft: "4px solid #03B4C6",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Avaliação gratuita
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Ao se inscrever para a avaliação gratuita da plataforma
                    CLINIC4US, você receberá um e-mail de validação. Verifique
                    sua caixa de entrada (e também a pasta de spam ou promoções,
                    se necessário), siga as instruções e aproveite o período de
                    testes de 7 dias. Após este período a conta será inativada
                    automaticamente.
                  </Typography>
                  <Typography variant="body2">
                    Em caso de dúvidas, entre em contato com nossa equipe de
                    suporte.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="CLINIC4US"
                  sx={{ height: 40 }}
                />
              </Box>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Cadastro Realizado!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Verifique seu email para ativar sua conta de teste.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={closeTrialModal}
              >
                Fechar
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Assinatura - Material UI */}
      <Dialog
        open={isSubscriptionModalOpen && !!selectedPlan}
        onClose={closeSubscriptionModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src={logo}
              alt="CLINIC4US"
              sx={{ height: 40 }}
            />
            <Typography variant="h6">
              Assinatura - {selectedPlan?.name}
            </Typography>
          </Box>
          <IconButton onClick={closeSubscriptionModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!showSubscriptionSuccess ? (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography variant="h4" color="primary">
                  R$ {selectedPlan?.price}
                </Typography>
                <Typography variant="h6">{selectedPlan?.period}</Typography>
              </Box>
              <Box
                component="form"
                onSubmit={handleSubscriptionSubmit}
                sx={{ mt: 1 }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Dados Pessoais
                </Typography>
                <Grid container spacing={2}>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      name="nomeCompleto"
                      value={subscriptionFormData.nomeCompleto}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={subscriptionFormData.email}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="CPF/CNPJ"
                      name="cpfCnpj"
                      value={subscriptionFormData.cpfCnpj}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Telefone"
                      name="telefone"
                      value={subscriptionFormData.telefone}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="(11) 99999-9999"
                    />
                  </Grid>
                  {isCNPJ(subscriptionFormData.cpfCnpj) && (
                    <Grid>
                      <TextField
                        fullWidth
                        label="Razão Social"
                        name="razaoSocial"
                        value={subscriptionFormData.razaoSocial}
                        onChange={handleSubscriptionInputChange}
                        margin="normal"
                        required
                        placeholder="Nome da empresa conforme CNPJ"
                      />
                    </Grid>
                  )}
                  <Grid>
                    <TextField
                      fullWidth
                      label="CEP"
                      name="cep"
                      value={subscriptionFormData.cep}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="00000-000"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Endereço"
                      name="endereco"
                      value={subscriptionFormData.endereco}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="Nome da rua/avenida"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Número"
                      name="numero"
                      value={subscriptionFormData.numero}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="123"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Complemento"
                      name="complemento"
                      value={subscriptionFormData.complemento}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      placeholder="Apto, sala, bloco (opcional)"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Bairro"
                      name="bairro"
                      value={subscriptionFormData.bairro}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="Nome do bairro"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Cidade"
                      name="cidade"
                      value={subscriptionFormData.cidade}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="Nome da cidade"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="UF"
                      name="uf"
                      value={subscriptionFormData.uf}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      inputProps={{
                        maxLength: 2,
                        style: { textTransform: "uppercase" },
                      }}
                      placeholder="SP"
                    />
                  </Grid>
                </Grid>
                <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
                  Dados do Cartão de Crédito
                </Typography>
                <Grid container spacing={2}>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Número do Cartão"
                      name="cardNumber"
                      value={subscriptionFormData.cardNumber}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="0000 0000 0000 0000"
                      inputProps={{ maxLength: 19 }}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Nome no Cartão"
                      name="cardName"
                      value={subscriptionFormData.cardName}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="Nome como impresso no cartão"
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="Validade"
                      name="cardExpiry"
                      value={subscriptionFormData.cardExpiry}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="MM/YY"
                      inputProps={{ maxLength: 5 }}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      fullWidth
                      label="CVV"
                      name="cardCvv"
                      value={subscriptionFormData.cardCvv}
                      onChange={handleSubscriptionInputChange}
                      margin="normal"
                      required
                      placeholder="000"
                      inputProps={{ maxLength: 4 }}
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    mt: 4,
                    mb: 2,
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                    borderLeft: "4px solid #03B4C6",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Resumo
                  </Typography>
                  <Typography variant="body2">
                    Plano {selectedPlan?.name}: R$ {selectedPlan?.price}
                    {selectedPlan?.period}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Total: R$ {selectedPlan?.price}
                    {selectedPlan?.period}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Confirmar Assinatura
                  </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    🔒 Pagamento 100% seguro. Seus dados estão protegidos.
                  </Typography>
                  <Typography variant="body2">
                    💳 Aceitamos todos os cartões de crédito principais.
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="CLINIC4US"
                  sx={{ height: 40 }}
                />
              </Box>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Assinatura Confirmada!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Bem-vindo ao {selectedPlan?.name}!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Você receberá as instruções de acesso por email em breve.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={closeSubscriptionModal}
              >
                Começar a Usar
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Botão flutuante do WhatsApp */}
      <a
        href="https://wa.me/5511972918369"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Falar no WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.51 3.488" />
        </svg>
      </a>
    </Box>
  );
};

export default LandingPage;
