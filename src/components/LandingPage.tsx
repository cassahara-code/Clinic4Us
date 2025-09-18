import React, { useState, useEffect } from "react";
import "./LandingPage.css";
import logo from "../images/logo_clinic4us.png";
import hiltonCeo from "../images/hilton_ceo.png";
import atalitaFono from "../images/atalita_fono.png";
import laizaResolve from "../images/laiza_resolve.png";
import freeEvaluationImage from "../images/free_evaluation.jpg";
import ingridResolve from "../images/ingrid_resolve.png";
import hellenStudio from "../images/hellen_studio.png";
import fernandaNinho from "../images/fernanda_ninho.png";
import Footer from "./Footer";
import ContactForm from "./ContactForm";
const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactPreSelectedSubject, setContactPreSelectedSubject] = useState<string>();
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [showTrialSuccess, setShowTrialSuccess] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);

  useEffect(() => {
    document.title = "Clinic4Us - Sistema de Gestão para Clínicas";
  }, []);

  // Countries array for trial and subscription modals
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNavigateToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    // Usaremos uma solução simples com query parameter
    window.location.href = window.location.origin + '?page=login';
  };


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
    setContactPreSelectedSubject(preSelectedSubject);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactPreSelectedSubject(undefined);
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


  const handleTrialInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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


  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="nav-brand">
            <img
              src={logo}
              alt="CLINIC4US"
              className="logo"
              onClick={scrollToTop}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Desktop Menu */}
          <ul className="nav-menu desktop-menu">
            <li>
              <a href="#funcionalidades">Funcionalidades</a>
            </li>
            <li>
              <a href="#planos">Planos</a>
            </li>
            <li>
              <a href="#comparacao">Comparação</a>
            </li>
            <li>
              <a href="#contato" onClick={openContactModal}>
                Contato
              </a>
            </li>
            <li>
              <a href="#login" onClick={handleNavigateToLogin} className="client-area-link">
                Área do Cliente
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <button className="cta-button desktop-cta" onClick={openTrialModal}>
              Teste Grátis
            </button>

            {/* Hamburger Menu Button */}
            <button
              className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
              <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                </div>
                <ul className="mobile-nav-menu">
                  <li>
                    <a href="#funcionalidades" onClick={closeMobileMenu}>
                      Funcionalidades
                    </a>
                  </li>
                  <li>
                    <a href="#planos" onClick={closeMobileMenu}>
                      Planos
                    </a>
                  </li>
                  <li>
                    <a href="#comparacao" onClick={closeMobileMenu}>
                      Comparação
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contato"
                      onClick={(e) => {
                        openContactModal(e);
                        closeMobileMenu();
                      }}
                    >
                      Contato
                    </a>
                  </li>
                  <li>
                    <a
                      href="#login"
                      className="client-area-link"
                      onClick={(e) => {
                        handleNavigateToLogin(e);
                        closeMobileMenu();
                      }}
                    >
                      Área do Cliente
                    </a>
                  </li>
                </ul>
                <button
                  className="cta-button mobile-cta"
                  onClick={(e) => {
                    openTrialModal(e);
                    closeMobileMenu();
                  }}
                >
                  Teste Grátis
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Transforme sua Clínica com o Sistema de Gestão Mais Completo
            </h1>
            <p>
              Gerencie agendamentos, prontuários, planos de ação e finanças em
              uma única plataforma. Ideal para clínicas multidisciplinares que
              buscam eficiência e crescimento.
            </p>
            <div className="hero-buttons">
              <button className="cta-primary" onClick={openTrialModal}>
                Teste Grátis
              </button>
              <button
                className="cta-secondary"
                onClick={(e) => openContactModal(e, "Demonstração do produto")}
              >
                Agendar Demo
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="mockup-sidebar">
                  <div className="sidebar-item active">Dashboard</div>
                  <div className="sidebar-item">Agenda</div>
                  <div className="sidebar-item">Pacientes</div>
                  <div className="sidebar-item">Prontuários</div>
                  <div className="sidebar-item">Relatórios</div>
                </div>
                <div className="mockup-main">
                  <div className="card-row">
                    <div className="info-card">
                      <span className="card-title">Consultas Hoje</span>
                      <span className="card-value">24</span>
                    </div>
                    <div className="info-card">
                      <span className="card-title">Faturamento Mês</span>
                      <span className="card-value">R$ 45.2k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Funcionalidades Completas para sua Clínica</h2>
            <p>Todas as ferramentas que você precisa em uma única plataforma</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Agenda Inteligente</h3>
              <p>
                Agendamento online, lembretes automáticos e gestão de horários
                para múltiplos profissionais.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Prontuários Eletrônicos</h3>
              <p>
                Prontuários digitais seguros, com histórico completo e
                assinatura eletrônica.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Planos de Ação</h3>
              <p>
                Crie e acompanhe planos de tratamento personalizados para cada
                paciente.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Evoluções e Notas</h3>
              <p>
                Registro detalhado de evoluções, com templates customizáveis por
                especialidade.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Formulários de Avaliação</h3>
              <p>
                Formulários dinâmicos e customizáveis para diferentes tipos de
                avaliação.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Relatórios Gerenciais</h3>
              <p>
                Dashboards e relatórios completos para análise de desempenho e
                faturamento.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Gestão Financeira</h3>
              <p>
                Controle financeiro completo, faturamento, repasses e integração
                com sistemas contábeis.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Controle de Usuários</h3>
              <p>
                Gestão de profissionais, permissões e controle de acesso por
                função.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Base de Dados Exclusiva</h3>
              <p>
                Cada cliente possui sua própria base de dados isolada,
                garantindo máxima segurança, privacidade e conformidade com a
                LGPD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <div className="container">
          <div className="workflow-content">
            <div className="workflow-text">
              <h2>Simplifique o Fluxo de Trabalho da sua Clínica</h2>
              <p>
                Veja como o CLINIC4US otimiza cada etapa do atendimento, desde o
                agendamento até o faturamento.
              </p>
              <div className="workflow-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-info">
                    <h4>Agendamento Online</h4>
                    <p>Pacientes agendam diretamente pela plataforma</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-info">
                    <h4>Atendimento Digital</h4>
                    <p>Prontuários e evoluções em tempo real</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-info">
                    <h4>Gestão Automática</h4>
                    <p>Relatórios e faturamento automatizados</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="workflow-image">
              <div className="image-placeholder workflow-placeholder">
                <p>
                  📱 Imagem: Interface do sistema mostrando o fluxo de trabalho
                  - desde agendamento até relatórios
                </p>
                <small>
                  Recomendação: Screenshot do dashboard principal com destaque
                  para as principais funcionalidades
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Planos que se Adaptam ao seu Negócio</h2>
            <p>Escolha o plano ideal para o tamanho da sua clínica</p>
          </div>

          <div className="pricing-toggle">
            <span className="toggle-label">Mensal</span>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">
              Anual <span className="discount-badge">-20%</span>
            </span>
          </div>

          <div className="pricing-grid">
            {/* Plano Básico */}
            <div className="pricing-card">
              <div className="plan-header">
                <h3>Clínica Starter</h3>
                <p>Para clínicas pequenas com até 2 profissionais</p>
              </div>
              <div className="plan-price">
                <span className="currency">R$</span>
                <span className="amount">197</span>
                <span className="period">/mês</span>
              </div>
              <ul className="plan-features">
                <li>✅ Até 2 profissionais</li>
                <li>✅ Agenda básica</li>
                <li>✅ Prontuários eletrônicos</li>
                <li>✅ 500 pacientes</li>
                <li>✅ Relatórios básicos</li>
                <li>✅ Suporte por email</li>
                <li>❌ Planos de ação</li>
                <li>❌ Formulários customizados</li>
                <li>❌ API integração</li>
              </ul>
              <button
                className="plan-button"
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
              </button>
            </div>

            {/* Plano Profissional */}
            <div className="pricing-card featured">
              <div className="popular-badge">Mais Popular</div>
              <div className="plan-header">
                <h3>Clínica Pro</h3>
                <p>Para clínicas médias com até 8 profissionais</p>
              </div>
              <div className="plan-price">
                <span className="currency">R$</span>
                <span className="amount">397</span>
                <span className="period">/mês</span>
              </div>
              <ul className="plan-features">
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
              </ul>
              <button
                className="plan-button"
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
              </button>
            </div>

            {/* Plano Enterprise */}
            <div className="pricing-card">
              <div className="plan-header">
                <h3>Clínica Enterprise</h3>
                <p>Para clínicas grandes e redes de clínicas</p>
              </div>
              <div className="plan-price">
                <span className="currency">R$</span>
                <span className="amount">797</span>
                <span className="period">/mês</span>
              </div>
              <ul className="plan-features">
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
              </ul>
              <button
                className="plan-button"
                onClick={() =>
                  window.open(
                    "https://wa.me/5511972918369?text=Olá! Gostaria de saber mais sobre o plano Enterprise do CLINIC4US.",
                    "_blank"
                  )
                }
              >
                Falar com Vendas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparacao" className="comparison">
        <div className="container">
          <div className="section-header">
            <h2>Compare Todos os Planos</h2>
            <p>Veja em detalhes o que cada plano oferece</p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="feature-column">Funcionalidades</th>
                  <th>Starter</th>
                  <th className="featured-column">Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Número de profissionais</td>
                  <td>Até 2</td>
                  <td>Até 8</td>
                  <td>Ilimitado</td>
                </tr>
                <tr>
                  <td>Pacientes cadastrados</td>
                  <td>500</td>
                  <td>2.000</td>
                  <td>Ilimitado</td>
                </tr>
                <tr>
                  <td>Agenda online</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Prontuários eletrônicos</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Lembretes automáticos</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Planos de ação</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Formulários customizados</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Relatórios avançados</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Gestão financeira</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>API de integração</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Backup automático</td>
                  <td>❌</td>
                  <td>Semanal</td>
                  <td>Diário</td>
                </tr>
                <tr>
                  <td>Suporte</td>
                  <td>Email</td>
                  <td>Email + Telefone</td>
                  <td>24/7 Prioritário</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>O que Nossos Clientes Dizem</h2>
            <p>
              Depoimentos reais de profissionais que transformaram suas clínicas
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-photo">
                  <img
                    src={fernandaNinho}
                    alt="Fernanda Bragança"
                    className="client-image"
                  />
                </div>
                <div className="client-info">
                  <h4>Fernanda Bragança</h4>
                  <p>Consultora de Atendimento</p>
                  <p>Instituto Ninho</p>
                </div>
              </div>
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>
                  "A organização da agenda de diversos profissionais é bem
                  tranquila, fornece uma visão gerencial dos compromissos
                  diminuindo erros e otimizando os atendimentos."
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-photo">
                  <img
                    src={ingridResolve}
                    alt="Ingrid Barbosa"
                    className="client-image"
                  />
                </div>
                <div className="client-info">
                  <h4>Ingrid Barbosa</h4>
                  <p>Assessoria Remota</p>
                  <p>Resolve</p>
                </div>
              </div>
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>
                  "A gestão financeira nunca foi tão simples. Os relatórios me
                  ajudam a tomar decisões estratégicas juntamente com nossos
                  clientes."
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-photo">
                  <img
                    src={hellenStudio}
                    alt="Hellen Kleine"
                    className="client-image"
                  />
                </div>
                <div className="client-info">
                  <h4>Hellen Kleine</h4>
                  <p>Fisioterapeuta e Psicomotricista</p>
                  <p>Studio Kids Motriz</p>
                </div>
              </div>
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>
                  "Prontuários eletrônicos seguros e planos de ação
                  personalizados. O acompanhamento e a gestão estão muito
                  melhores agora."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para Revolucionar sua Clínica?</h2>
            <p>Junte-se a centenas de clínicas que já confiam no CLINIC4US</p>
            <div className="cta-buttons">
              <button className="cta-primary large" onClick={openTrialModal}>
                Teste Grátis de 7 Dias
              </button>
              <button
                className="cta-secondary large"
                onClick={(e) => openContactModal(e, "Demonstração do produto")}
              >
                Agendar Demonstração
              </button>
            </div>
            <p className="cta-note">
              ✅ Sem compromisso • ✅ Sem cartão de crédito • ✅ Suporte
              completo
            </p>
          </div>
        </div>
      </section>

      {/* About/Team Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Criado por Especialistas em Saúde e Tecnologia</h2>
              <p>
                Nossa equipe combina anos de experiência em gestão de clínicas
                com expertise em tecnologia avançada para criar a solução ideal
                para profissionais de saúde.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="feature-icon">🏥</div>
                  <div>
                    <h4>Experiência Clínica</h4>
                    <p>
                      Mais de 15 anos gerenciando clínicas multidisciplinares
                    </p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">💻</div>
                  <div>
                    <h4>Tecnologia Avançada</h4>
                    <p>
                      Sistema desenvolvido com as melhores práticas de segurança
                    </p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">🤝</div>
                  <div>
                    <h4>Suporte Especializado</h4>
                    <p>Equipe dedicada que entende suas necessidades</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="team-images">
              <div className="team-grid">
                <div className="team-member">
                  <img
                    src={hiltonCeo}
                    alt="Hilton CEO"
                    className="team-photo"
                  />
                  <h4>Hilton Cassahara</h4>
                  <p>CEO & Fundador</p>
                </div>
                <div className="team-member">
                  <div className="image-placeholder team-placeholder">
                    <p>👨‍💻</p>
                    <small>Foto CTO</small>
                  </div>
                  <h4>Fábio Martins</h4>
                  <p>CTO</p>
                </div>
                <div className="team-member">
                  <img
                    src={atalitaFono}
                    alt="Atalita Fonoaudióloga"
                    className="team-photo"
                  />
                  <h4>Atalita Azevedo</h4>
                  <p>Consultora Fonoaudióloga</p>
                </div>
                <div className="team-member">
                  <img
                    src={laizaResolve}
                    alt="Laiza Especialista"
                    className="team-photo"
                  />
                  <h4>Laiza Barros</h4>
                  <p>Especialista em Atendimento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onScrollToTop={scrollToTop} />

      {/* Modal de Contato */}
      <ContactForm
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        preSelectedSubject={contactPreSelectedSubject}
      />

      {/* Modal de Teste Grátis */}
      {isTrialModalOpen && (
        <div className="contact-modal-overlay" onClick={closeTrialModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            {!showTrialSuccess ? (
              <>
                <div className="contact-modal-header">
                  <div className="modal-logo-title">
                    <img src={logo} alt="CLINIC4US" className="modal-logo" />
                  </div>
                  <button
                    className="close-modal-button"
                    onClick={closeTrialModal}
                  >
                    &times;
                  </button>
                </div>

                <div className="modal-content-wrapper">
                  <div className="modal-image-section">
                    <div className="modal-contact-image">
                      <img
                        src={freeEvaluationImage}
                        alt="Teste Grátis CLINIC4US"
                        className="contact-image"
                      />
                      <div className="contact-image-overlay">
                        <h3>Teste Grátis</h3>
                      </div>
                    </div>
                    <div className="contact-benefits">
                      <div className="benefit-item">
                        <span className="benefit-icon">🎯</span>
                        <span>7 dias de teste completo</span>
                      </div>
                      <div className="benefit-item">
                        <span className="benefit-icon">💡</span>
                        <span>Sem compromisso</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleTrialSubmit} className="contact-form">
                    <div className="form-group">
                      <label htmlFor="trialNomeCompleto">Nome Completo *</label>
                      <input
                        type="text"
                        id="trialNomeCompleto"
                        name="nomeCompleto"
                        value={trialFormData.nomeCompleto}
                        onChange={handleTrialInputChange}
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="trialEmail">Email *</label>
                      <input
                        type="email"
                        id="trialEmail"
                        name="email"
                        value={trialFormData.email}
                        onChange={handleTrialInputChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="trialWhatsapp">WhatsApp *</label>
                      <div className="phone-input-container">
                        <div className="country-selector">
                          <div
                            className="country-select-custom"
                            onClick={() =>
                              setIsTrialCountryDropdownOpen(
                                !isTrialCountryDropdownOpen
                              )
                            }
                          >
                            <span className="selected-country">
                              <span className="country-prefix">
                                {trialSelectedCountry.prefix}
                              </span>
                            </span>
                            <span className="dropdown-arrow">▼</span>
                          </div>
                          {isTrialCountryDropdownOpen && (
                            <div className="country-dropdown">
                              {countries.map((country) => (
                                <div
                                  key={country.code}
                                  className={`country-option ${
                                    country.code === trialSelectedCountry.code
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    handleTrialCountryChange(country);
                                    setIsTrialCountryDropdownOpen(false);
                                  }}
                                >
                                  <span className="country-info">
                                    <span className="country-prefix">
                                      {country.prefix}
                                    </span>
                                    <span className="country-name">
                                      {country.name}
                                    </span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          id="trialWhatsapp"
                          name="whatsapp"
                          value={trialFormData.whatsapp}
                          onChange={handleTrialInputChange}
                          placeholder={
                            trialSelectedCountry.code === "BR"
                              ? "(11) 99999-9999"
                              : trialSelectedCountry.code === "US"
                              ? "(123) 456-7890"
                              : "123 456 789"
                          }
                          className="phone-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="trialQtdProfissionais">
                        Sua empresa tem quantos profissionais? *
                      </label>
                      <select
                        id="trialQtdProfissionais"
                        name="qtdProfissionais"
                        value={trialFormData.qtdProfissionais}
                        onChange={handleTrialInputChange}
                        required
                      >
                        <option value="">Selecione a quantidade</option>
                        <option value="1">1 profissional</option>
                        <option value="2-5">2 a 5 profissionais</option>
                        <option value="6-10">6 a 10 profissionais</option>
                        <option value="11-20">11 a 20 profissionais</option>
                        <option value="21-50">21 a 50 profissionais</option>
                        <option value="50+">Mais de 50 profissionais</option>
                      </select>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="submit-button">
                        Teste Grátis
                      </button>
                    </div>
                  </form>
                </div>

                <div
                  className="trial-disclaimer"
                  style={{
                    margin:
                      window.innerWidth <= 768
                        ? "1.5rem 24px 24px 24px"
                        : "2rem 32px 32px 32px",
                    padding: "20px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    borderLeft: "4px solid #03B4C6",
                  }}
                >
                  <p>
                    <strong>Avaliação gratuita</strong>
                    <br />
                    Ao se inscrever para a avaliação gratuita da plataforma
                    CLINIC4US, você receberá um e-mail de validação. Verifique
                    sua caixa de entrada (e também a pasta de spam ou promoções,
                    se necessário), siga as instruções e aproveite o período de
                    testes de 7 dias. Após este período a conta será inativada
                    automaticamente.
                  </p>
                  <p style={{ marginBottom: "0" }}>
                    Em caso de dúvidas, entre em contato com nossa equipe de
                    suporte.
                  </p>
                </div>
              </>
            ) : (
              <div className="thank-you-screen">
                <div className="thank-you-header">
                  <img src={logo} alt="CLINIC4US" className="modal-logo" />
                  <button
                    className="close-modal-button"
                    onClick={closeTrialModal}
                  >
                    &times;
                  </button>
                </div>
                <div className="thank-you-content">
                  <div className="thank-you-icon">✓</div>
                  <h2>Cadastro Realizado!</h2>
                  <p>Verifique seu email para ativar sua conta de teste.</p>
                  <button
                    className="thank-you-close-button"
                    onClick={closeTrialModal}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Assinatura */}
      {isSubscriptionModalOpen && selectedPlan && (
        <div className="contact-modal-overlay" onClick={closeSubscriptionModal}>
          <div
            className="contact-modal subscription-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {!showSubscriptionSuccess ? (
              <>
                <div className="contact-modal-header">
                  <div className="modal-logo-title">
                    <img src={logo} alt="CLINIC4US" className="modal-logo" />
                  </div>
                  <button
                    className="close-modal-button"
                    onClick={closeSubscriptionModal}
                  >
                    &times;
                  </button>
                </div>

                <div className="subscription-content">
                  <div className="subscription-plan-summary">
                    <h3>Assinatura - {selectedPlan.name}</h3>
                    <div className="plan-price-display">
                      <span className="currency">R$</span>
                      <span className="amount">{selectedPlan.price}</span>
                      <span className="period">{selectedPlan.period}</span>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubscriptionSubmit}
                    className="subscription-form"
                  >
                    <div className="form-section">
                      <h4>Dados Pessoais</h4>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="subNomeCompleto">
                            Nome Completo *
                          </label>
                          <input
                            type="text"
                            id="subNomeCompleto"
                            name="nomeCompleto"
                            value={subscriptionFormData.nomeCompleto}
                            onChange={handleSubscriptionInputChange}
                            placeholder="Digite seu nome completo"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="subEmail">Email *</label>
                          <input
                            type="email"
                            id="subEmail"
                            name="email"
                            value={subscriptionFormData.email}
                            onChange={handleSubscriptionInputChange}
                            placeholder="seu@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="subCpfCnpj">CPF/CNPJ *</label>
                          <input
                            type="text"
                            id="subCpfCnpj"
                            name="cpfCnpj"
                            value={subscriptionFormData.cpfCnpj}
                            onChange={handleSubscriptionInputChange}
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="subTelefone">Telefone *</label>
                          <input
                            type="tel"
                            id="subTelefone"
                            name="telefone"
                            value={subscriptionFormData.telefone}
                            onChange={handleSubscriptionInputChange}
                            placeholder="(11) 99999-9999"
                            required
                          />
                        </div>
                      </div>

                      {/* Campo Razão Social - aparece apenas se for CNPJ */}
                      {isCNPJ(subscriptionFormData.cpfCnpj) && (
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="subRazaoSocial">
                              Razão Social *
                            </label>
                            <input
                              type="text"
                              id="subRazaoSocial"
                              name="razaoSocial"
                              value={subscriptionFormData.razaoSocial}
                              onChange={handleSubscriptionInputChange}
                              placeholder="Nome da empresa conforme CNPJ"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="subCep">CEP *</label>
                          <input
                            type="text"
                            id="subCep"
                            name="cep"
                            value={subscriptionFormData.cep}
                            onChange={handleSubscriptionInputChange}
                            placeholder="00000-000"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="subEndereco">Endereço *</label>
                          <input
                            type="text"
                            id="subEndereco"
                            name="endereco"
                            value={subscriptionFormData.endereco}
                            onChange={handleSubscriptionInputChange}
                            placeholder="Nome da rua/avenida"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="subNumero">Número *</label>
                          <input
                            type="text"
                            id="subNumero"
                            name="numero"
                            value={subscriptionFormData.numero}
                            onChange={handleSubscriptionInputChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="subComplemento">Complemento</label>
                          <input
                            type="text"
                            id="subComplemento"
                            name="complemento"
                            value={subscriptionFormData.complemento}
                            onChange={handleSubscriptionInputChange}
                            placeholder="Apto, sala, bloco (opcional)"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="subBairro">Bairro *</label>
                          <input
                            type="text"
                            id="subBairro"
                            name="bairro"
                            value={subscriptionFormData.bairro}
                            onChange={handleSubscriptionInputChange}
                            placeholder="Nome do bairro"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="subCidade">Cidade *</label>
                          <input
                            type="text"
                            id="subCidade"
                            name="cidade"
                            value={subscriptionFormData.cidade}
                            onChange={handleSubscriptionInputChange}
                            placeholder="Nome da cidade"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="subUf">UF *</label>
                          <input
                            type="text"
                            id="subUf"
                            name="uf"
                            value={subscriptionFormData.uf}
                            onChange={handleSubscriptionInputChange}
                            placeholder="SP"
                            maxLength={2}
                            style={{ textTransform: "uppercase" }}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Dados do Cartão de Crédito</h4>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="subCardNumber">
                            Número do Cartão *
                          </label>
                          <input
                            type="text"
                            id="subCardNumber"
                            name="cardNumber"
                            value={subscriptionFormData.cardNumber}
                            onChange={handleSubscriptionInputChange}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="subCardName">Nome no Cartão *</label>
                          <input
                            type="text"
                            id="subCardName"
                            name="cardName"
                            value={subscriptionFormData.cardName}
                            onChange={handleSubscriptionInputChange}
                            placeholder="Nome como impresso no cartão"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="subCardExpiry">Validade *</label>
                          <input
                            type="text"
                            id="subCardExpiry"
                            name="cardExpiry"
                            value={subscriptionFormData.cardExpiry}
                            onChange={handleSubscriptionInputChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="subCardCvv">CVV *</label>
                          <input
                            type="text"
                            id="subCardCvv"
                            name="cardCvv"
                            value={subscriptionFormData.cardCvv}
                            onChange={handleSubscriptionInputChange}
                            placeholder="000"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="subscription-summary">
                      <div className="summary-row">
                        <span>Plano {selectedPlan.name}:</span>
                        <span>
                          R$ {selectedPlan.price}
                          {selectedPlan.period}
                        </span>
                      </div>
                      <div className="summary-row total">
                        <strong>Total:</strong>
                        <strong>
                          R$ {selectedPlan.price}
                          {selectedPlan.period}
                        </strong>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="submit-button subscription-button"
                      >
                        Confirmar Assinatura
                      </button>
                    </div>

                    <div className="subscription-security">
                      <p>
                        🔒 Pagamento 100% seguro. Seus dados estão protegidos.
                      </p>
                      <p>
                        💳 Aceitamos todos os cartões de crédito principais.
                      </p>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="thank-you-screen">
                <div className="thank-you-header">
                  <img src={logo} alt="CLINIC4US" className="modal-logo" />
                  <button
                    className="close-modal-button"
                    onClick={closeSubscriptionModal}
                  >
                    &times;
                  </button>
                </div>
                <div className="thank-you-content">
                  <div className="thank-you-icon">✓</div>
                  <h2>Assinatura Confirmada!</h2>
                  <p>Bem-vindo ao {selectedPlan?.name}!</p>
                  <p>
                    Você receberá as instruções de acesso por email em breve.
                  </p>
                  <button
                    className="thank-you-close-button"
                    onClick={closeSubscriptionModal}
                  >
                    Começar a Usar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default LandingPage;
