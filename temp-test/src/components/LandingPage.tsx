import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import logo from '../images/logo_clinic4us.png';
import hiltonCeo from '../images/hilton_ceo.png';
import atalitaFono from '../images/atalita_fono.png';
import laizaResolve from '../images/laiza_resolve.png';

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    whatsapp: '',
    assunto: '',
    mensagem: ''
  });
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'BR',
    name: 'Brasil',
    prefix: '+55',
    flag: 'BR'
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries = [
    { code: 'BR', name: 'Brasil', prefix: '+55', flag: 'BR' },
    { code: 'US', name: 'Estados Unidos', prefix: '+1', flag: 'US' },
    { code: 'CA', name: 'Canadá', prefix: '+1', flag: 'CA' },
    { code: 'AR', name: 'Argentina', prefix: '+54', flag: 'AR' },
    { code: 'CL', name: 'Chile', prefix: '+56', flag: 'CL' },
    { code: 'CO', name: 'Colômbia', prefix: '+57', flag: 'CO' },
    { code: 'MX', name: 'México', prefix: '+52', flag: 'MX' },
    { code: 'PE', name: 'Peru', prefix: '+51', flag: 'PE' },
    { code: 'UY', name: 'Uruguai', prefix: '+598', flag: 'UY' },
    { code: 'PY', name: 'Paraguai', prefix: '+595', flag: 'PY' },
    { code: 'BO', name: 'Bolívia', prefix: '+591', flag: 'BO' },
    { code: 'VE', name: 'Venezuela', prefix: '+58', flag: 'VE' },
    { code: 'EC', name: 'Equador', prefix: '+593', flag: 'EC' },
    { code: 'CR', name: 'Costa Rica', prefix: '+506', flag: 'CR' },
    { code: 'PA', name: 'Panamá', prefix: '+507', flag: 'PA' },
    { code: 'GT', name: 'Guatemala', prefix: '+502', flag: 'GT' },
    { code: 'PT', name: 'Portugal', prefix: '+351', flag: 'PT' },
    { code: 'ES', name: 'Espanha', prefix: '+34', flag: 'ES' },
    { code: 'FR', name: 'França', prefix: '+33', flag: 'FR' },
    { code: 'IT', name: 'Itália', prefix: '+39', flag: 'IT' },
    { code: 'DE', name: 'Alemanha', prefix: '+49', flag: 'DE' },
    { code: 'UK', name: 'Reino Unido', prefix: '+44', flag: 'UK' },
    { code: 'AU', name: 'Austrália', prefix: '+61', flag: 'AU' },
    { code: 'JP', name: 'Japão', prefix: '+81', flag: 'JP' },
    { code: 'CN', name: 'China', prefix: '+86', flag: 'CN' },
    { code: 'IN', name: 'Índia', prefix: '+91', flag: 'IN' },
    { code: 'ZA', name: 'África do Sul', prefix: '+27', flag: 'ZA' },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCountryDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.country-selector')) {
          setIsCountryDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCountryDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openContactModal = (e: React.MouseEvent, preSelectedSubject?: string) => {
    e.preventDefault();
    if (preSelectedSubject) {
      setFormData(prev => ({
        ...prev,
        assunto: preSelectedSubject
      }));
    }
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setShowThankYou(false);
  };

  const formatWhatsApp = (value: string, country: string = 'BR') => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    if (country === 'BR') {
      // Formato brasileiro: (11) 99999-9999
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    } else if (country === 'US') {
      // Formato americano: (123) 456-7890
      if (numbers.length <= 3) return `(${numbers}`;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    } else {
      // Formato genérico para outros países
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)} ${numbers.slice(9, 12)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'whatsapp') {
      const formatted = formatWhatsApp(value, selectedCountry.code);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCountryChange = (country: typeof selectedCountry) => {
    setSelectedCountry(country);
    // Limpar o campo WhatsApp quando mudar o país
    setFormData(prev => ({
      ...prev,
      whatsapp: ''
    }));
  };

  const clearForm = () => {
    setFormData({
      nomeCompleto: '',
      email: '',
      whatsapp: '',
      assunto: '',
      mensagem: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nomeCompleto || !formData.email || !formData.whatsapp || !formData.assunto || !formData.mensagem) {
      alert('Todos os campos são obrigatórios!');
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
    window.open(mailtoLink, '_blank');
    
    // Limpar formulário e mostrar tela de agradecimento
    clearForm();
    setShowThankYou(true);
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
              style={{ cursor: 'pointer' }}
            />
          </div>
          
          {/* Desktop Menu */}
          <ul className="nav-menu desktop-menu">
            <li><a href="#funcionalidades">Funcionalidades</a></li>
            <li><a href="#planos">Planos</a></li>
            <li><a href="#comparacao">Comparação</a></li>
            <li><a href="#contato" onClick={openContactModal}>Contato</a></li>
          </ul>
          
          <div className="nav-actions">
            <button 
              className="cta-button desktop-cta"
              onClick={(e) => openContactModal(e, "Informações sobre o sistema")}
            >
              Teste Grátis
            </button>
            
            {/* Hamburger Menu Button */}
            <button 
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
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
                  <img src={logo} alt="CLINIC4US" className="mobile-logo" />
                </div>
                <ul className="mobile-nav-menu">
                  <li><a href="#funcionalidades" onClick={closeMobileMenu}>Funcionalidades</a></li>
                  <li><a href="#planos" onClick={closeMobileMenu}>Planos</a></li>
                  <li><a href="#comparacao" onClick={closeMobileMenu}>Comparação</a></li>
                  <li><a href="#contato" onClick={(e) => { openContactModal(e); closeMobileMenu(); }}>Contato</a></li>
                </ul>
                <button 
                  className="cta-button mobile-cta" 
                  onClick={(e) => { openContactModal(e, "Informações sobre o sistema"); closeMobileMenu(); }}
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
            <h1>Transforme sua Clínica com o Sistema de Gestão Mais Completo</h1>
            <p>Gerencie agendamentos, prontuários, planos de ação e finanças em uma única plataforma. Ideal para clínicas multidisciplinares que buscam eficiência e crescimento.</p>
            <div className="hero-buttons">
              <button 
                className="cta-primary"
                onClick={(e) => openContactModal(e, "Informações sobre o sistema")}
              >
                Começar Teste Gratuito
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
                  <span></span><span></span><span></span>
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
              <p>Agendamento online, lembretes automáticos e gestão de horários para múltiplos profissionais.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Prontuários Eletrônicos</h3>
              <p>Prontuários digitais seguros, com histórico completo e assinatura eletrônica.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Planos de Ação</h3>
              <p>Crie e acompanhe planos de tratamento personalizados para cada paciente.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Evoluções e Notas</h3>
              <p>Registro detalhado de evoluções, com templates customizáveis por especialidade.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Formulários de Avaliação</h3>
              <p>Formulários dinâmicos e customizáveis para diferentes tipos de avaliação.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Relatórios Gerenciais</h3>
              <p>Dashboards e relatórios completos para análise de desempenho e faturamento.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Gestão Financeira</h3>
              <p>Controle financeiro completo, faturamento, repasses e integração com sistemas contábeis.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Controle de Usuários</h3>
              <p>Gestão de profissionais, permissões e controle de acesso por função.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Base de Dados Exclusiva</h3>
              <p>Cada cliente possui sua própria base de dados isolada, garantindo máxima segurança, privacidade e conformidade com a LGPD.</p>
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
              <p>Veja como o CLINIC4US otimiza cada etapa do atendimento, desde o agendamento até o faturamento.</p>
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
                <p>📱 Imagem: Interface do sistema mostrando o fluxo de trabalho - desde agendamento até relatórios</p>
                <small>Recomendação: Screenshot do dashboard principal com destaque para as principais funcionalidades</small>
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
            <span className="toggle-label">Anual <span className="discount-badge">-20%</span></span>
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
                onClick={(e) => openContactModal(e, "Informações sobre o sistema")}
              >
                Começar Teste
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
                onClick={(e) => openContactModal(e, "Informações sobre o sistema")}
              >
                Começar Teste
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
                onClick={(e) => openContactModal(e, "Informações sobre o sistema")}
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
            <p>Depoimentos reais de profissionais que transformaram suas clínicas</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-photo">
                  <div className="image-placeholder client-placeholder">
                    <p>👨‍⚕️</p>
                    <small>Foto do Dr. Carlos</small>
                  </div>
                </div>
                <div className="client-info">
                  <h4>Dr. Carlos Silva</h4>
                  <p>Fisioterapeuta</p>
                  <p>Clínica Vida Saudável</p>
                </div>
              </div>
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"O CLINIC4US revolucionou nossa clínica. Aumentamos nossa eficiência em 40% e nossos pacientes adoram o agendamento online."</p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-photo">
                  <div className="image-placeholder client-placeholder">
                    <p>👩‍⚕️</p>
                    <small>Foto da Dra. Ana</small>
                  </div>
                </div>
                <div className="client-info">
                  <h4>Dra. Ana Rodrigues</h4>
                  <p>Psicóloga</p>
                  <p>Centro de Terapias</p>
                </div>
              </div>
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"Gestão financeira nunca foi tão simples. Os relatórios me ajudam a tomar decisões estratégicas para crescer minha clínica."</p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-photo">
                  <div className="image-placeholder client-placeholder">
                    <p>👨‍⚕️</p>
                    <small>Foto do Dr. João</small>
                  </div>
                </div>
                <div className="client-info">
                  <h4>Dr. João Martins</h4>
                  <p>Nutrólogo</p>
                  <p>NutriClínica</p>
                </div>
              </div>
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"Prontuários eletrônicos seguros e planos de ação personalizados. Meus pacientes têm resultados muito melhores agora."</p>
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
              <button 
                className="cta-primary large"
                onClick={(e) => openContactModal(e, "Informações sobre o sistema")}
              >
                Começar Teste Gratuito de 30 Dias
              </button>
              <button 
                className="cta-secondary large"
                onClick={(e) => openContactModal(e, "Demonstração do produto")}
              >
                Agendar Demonstração
              </button>
            </div>
            <p className="cta-note">✅ Sem compromisso • ✅ Sem cartão de crédito • ✅ Suporte completo</p>
          </div>
        </div>
      </section>

      {/* About/Team Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Criado por Especialistas em Saúde e Tecnologia</h2>
              <p>Nossa equipe combina anos de experiência em gestão de clínicas com expertise em tecnologia avançada para criar a solução ideal para profissionais de saúde.</p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="feature-icon">🏥</div>
                  <div>
                    <h4>Experiência Clínica</h4>
                    <p>Mais de 15 anos gerenciando clínicas multidisciplinares</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">💻</div>
                  <div>
                    <h4>Tecnologia Avançada</h4>
                    <p>Sistema desenvolvido com as melhores práticas de segurança</p>
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
                  <img src={hiltonCeo} alt="Hilton CEO" className="team-photo" />
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
                  <img src={atalitaFono} alt="Atalita Fonoaudióloga" className="team-photo" />
                  <h4>Atalita Azevedo</h4>
                  <p>Consultora Fonoaudióloga</p>
                </div>
                <div className="team-member">
                  <img src={laizaResolve} alt="Laiza Especialista" className="team-photo" />
                  <h4>Laiza Barros</h4>
                  <p>Especialista em Atendimento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <img 
                src={logo} 
                alt="CLINIC4US" 
                className="footer-logo" 
                onClick={scrollToTop}
                style={{ cursor: 'pointer' }}
              />
              <p>A plataforma completa para gestão de clínicas multidisciplinares.</p>
            </div>
            <div className="footer-section">
              <h4>Produto</h4>
              <ul>
                <li><a href="#funcionalidades">Funcionalidades</a></li>
                <li><a href="#planos">Planos</a></li>
                <li><a href="#comparacao">Comparação</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Suporte</h4>
              <ul>
                <li><a href="#help">Central de Ajuda</a></li>
                <li><a href="#contact">Contato</a></li>
                <li><a href="#docs">Documentação</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#about">Sobre</a></li>
                <li><a href="#privacy">Privacidade</a></li>
                <li><a href="#terms">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CLINIC4US. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Contato */}
      {isContactModalOpen && (
        <div className="contact-modal-overlay" onClick={closeContactModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            {!showThankYou ? (
              <>
                <div className="contact-modal-header">
                  <div className="modal-logo-title">
                    <img src={logo} alt="CLINIC4US" className="modal-logo" />
                    <h2>Entre em Contato</h2>
                  </div>
                  <button className="close-modal-button" onClick={closeContactModal}>
                    &times;
                  </button>
                </div>
                
                <div className="modal-content-wrapper">
                  <div className="modal-image-section">
                    <div className="image-placeholder modal-contact-placeholder">
                      <p>🏥</p>
                      <h3>Fale Conosco</h3>
                      <small>Imagem: Profissional de saúde sorrindo ou equipe médica em ambiente clínico</small>
                    </div>
                    <div className="contact-benefits">
                      <div className="benefit-item">
                        <span className="benefit-icon">⚡</span>
                        <span>Resposta em até 2 horas</span>
                      </div>
                      <div className="benefit-item">
                        <span className="benefit-icon">🎯</span>
                        <span>Demonstração personalizada</span>
                      </div>
                      <div className="benefit-item">
                        <span className="benefit-icon">💡</span>
                        <span>Consultoria gratuita</span>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="nomeCompleto">Nome Completo *</label>
                <input
                  type="text"
                  id="nomeCompleto"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp *</label>
                <div className="phone-input-container">
                  <div className="country-selector">
                    <div 
                      className="country-select-custom"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    >
                      <span className="selected-country">
                        <span className="country-prefix">{selectedCountry.prefix}</span>
                      </span>
                      <span className="dropdown-arrow">▼</span>
                    </div>
                    {isCountryDropdownOpen && (
                      <div className="country-dropdown">
                        {countries.map((country) => (
                          <div
                            key={country.code}
                            className={`country-option ${country.code === selectedCountry.code ? 'selected' : ''}`}
                            onClick={() => {
                              handleCountryChange(country);
                              setIsCountryDropdownOpen(false);
                            }}
                          >
                            <span className="country-info">
                              <span className="country-prefix">{country.prefix}</span>
                              <span className="country-name">{country.name}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder={selectedCountry.code === 'BR' ? '(11) 99999-9999' : 
                                selectedCountry.code === 'US' ? '(123) 456-7890' : 
                                '123 456 789'}
                    className="phone-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="assunto">Assunto *</label>
                <select
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="Informações sobre o sistema">Informações sobre o sistema</option>
                  <option value="Demonstração do produto">Demonstração do produto</option>
                  <option value="Planos e preços">Planos e preços</option>
                  <option value="Suporte técnico">Suporte técnico</option>
                  <option value="Parceria comercial">Parceria comercial</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mensagem">Mensagem *</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  placeholder="Digite sua mensagem aqui..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="clear-button" onClick={clearForm}>
                  Limpar Campos
                </button>
                <button type="submit" className="submit-button">
                  Enviar Mensagem
                </button>
              </div>
            </form>
                </div>
              </>
            ) : (
              <div className="thank-you-screen">
                <div className="thank-you-header">
                  <img src={logo} alt="CLINIC4US" className="modal-logo" />
                  <button className="close-modal-button" onClick={closeContactModal}>
                    &times;
                  </button>
                </div>
                <div className="thank-you-content">
                  <div className="thank-you-icon">✓</div>
                  <h2>Obrigado pelo contato!</h2>
                  <p>Nossos consultores retornarão em breve.</p>
                  <button className="thank-you-close-button" onClick={closeContactModal}>
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;