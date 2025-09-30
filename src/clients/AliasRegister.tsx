import React, { useState } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { LocalHospital, CalendarToday, BarChart, Visibility, VisibilityOff, Assignment, Warning } from '@mui/icons-material';

interface RegistroFormData {
  email: string;
  alias: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const AliasRegister: React.FC = () => {
  const [formData, setFormData] = useState<RegistroFormData>({
    email: "",
    alias: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    alias?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactPreSelectedSubject, setContactPreSelectedSubject] = useState<string>();

  React.useEffect(() => {
    document.title = "Clinic4Us - Cadastro de Clínica";
  }, []);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (checks.length) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.numbers) score += 1;
    if (checks.special) score += 1;

    if (score <= 2) {
      return { score, label: "Fraca", color: "#E53E3E" };
    } else if (score <= 4) {
      return { score, label: "Média", color: "#DD6B20" };
    } else {
      return { score, label: "Forte", color: "#38A169" };
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    if (!formData.alias) {
      newErrors.alias = "Alias é obrigatório";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.alias)) {
      newErrors.alias = "Não é permitido o uso de espaços ou caracteres especiais";
    } else if (formData.alias.length < 3) {
      newErrors.alias = "Alias deve ter pelo menos 3 caracteres";
    } else if (formData.alias.toLowerCase() !== 'ninho') {
      newErrors.alias = "Este identificador já existe e não pode ser usado novamente";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else {
      const strength = calculatePasswordStrength(formData.password);
      if (strength.score < 3) {
        newErrors.password = "Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
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

      alert("Cadastro realizado com sucesso!");
      console.log("AliasRegister successful:", formData);

      // Redirect to login page with clinic parameter
      window.location.href = window.location.origin + '/?page=login&clinic=ninho';
    } catch (error) {
      setErrors({
        general: "Erro no servidor. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      email: "",
      alias: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
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

  // Header menu items for alias register page
  const aliasRegisterMenuItems = [
    { label: "Início", onClick: handleGoHome },
    { label: "Contato", onClick: openContactModal },
  ];

  return (
    <div className="login-page">
      <HeaderInternal
        menuItems={aliasRegisterMenuItems}
        showCTAButton={false}
        className="login-header"
      />

      <main className="login-main">
        <div className="login-container">
          <div className="login-content">
            <div className="login-card">
              <div className="login-card-inner">
                <div className="login-image-section">
                </div>

                <div className="login-form-section">
                  <div className="login-header-content">
                    <p style={{ textAlign: 'left', fontWeight: 'bold' }}>Preencha os dados para criar sua conta</p>
                  </div>

                  <form onSubmit={handleSubmit} className="login-form">
                    {errors.general && (
                      <div className="error-message general-error">
                        {errors.general}
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="email">Email (o mesmo da assinatura do Clinic4Us)</label>
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
                      <label htmlFor="alias">Identificador da Clínica</label>
                      <input
                        type="text"
                        id="alias"
                        name="alias"
                        value={formData.alias}
                        onChange={handleInputChange}
                        placeholder="Identificador"
                        className={errors.alias ? "error" : ""}
                        disabled={isLoading}
                      />
                      {errors.alias && (
                        <span className="error-text">{errors.alias}</span>
                      )}
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#B91C1C',
                        lineHeight: '1.4'
                      }}>
                        <strong><Warning sx={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem', color: '#FFA726' }} />Importante:</strong> Informe o identificador de sua clínica, para que seja criado um link personalizado.
                        <br/>
                        <strong>Exemplo:</strong> ClinicaSucesso → www.clinic4us.com/ClinicaSucesso
                        <br/>
                        <em>Este identificador não poderá ser alterado após o cadastro.</em>
                      </div>
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
                      {formData.password && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#718096' }}>Força da senha:</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: passwordStrength.color }}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '4px',
                            backgroundColor: '#E2E8F0',
                            borderRadius: '2px',
                            marginTop: '0.25rem'
                          }}>
                            <div style={{
                              width: `${(passwordStrength.score / 5) * 100}%`,
                              height: '100%',
                              backgroundColor: passwordStrength.color,
                              borderRadius: '2px',
                              transition: 'all 0.3s ease'
                            }}></div>
                          </div>
                        </div>
                      )}
                      {errors.password && (
                        <span className="error-text">{errors.password}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Repetir Senha</label>
                      <div className="password-input-container">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Repita sua senha"
                          className={errors.confirmPassword ? "error" : ""}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="error-text">{errors.confirmPassword}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <button
                        type="submit"
                        className={`login-button ${isLoading ? "loading" : ""}`}
                        disabled={isLoading}
                        style={{ flex: 1 }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner"></span>
                            Enviando...
                          </>
                        ) : (
                          "Enviar"
                        )}
                      </button>

                      <button
                        type="button"
                        className="back-button"
                        onClick={handleClear}
                        disabled={isLoading}
                        style={{ flex: 1 }}
                      >
                        Limpar
                      </button>
                    </div>
                  </form>

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

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />
    </div>
  );
};

export default AliasRegister;