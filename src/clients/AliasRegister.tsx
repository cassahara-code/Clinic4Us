import React, { useState } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { Warning, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { colors, typography, inputs } from "../theme/designSystem";

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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Cadastro realizado com sucesso!");
      console.log("AliasRegister successful:", formData);

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
    window.location.href = window.location.origin + '#planos';
  };

  const handleGoHome = () => {
    window.location.href = window.location.origin;
  };

  const openContactModal = (e: React.MouseEvent, preSelectedSubject?: string) => {
    e.preventDefault();
    setContactPreSelectedSubject(preSelectedSubject);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactPreSelectedSubject(undefined);
  };

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
        <Box className="login-container">
          <Box className="login-content">
            <Paper
              className="login-card"
              elevation={0}
              sx={{
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${colors.backgroundAlt}`,
              }}
            >
              <Box className="login-card-inner">
                <Box className="login-image-section">
                </Box>

                <Box className="login-form-section">
                  <Box className="login-header-content">
                    <Typography variant="body1" sx={{ textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>
                      Preencha os dados para criar sua conta
                    </Typography>
                  </Box>

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
                        label="Email (o mesmo da assinatura do Clinic4Us)"
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
                            height: inputs.default.height,
                            fontSize: typography.fontSize.base,
                            backgroundColor: colors.white,
                            '& fieldset': {
                              borderColor: colors.border,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.border,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              boxShadow: `0 0 0 3px ${colors.primaryLight}`,
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '10.5px 14px',
                            color: colors.textPrimary,
                            '&::placeholder': {
                              color: colors.textSecondary,
                              opacity: 1,
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
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <TextField
                        type="text"
                        id="alias"
                        name="alias"
                        label="Identificador da Clínica"
                        value={formData.alias}
                        onChange={handleInputChange}
                        placeholder="Identificador"
                        error={!!errors.alias}
                        helperText={errors.alias}
                        disabled={isLoading}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: inputs.default.height,
                            fontSize: typography.fontSize.base,
                            backgroundColor: colors.white,
                            '& fieldset': {
                              borderColor: colors.border,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.border,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              boxShadow: `0 0 0 3px ${colors.primaryLight}`,
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '10.5px 14px',
                            color: colors.textPrimary,
                            '&::placeholder': {
                              color: colors.textSecondary,
                              opacity: 1,
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
                      <Box sx={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '6px',
                        fontSize: typography.fontSize.xs,
                        color: '#B91C1C',
                        lineHeight: 1.4
                      }}>
                        <Box component="strong" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Warning sx={{ fontSize: '1rem', color: '#FFA726' }} />
                          Importante:
                        </Box>
                        Informe o identificador de sua clínica, para que seja criado um link personalizado.
                        <br/>
                        <strong>Exemplo:</strong> ClinicaSucesso → www.clinic4us.com/ClinicaSucesso
                        <br/>
                        <em>Este identificador não poderá ser alterado após o cadastro.</em>
                      </Box>
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
                            height: inputs.default.height,
                            fontSize: typography.fontSize.base,
                            backgroundColor: colors.white,
                            '& fieldset': {
                              borderColor: colors.border,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.border,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              boxShadow: `0 0 0 3px ${colors.primaryLight}`,
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '10.5px 14px',
                            paddingRight: '3rem',
                            color: colors.textPrimary,
                            '&::placeholder': {
                              color: colors.textSecondary,
                              opacity: 1,
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
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                edge="end"
                                sx={{ color: colors.textSecondary }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {formData.password && (
                        <Box sx={{ marginTop: '0.5rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textSecondary }}>
                              Força da senha:
                            </Typography>
                            <Typography sx={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: passwordStrength.color }}>
                              {passwordStrength.label}
                            </Typography>
                          </Box>
                          <Box sx={{
                            width: '100%',
                            height: '4px',
                            backgroundColor: colors.backgroundAlt,
                            borderRadius: '2px',
                            marginTop: '0.25rem'
                          }}>
                            <Box sx={{
                              width: `${(passwordStrength.score / 5) * 100}%`,
                              height: '100%',
                              backgroundColor: passwordStrength.color,
                              borderRadius: '2px',
                              transition: 'all 0.3s ease'
                            }}></Box>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <TextField
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Repetir Senha"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Repita sua senha"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        disabled={isLoading}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: inputs.default.height,
                            fontSize: typography.fontSize.base,
                            backgroundColor: colors.white,
                            '& fieldset': {
                              borderColor: colors.border,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.border,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              boxShadow: `0 0 0 3px ${colors.primaryLight}`,
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '10.5px 14px',
                            paddingRight: '3rem',
                            color: colors.textPrimary,
                            '&::placeholder': {
                              color: colors.textSecondary,
                              opacity: 1,
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
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                                edge="end"
                                sx={{ color: colors.textSecondary }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isLoading}
                        sx={{
                          py: 1.5,
                          backgroundColor: colors.primary,
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          textTransform: 'none',
                          borderRadius: '8px',
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: colors.primaryHover,
                            boxShadow: 'none',
                          },
                          '&:disabled': {
                            backgroundColor: colors.textSecondary,
                            color: colors.white,
                          },
                        }}
                      >
                        {isLoading ? "Enviando..." : "Enviar"}
                      </Button>

                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleClear}
                        disabled={isLoading}
                        fullWidth
                        sx={{
                          py: 1.5,
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          textTransform: 'none',
                          borderRadius: '8px',
                          borderColor: colors.border,
                          color: colors.textPrimary,
                          '&:hover': {
                            borderColor: colors.borderHover,
                            backgroundColor: colors.background,
                          },
                        }}
                      >
                        Limpar
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </main>

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
