import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { FaqButton } from "../components/FaqButton";
import PhotoUpload from "../components/PhotoUpload";

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
    return <div>Carregando...</div>;
  }

  return (
    <div className="user-profile-page">
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

      <main className="user-profile-main">
        {/* Título da Página */}
        <div className="page-header-container">
          <div className="page-header-content">
            <h1 className="page-header-title">Meu perfil</h1>
            <p className="page-header-description">Aqui você pode visualizar e alterar os dados de sua conta.</p>
          </div>
          <FaqButton />
        </div>

        <div className="user-profile-container">
          {/* Coluna 1: Dados do usuário */}
          <div className="profile-column">
            {/* Seção: Dados do usuário */}
            <div className="profile-section">
              <h3 className="section-title">Dados do usuário</h3>

              {/* Email atual */}
              <div className="form-group">
                <label htmlFor="currentEmail">Seu usuário</label>
                <input
                  type="email"
                  id="currentEmail"
                  name="currentEmail"
                  value={formData.currentEmail}
                  readOnly
                  disabled
                  className="readonly-field"
                />
              </div>

              {/* Seção: Perfis de acesso */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Perfis de acesso</h4>
                <p className="section-description" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Seu usuário tem acesso aos seguintes perfis:
                </p>
                <div className="profiles-list">
                  {userSession?.userProfiles?.map((profile, index) => (
                    <div key={index} className="profile-badge">
                      {profile}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Nova senha e Trocar usuário */}
          <div className="profile-column">
            {/* Seção: Nova senha */}
            <div className="profile-section">
              <h3 className="section-title">Nova senha</h3>
              <p className="section-description">
                Para criar uma nova senha clique no botão abaixo. Uma mensagem será enviada para seu e-mail de cadastro com instruções sobre o procedimento.
              </p>

              <form onSubmit={handleChangePassword}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Prosseguir"}
                </button>
              </form>

              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
            </div>

            {/* Seção: Trocar usuário */}
            <div className="profile-section">
              <h3 className="section-title">Trocar usuário</h3>

              <form onSubmit={handleChangeEmail} autoComplete="off">
                <div className="form-group">
                  <label htmlFor="newEmail">Informe um novo e-mail diferente do anterior</label>
                  <input
                    type="email"
                    id="newEmail"
                    name="newEmail"
                    value={formData.newEmail}
                    onChange={handleInputChange}
                    placeholder="E-mail"
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmEmail">Para sua segurança repita o e-mail informado</label>
                  <input
                    type="email"
                    id="confirmEmail"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    placeholder="E-mail"
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currentPassword">Digite sua antiga senha</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Senha"
                    autoComplete="new-password"
                  />
                </div>

                <p className="section-footer-text">
                  Uma mensagem será enviada para seu novo e-mail de cadastro com instruções sobre o procedimento.
                </p>

                <button
                  type="submit"
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Prosseguir"}
                </button>
              </form>
            </div>
          </div>

          {/* Coluna 3: Foto do perfil */}
          <div className="profile-column">
            <div className="profile-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 className="section-title" style={{ alignSelf: 'flex-start' }}>Foto do perfil</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
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
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ marginTop: '1rem', width: '100%' }}
                    onClick={() => {
                      // Aqui você implementaria a lógica de salvar a foto no backend
                      alert('Foto salva com sucesso!');
                    }}
                  >
                    Salvar Foto
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />
    </div>
  );
};

export default UserProfile;
