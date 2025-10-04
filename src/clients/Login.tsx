import React, { useState } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { useAuth } from "../contexts/AuthContext";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Info
} from '@mui/icons-material';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { login } = useAuth();
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
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  React.useEffect(() => {
    document.title = "Clinic4Us - Login";

    // Verificar parâmetro clinic na URL
    const urlParams = new URLSearchParams(window.location.search);
    const clinicParam = urlParams.get('clinic');

    if (!clinicParam || clinicParam.trim() === '') {
      setClinicError("Acesse a plataforma com o link específico de sua clínica. Em caso de dúvida, entre em contato com o administrador do sistema.");
      return;
    }

    // Mock de validação do cliente (frontend only)
    const validClinics = ['ninho', 'clinic1', 'clinic2']; // Lista de clínicas válidas (mock)

    if (validClinics.includes(clinicParam.toLowerCase())) {
      setClinicError("");
    } else {
      setClinicError("Cliente não encontrado. Por favor, entre em contato com o administrador do sistema de sua clínica.");
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Pegar parâmetro clinic da URL
      const urlParams = new URLSearchParams(window.location.search);
      const clinic = urlParams.get('clinic') || 'ninho';

      // Fazer login usando o AuthContext
      const result = await login(formData.email, formData.password, formData.rememberMe, clinic);

      if (result.success) {
        // Redirecionar para dashboard
        window.location.href = window.location.origin + '/?page=dashboard';
      } else {
        setErrors({
          general: result.error || "Credenciais inválidas. Tente novamente.",
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
        <Box className="login-container">
          <Box className="login-content">
            <Paper
              className="login-card"
              elevation={0}
              sx={{
                opacity: clinicError ? 0.3 : 1,
                pointerEvents: clinicError ? 'none' : 'auto',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e9ecef',
              }}
            >
              <Box className="login-card-inner">
                <Box className="login-image-section">
                </Box>

                <Box className="login-form-section">
                  <Box className="login-header-content">
                    <Typography variant="body1">
                      {showForgotPassword ? "Recuperar senha" : "Acesse sua conta para gerenciar sua clínica"}
                    </Typography>
                  </Box>

                  {!showForgotPassword ? (
                    <>
                      <Box component="form" onSubmit={handleSubmit} className="login-form">
                        {errors.general && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.general}
                          </Alert>
                        )}

                        <Box sx={{ mb: 2 }}>
                          <TextField
                            type="email"
                            id="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isLoading}
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: '45px',
                                fontSize: '1rem',
                                backgroundColor: 'white',
                                '& fieldset': {
                                  borderColor: '#ced4da',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#ced4da',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#03B4C6',
                                  boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '10.5px 14px',
                                color: '#495057',
                                '&::placeholder': {
                                  color: '#6c757d',
                                  opacity: 1,
                                },
                              },
                            }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <TextField
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            label="Senha"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Digite sua senha"
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isLoading}
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: '45px',
                                fontSize: '1rem',
                                backgroundColor: 'white',
                                '& fieldset': {
                                  borderColor: '#ced4da',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#ced4da',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#03B4C6',
                                  boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '10.5px 14px',
                                paddingRight: '3rem',
                                color: '#495057',
                                '&::placeholder': {
                                  color: '#6c757d',
                                  opacity: 1,
                                },
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    edge="end"
                                    sx={{ color: '#6c757d' }}
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        <Box className="form-options" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                sx={{
                                  color: '#2EAAA1',
                                  '&.Mui-checked': {
                                    color: '#2EAAA1',
                                  },
                                  padding: '0 9px',
                                }}
                              />
                            }
                            label="Lembrar de mim"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontSize: '1rem',
                                color: '#212529',
                              },
                            }}
                          />

                          <Button
                            type="button"
                            variant="text"
                            onClick={handleForgotPassword}
                            disabled={isLoading}
                            sx={{
                              textTransform: 'none',
                              color: '#03B4C6',
                              fontSize: '1rem',
                              '&:hover': {
                                backgroundColor: 'rgba(3, 180, 198, 0.04)',
                              },
                            }}
                          >
                            Esqueceu a senha?
                          </Button>
                        </Box>

                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          disabled={isLoading}
                          sx={{
                            py: 1.5,
                            mb: 2,
                            backgroundColor: '#03B4C6',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '8px',
                            boxShadow: 'none',
                            '&:hover': {
                              backgroundColor: '#029AAB',
                              boxShadow: 'none',
                            },
                            '&:disabled': {
                              backgroundColor: '#6c757d',
                              color: 'white',
                            },
                          }}
                        >
                          {isLoading ? (
                            <>
                              <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                              Entrando...
                            </>
                          ) : (
                            "Entrar"
                          )}
                        </Button>
                      </Box>

                      <Box className="login-footer" sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#6c757d' }}>
                          Não tem uma conta?{" "}
                          <Button
                            variant="text"
                            onClick={handleGoToPlans}
                            disabled={isLoading}
                            sx={{
                              textTransform: 'none',
                              p: 0,
                              minWidth: 'auto',
                              fontSize: '1rem',
                              color: '#03B4C6',
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: 'transparent',
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Assinar
                          </Button>
                        </Typography>
                      </Box>

                    </>
                  ) : (
                    // Formulário de Esqueci a Senha
                    <Box className="forgot-password-form">
                      {!forgotPasswordSent ? (
                        <Box component="form" onSubmit={handleForgotPasswordSubmit} className="login-form">
                          <Box sx={{ mb: 3 }}>
                            <TextField
                              type="email"
                              id="forgotEmail"
                              name="forgotEmail"
                              label="Email"
                              value={forgotPasswordEmail}
                              onChange={handleForgotPasswordEmailChange}
                              placeholder="Digite seu email"
                              error={!!errors.email}
                              helperText={errors.email}
                              required
                              fullWidth
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  height: '45px',
                                  fontSize: '1rem',
                                  backgroundColor: 'white',
                                  '& fieldset': {
                                    borderColor: '#ced4da',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#ced4da',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#03B4C6',
                                    boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                                  },
                                },
                                '& .MuiOutlinedInput-input': {
                                  padding: '10.5px 14px',
                                  color: '#495057',
                                  '&::placeholder': {
                                    color: '#6c757d',
                                    opacity: 1,
                                  },
                                },
                              }}
                            />
                          </Box>

                          <Box className="form-actions" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              fullWidth
                              sx={{
                                py: 1.5,
                                backgroundColor: '#03B4C6',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: '8px',
                                boxShadow: 'none',
                                '&:hover': {
                                  backgroundColor: '#029AAB',
                                  boxShadow: 'none',
                                },
                              }}
                            >
                              Enviar Link de Recuperação
                            </Button>
                            <Button
                              type="button"
                              variant="text"
                              onClick={handleBackToLogin}
                              fullWidth
                              sx={{
                                textTransform: 'none',
                                color: '#03B4C6',
                                fontSize: '1rem',
                                '&:hover': {
                                  backgroundColor: 'rgba(3, 180, 198, 0.04)',
                                },
                              }}
                            >
                              ← Voltar ao Login
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box className="success-message" sx={{ textAlign: 'center', py: 3 }}>
                          <Box className="success-icon" sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />
                          </Box>
                          <Typography variant="h6" sx={{ mb: 2, fontSize: '1.25rem', fontWeight: 600, color: '#212529' }}>Email enviado!</Typography>
                          <Typography variant="body1" sx={{ mb: 3, fontSize: '1rem', color: '#6c757d' }}>
                            Enviamos um link de recuperação para <strong style={{ color: '#212529' }}>{forgotPasswordEmail}</strong>.
                            Verifique sua caixa de entrada e spam.
                          </Typography>
                          <Button
                            variant="text"
                            onClick={handleBackToLogin}
                            fullWidth
                            sx={{
                              textTransform: 'none',
                              color: '#03B4C6',
                              fontSize: '1rem',
                              '&:hover': {
                                backgroundColor: 'rgba(3, 180, 198, 0.04)',
                              },
                            }}
                          >
                            ← Voltar ao Login
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </main>

      {/* Modal de Contato */}
      <ContactForm
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        preSelectedSubject={contactPreSelectedSubject}
      />

      {/* Modal de Erro da Clínica */}
      <Dialog
        open={!!clinicError}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info color="primary" />
            <Typography variant="h6">Informação de Acesso</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{clinicError}</Typography>
        </DialogContent>
      </Dialog>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />
    </div>
  );
};

export default Login;
