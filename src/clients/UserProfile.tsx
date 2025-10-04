import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Alert
} from '@mui/material';
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { FaqButton } from "../components/FaqButton";
import PhotoUpload from "../components/PhotoUpload";
import { colors, spacing, buttons, inputs, typography } from "../theme/designSystem";

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
  userProfiles?: string[];
}

interface UserProfileData {
  currentEmail: string;
  newEmail: string;
  confirmEmail: string;
  currentPassword: string;
  photo?: string;
  photoRotation?: number;
  photoZoom?: number;
  photoFlipX?: number;
  photoPositionX?: number;
  photoPositionY?: number;
}

const UserProfile: React.FC = () => {
  const { goToDashboard } = useNavigation();
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [formData, setFormData] = useState<UserProfileData>({
    currentEmail: "",
    newEmail: "",
    confirmEmail: "",
    currentPassword: "",
    photo: "",
    photoRotation: 0,
    photoZoom: 1,
    photoFlipX: 1,
    photoPositionX: 0,
    photoPositionY: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.title = "Clinic4Us - Meu Perfil";

    const simulatedUserSession: UserSession = {
      email: "cassahara@gmail.com",
      alias: "Usuário Demo",
      clinicName: "Clínica Demo",
      role: "Professional",
      permissions: ["view_schedule", "manage_appointments"],
      menuItems: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Agenda", href: "/schedule" },
        { label: "Pacientes", href: "/patients" },
        { label: "Relatórios", href: "/reports" }
      ],
      loginTime: new Date().toISOString(),
      userProfiles: ["Cliente admin", "Profissional", "Secretário"]
    };

    setUserSession(simulatedUserSession);
    setFormData(prev => ({
      ...prev,
      currentEmail: simulatedUserSession.email
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRevalidateLogin = () => {
    localStorage.removeItem('clinic4us-user-session');
    localStorage.removeItem('clinic4us-remember-me');
    alert("Sessão encerrada. Redirecionando para login..");
    window.location.href = window.location.origin + '/?page=login&clinic=ninho';
  };

  const handleNotificationClick = () => {
    alert("Sistema de notificações - 27 notificações pendentes");
  };

  const handleUserClick = () => {
    alert("Configurações do usuário - funcionalidade em desenvolvimento");
  };

  const handleLogoClick = () => {
    goToDashboard();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      alert("Por favor, digite sua senha atual");
      return;
    }

    setIsLoading(true);

    try {
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage("Uma mensagem foi enviada para seu e-mail de cadastro com instruções sobre o procedimento.");

      // Limpar o formulário de senha
      setFormData(prev => ({
        ...prev,
        currentPassword: ""
      }));
    } catch (error) {
      alert("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.newEmail || !formData.confirmEmail) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    if (formData.newEmail !== formData.confirmEmail) {
      alert("Os e-mails não coincidem");
      return;
    }

    if (!formData.currentPassword) {
      alert("Por favor, digite sua senha atual");
      return;
    }

    setIsLoading(true);

    try {
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("Uma mensagem será enviada para seu novo e-mail de cadastro com instruções sobre o procedimento.");

      // Limpar o formulário
      setFormData(prev => ({
        ...prev,
        newEmail: "",
        confirmEmail: "",
        currentPassword: ""
      }));
    } catch (error) {
      alert("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
        className=""
        isLoggedIn={true}
        userEmail={userSession.email}
        userProfile={userSession.alias}
        clinicName={userSession.clinicName}
        notificationCount={27}
        onLogoClick={handleLogoClick}
        onRevalidateLogin={handleRevalidateLogin}
        onNotificationClick={handleNotificationClick}
        onUserClick={handleUserClick}
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
                Meu perfil
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary
                }}
              >
                Aqui você pode visualizar e alterar os dados de sua conta.
              </Typography>
            </Box>
            <FaqButton />
          </Box>

          {/* Paper único contendo todo o conteúdo */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${colors.backgroundAlt}`,
            }}
          >
            {/* Grid de 3 colunas */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              alignItems: 'start'
            }}>
              {/* Coluna 1: Dados do usuário */}
              <Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary,
                  mb: 2
                }}
              >
                Dados do usuário
              </Typography>

              {/* Email atual */}
              <TextField
                fullWidth
                label="Seu usuário"
                value={formData.currentEmail}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    height: inputs.default.height,
                    backgroundColor: colors.backgroundAlt,
                    '& fieldset': {
                      borderColor: colors.border,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: inputs.default.labelFontSize,
                    color: colors.textSecondary,
                    backgroundColor: colors.white,
                    padding: inputs.default.labelPadding,
                  },
                }}
              />

              {/* Seção: Perfis de acesso */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textPrimary,
                    mb: 1
                  }}
                >
                  Perfis de acesso
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    mb: 2
                  }}
                >
                  Seu usuário tem acesso aos seguintes perfis:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {userSession?.userProfiles?.map((profile, index) => (
                    <Chip
                      key={index}
                      label={profile}
                      sx={{
                        backgroundColor: colors.primaryLight,
                        color: colors.primary,
                        fontWeight: typography.fontWeight.medium,
                        fontSize: typography.fontSize.sm,
                        border: `1px solid ${colors.primary}`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Coluna 2: Nova senha e Trocar usuário */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Seção: Nova senha */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textPrimary,
                    mb: 2
                  }}
                >
                  Nova senha
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    mb: 2
                  }}
                >
                  Para criar uma nova senha clique no botão abaixo. Uma mensagem será enviada para seu e-mail de cadastro com instruções sobre o procedimento.
                </Typography>

                <form onSubmit={handleChangePassword}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                      textTransform: 'none',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      height: buttons.primary.height,
                      borderRadius: buttons.primary.borderRadius,
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: colors.primaryHover,
                        boxShadow: 'none',
                      },
                      '&:disabled': {
                        backgroundColor: colors.backgroundAlt,
                        color: colors.textMuted,
                      },
                    }}
                  >
                    {isLoading ? "Processando..." : "Prosseguir"}
                  </Button>
                </form>

                {successMessage && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 2,
                      fontSize: typography.fontSize.sm,
                      borderRadius: '8px',
                    }}
                  >
                    {successMessage}
                  </Alert>
                )}
              </Box>

              {/* Seção: Trocar usuário */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textPrimary,
                    mb: 2
                  }}
                >
                  Trocar usuário
                </Typography>

                <Box component="form" onSubmit={handleChangeEmail} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Informe um novo e-mail diferente do anterior"
                    type="email"
                    name="newEmail"
                    value={formData.newEmail}
                    onChange={handleInputChange}
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    sx={{
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

                  <TextField
                    fullWidth
                    label="Para sua segurança repita o e-mail informado"
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    sx={{
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

                  <TextField
                    fullWidth
                    label="Digite sua antiga senha"
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    InputLabelProps={{ shrink: true }}
                    sx={{
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

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: typography.fontSize.sm,
                      color: colors.textSecondary,
                    }}
                  >
                    Uma mensagem será enviada para seu novo e-mail de cadastro com instruções sobre o procedimento.
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: colors.textSecondary,
                      color: colors.white,
                      textTransform: 'none',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      height: buttons.secondary.height,
                      borderRadius: buttons.secondary.borderRadius,
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#5a6268',
                        boxShadow: 'none',
                      },
                      '&:disabled': {
                        backgroundColor: colors.backgroundAlt,
                        color: colors.textMuted,
                      },
                    }}
                  >
                    {isLoading ? "Processando..." : "Prosseguir"}
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Coluna 3: Foto do perfil */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary,
                  mb: 2,
                  alignSelf: 'flex-start'
                }}
              >
                Foto do perfil
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <PhotoUpload
                  photo={formData.photo}
                  photoRotation={formData.photoRotation}
                  photoZoom={formData.photoZoom}
                  photoFlipX={formData.photoFlipX}
                  photoPositionX={formData.photoPositionX}
                  photoPositionY={formData.photoPositionY}
                  onPhotoChange={(photoData) => setFormData(prev => ({ ...prev, ...photoData }))}
                />

                {formData.photo && (
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      width: '100%',
                      backgroundColor: colors.primary,
                      color: colors.white,
                      textTransform: 'none',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      height: buttons.primary.height,
                      borderRadius: buttons.primary.borderRadius,
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: colors.primaryHover,
                        boxShadow: 'none',
                      },
                    }}
                    onClick={() => {
                      alert('Foto salva com sucesso!');
                    }}
                  >
                    Salvar Foto
                  </Button>
                )}
              </Box>
            </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />
    </Box>
  );
};

export default UserProfile;
