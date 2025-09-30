import React, { useState } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { LocalHospital, CalendarToday, BarChart, Visibility, VisibilityOff, CheckCircle, Info, Assignment } from '@mui/icons-material';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactPreSelectedSubject, setContactPreSelectedSubject] = useState<string>();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [clinicError, setClinicError] = useState<string>("");
  const [isValidClinic, setIsValidClinic] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  React.useEffect(() => {
    document.title = "Clinic4Us - Login";

    // Verificar parâmetro clinic na URL
    const urlParams = new URLSearchParams(window.location.search);
    const clinicParam = urlParams.get('clinic');

    if (!clinicParam || clinicParam.trim() === '') {
      setClinicError("Acesse a plataforma com o link específico de sua clínica. Em caso de dúvida, entre em contato com o administrador do sistema.");
      setIsValidClinic(false);
      return;
    }

    // Mock de validação do cliente (frontend only)
    const validClinics = ['ninho', 'clinic1', 'clinic2']; // Lista de clínicas válidas (mock)

    if (validClinics.includes(clinicParam.toLowerCase())) {
      setIsValidClinic(true);
      setClinicError("");
    } else {
      setClinicError("Cliente não encontrado. Por favor, entre em contato com o administrador do sistema de sua clínica.");
      setIsValidClinic(false);
      return;
    }

    // Carregar dados salvos se existirem (apenas se clinic for válida)
    const savedData = localStorage.getItem('clinic4us-remember-me');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          email: parsedData.email || "",
          password: "", // Por segurança, senha nunca é pré-preenchida
          rememberMe: true
        }));
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        localStorage.removeItem('clinic4us-remember-me');
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Se desmarcar "Lembrar de mim", remover dados salvos
    if (name === "rememberMe" && !checked) {
      localStorage.removeItem('clinic4us-remember-me');
    }

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, check if it's a valid email/password combination
      if (formData.email === "admin@clinic4us.com" && formData.password === "123456") {
        // Salvar dados se "Lembrar de mim" estiver marcado
        if (formData.rememberMe) {
          try {
            const dataToSave = {
              email: formData.email
              // Por segurança, senha nunca é salva
            };
            localStorage.setItem('clinic4us-remember-me', JSON.stringify(dataToSave));
          } catch (error) {
            console.error('Erro ao salvar dados para lembrar:', error);
          }
        }

        // Pegar parâmetro clinic da URL para o alias
        const urlParams = new URLSearchParams(window.location.search);
        const clinicAlias = urlParams.get('clinic') || 'ninho';

        // Criar sessão do usuário com perfis mais detalhados
        const userProfiles = {
          'admin@clinic4us.com': {
            profile: 'Administrador',
            permissions: ['dashboard', 'agenda', 'pacientes', 'relatorios', 'financeiro', 'configuracoes', 'usuarios'],
            menuItems: [
              { label: 'Dashboard', href: '#dashboard' },
              { label: 'Agenda', href: '#agenda' },
              { label: 'Pacientes', href: '#pacientes' },
              { label: 'Relatórios', href: '#relatorios' },
              { label: 'Financeiro', href: '#financeiro' },
              { label: 'Usuários', href: '#usuarios' },
              { label: 'Configurações', href: '#configuracoes' }
            ]
          },
          'medico@clinic4us.com': {
            profile: 'Médico',
            permissions: ['dashboard', 'agenda', 'pacientes', 'relatorios'],
            menuItems: [
              { label: 'Dashboard', href: '#dashboard' },
              { label: 'Agenda', href: '#agenda' },
              { label: 'Pacientes', href: '#pacientes' },
              { label: 'Relatórios', href: '#relatorios' }
            ]
          },
          'recepcao@clinic4us.com': {
            profile: 'Recepção',
            permissions: ['dashboard', 'agenda', 'pacientes'],
            menuItems: [
              { label: 'Dashboard', href: '#dashboard' },
              { label: 'Agenda', href: '#agenda' },
              { label: 'Pacientes', href: '#pacientes' }
            ]
          }
        };

        const userProfile = userProfiles[formData.email as keyof typeof userProfiles] || userProfiles['admin@clinic4us.com'];

        const userSession = {
          email: formData.email,
          alias: clinicAlias,
          clinic: clinicAlias,
          clinicName: clinicAlias === 'ninho' ? 'Instituto Ninho' : `Clínica ${clinicAlias}`,
          role: userProfile.profile,
          permissions: userProfile.permissions,
          menuItems: userProfile.menuItems,
          loginTime: new Date().toISOString(), // ISO string para melhor precisão
          loginTimestamp: Date.now(), // Timestamp para cálculos
          sessionId: Date.now().toString(),
          sessionDuration: 300, // 5 minutos em segundos para homologação
        };

        // Salvar sessão diretamente no localStorage (o contexto carregará automaticamente)
        try {
          localStorage.setItem('clinic4us-user-session', JSON.stringify(userSession));
        } catch (error) {
          console.error('Erro ao criar sessão:', error);
        }

        alert("Login realizado com sucesso! Redirecionando...");

        // Redirecionar para dashboard
        window.location.href = window.location.origin + '/?page=dashboard';
      } else {
        setErrors({
          general: "Credenciais inválidas. Tente novamente.",
        });
      }
    } catch (error) {
      setErrors({
        general: "Erro no servidor. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setErrors({});
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setForgotPasswordSent(false);
    setErrors({});
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordEmail) {
      setErrors({ email: "Email é obrigatório" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      setErrors({ email: "Email inválido" });
      return;
    }

    // Simular envio do email
    setErrors({});
    setForgotPasswordSent(true);
  };

  const handleForgotPasswordEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotPasswordEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handleGoToPlans = () => {
    // Redirect to landing page plans section
    window.location.href = window.location.origin + '#planos';
  };

  const handleGoHome = () => {
    // Redirect to landing page
    window.location.href = window.location.origin;
  };

  // Contact modal functions
  const openContactModal = (e: React.MouseEvent, preSelectedSubject?: string) => {
    e.preventDefault();
    setContactPreSelectedSubject(preSelectedSubject);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactPreSelectedSubject(undefined);
  };

  // Header logged in callbacks
  const handleRevalidateLogin = () => {
    setIsUserLoggedIn(false);
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
    setErrors({});
    alert("Sessão encerrada. Faça login novamente.");
  };

  const handleNotificationClick = () => {
    alert("Você tem 27 notificações!");
  };

  const handleUserClick = () => {
    alert("Menu do usuário - perfil, configurações, logout");
  };

  // Header menu items for login page
  const loginMenuItems = [
    { label: "Início", onClick: handleGoHome },
    { label: "Contato", onClick: openContactModal },
  ];

  return (
    <div className="login-page login-page-specific">
      <HeaderInternal
        menuItems={loginMenuItems}
        showCTAButton={!isUserLoggedIn}
        ctaButtonText="Assinar"
        onCTAClick={handleGoToPlans}
        className="login-header"
        isLoggedIn={isUserLoggedIn}
        userEmail={formData.email}
        notificationCount={27}
        onRevalidateLogin={handleRevalidateLogin}
        onNotificationClick={handleNotificationClick}
        onUserClick={handleUserClick}
      />

      <main className="login-main">
        <div className="login-container">
          <div className="login-content">
            <div className="login-card" style={{ opacity: clinicError ? 0.3 : 1, pointerEvents: clinicError ? 'none' : 'auto' }}>
              <div className="login-card-inner">
                <div className="login-image-section">
                </div>

                <div className="login-form-section">
                  <div className="login-header-content">
                    <p>{showForgotPassword ? "Recuperar senha" : "Acesse sua conta para gerenciar sua clínica"}</p>
                  </div>

                  {!showForgotPassword ? (
                    <>
                      <form onSubmit={handleSubmit} className="login-form">
                        {errors.general && (
                          <div className="error-message general-error">
                            {errors.general}
                          </div>
                        )}

                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            className={errors.email ? "error" : ""}
                            disabled={isLoading}
                          />
                          {errors.email && (
                            <span className="error-text">{errors.email}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="password">Senha</label>
                          <div className="password-input-container">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Digite sua senha"
                              className={errors.password ? "error" : ""}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </button>
                          </div>
                          {errors.password && (
                            <span className="error-text">{errors.password}</span>
                          )}
                        </div>

                        <div className="form-options">
                          <label className="checkbox-container">
                            <input
                              type="checkbox"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleInputChange}
                              disabled={isLoading}
                            />
                            <span className="checkmark"></span>
                            Lembrar de mim
                          </label>

                          <button
                            type="button"
                            className="forgot-password-link"
                            onClick={handleForgotPassword}
                            disabled={isLoading}
                          >
                            Esqueceu a senha?
                          </button>
                        </div>

                        <button
                          type="submit"
                          className={`login-button ${isLoading ? "loading" : ""}`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner"></span>
                              Entrando...
                            </>
                          ) : (
                            "Entrar"
                          )}
                        </button>
                      </form>

                      <div className="login-footer">
                        <p>
                          Não tem uma conta?{" "}
                          <button
                            className="register-link"
                            onClick={handleGoToPlans}
                            disabled={isLoading}
                          >
                            Assinar
                          </button>
                        </p>
                      </div>

                      <div className="demo-credentials">
                        <p><strong>Demo:</strong></p>
                        <p>Email: admin@clinic4us.com</p>
                        <p>Senha: 123456</p>
                      </div>
                    </>
                  ) : (
                    // Formulário de Esqueci a Senha
                    <div className="forgot-password-form">
                {!forgotPasswordSent ? (
                  <form onSubmit={handleForgotPasswordSubmit} className="login-form">
                    <div className="form-group">
                      <label htmlFor="forgotEmail">Email</label>
                      <input
                        type="email"
                        id="forgotEmail"
                        name="forgotEmail"
                        value={forgotPasswordEmail}
                        onChange={handleForgotPasswordEmailChange}
                        placeholder="Digite seu email"
                        className={errors.email ? "error" : ""}
                        required
                      />
                      {errors.email && (
                        <span className="error-text">{errors.email}</span>
                      )}
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="login-button">
                        Enviar Link de Recuperação
                      </button>
                      <button
                        type="button"
                        className="back-button"
                        onClick={handleBackToLogin}
                      >
                        ← Voltar ao Login
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="success-message">
                    <div className="success-icon"><CheckCircle /></div>
                    <h3>Email enviado!</h3>
                    <p>
                      Enviamos um link de recuperação para <strong>{forgotPasswordEmail}</strong>.
                      Verifique sua caixa de entrada e spam.
                    </p>
                    <button
                      className="back-button"
                      onClick={handleBackToLogin}
                    >
                      ← Voltar ao Login
                    </button>
                  </div>
                )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Contato */}
      <ContactForm
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        preSelectedSubject={contactPreSelectedSubject}
      />

      {/* Modal de Erro da Clínica */}
      {clinicError && (
        <div className="clinic-error-modal-overlay">
          <div className="clinic-error-modal">
            <div className="clinic-error-header">
              <div className="clinic-error-icon"><Info /></div>
              <h3>Informação de Acesso</h3>
            </div>
            <div className="clinic-error-content">
              <p>{clinicError}</p>
            </div>
          </div>
        </div>
      )}

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />
    </div>
  );
};

export default Login;