import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Rotate90DegreesCw, Search } from '@mui/icons-material';
import { FaqButton } from "../components/FaqButton";

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
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

  // Funções para arrastar a foto (mesma lógica do PatientRegister)
  const handlePhotoMouseDown = (e: React.MouseEvent) => {
    if (!formData.photo) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (formData.photoPositionX || 0),
      y: e.clientY - (formData.photoPositionY || 0)
    });
  };

  const handlePhotoMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !formData.photo) return;
    e.preventDefault();

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const maxX = 125;
    const maxY = 125;
    const minX = -125;
    const minY = -125;

    const clampedX = Math.max(minX, Math.min(maxX, newX));
    const clampedY = Math.max(minY, Math.min(maxY, newY));

    setFormData(prev => ({
      ...prev,
      photoPositionX: clampedX,
      photoPositionY: clampedY
    }));
  };

  const handlePhotoMouseUp = () => {
    setIsDragging(false);
  };

  const handlePhotoMouseLeave = () => {
    setIsDragging(false);
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
        <div className="page-header">
          <h1 className="page-title">Meu perfil</h1>
          <FaqButton />
        </div>

        <p className="page-subtitle">Aqui você pode visualizar e alterar os dados de sua conta.</p>

        <div className="user-profile-container">
          {/* Coluna 1: Dados do usuário */}
          <div className="profile-column">
            {/* Seção: Dados do usuário */}
            <div className="profile-section">
              <h3 className="section-title">Dados do usuário</h3>

              {/* Upload de foto */}
              <div className="photo-upload-section">
                <div
                  className="photo-preview-profile"
                  onClick={() => !formData.photo && document.getElementById('profile-photo-upload')?.click()}
                  onMouseMove={handlePhotoMouseMove}
                  onMouseUp={handlePhotoMouseUp}
                  onMouseLeave={handlePhotoMouseLeave}
                >
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt="Foto do perfil"
                      className="profile-photo"
                      style={{
                        transform: `translate(-50%, -50%) translate(${formData.photoPositionX || 0}px, ${formData.photoPositionY || 0}px) rotate(${formData.photoRotation || 0}deg) scale(${formData.photoZoom || 1}) scaleX(${formData.photoFlipX || 1})`,
                        transformOrigin: 'center',
                        transition: isDragging ? 'none' : 'transform 0.3s ease',
                        cursor: isDragging ? 'grabbing' : 'grab'
                      }}
                      onMouseDown={handlePhotoMouseDown}
                      draggable={false}
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (formData.photoZoom === 1) {
                          const containerSize = 150;
                          const imgAspectRatio = img.naturalWidth / img.naturalHeight;

                          let initialScale = 1;
                          if (imgAspectRatio > 1) {
                            initialScale = containerSize / img.naturalWidth;
                          } else {
                            initialScale = containerSize / img.naturalHeight;
                          }

                          setFormData(prev => ({
                            ...prev,
                            photoZoom: initialScale
                          }));
                        }
                      }}
                    />
                  ) : (
                    <div className="no-photo-placeholder-profile">
                      <div className="photo-icon">📷</div>
                      <span>Adicionar foto</span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  id="profile-photo-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData(prev => ({
                          ...prev,
                          photo: event.target?.result as string,
                          photoRotation: 0,
                          photoZoom: 1,
                          photoFlipX: 1,
                          photoPositionX: 0,
                          photoPositionY: 0
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {/* Controles principais */}
                <div className="photo-controls">
                  <button
                    type="button"
                    className="btn-photo-control"
                    onClick={() => document.getElementById('profile-photo-upload')?.click()}
                  >
                    {formData.photo ? 'Alterar' : 'Selecionar'}
                  </button>
                  {formData.photo && (
                    <>
                      <button
                        type="button"
                        className="btn-photo-control btn-remove"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          photo: '',
                          photoRotation: 0,
                          photoZoom: 1,
                          photoFlipX: 1,
                          photoPositionX: 0,
                          photoPositionY: 0
                        }))}
                      >
                        Remover
                      </button>
                    </>
                  )}
                </div>

                {/* Controles de edição */}
                {formData.photo && (
                  <div className="photo-edit-controls-profile">
                    <button
                      type="button"
                      className="btn-photo-edit"
                      title="Girar à esquerda"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        photoRotation: (prev.photoRotation || 0) - 90
                      }))}
                    >
                      <Rotate90DegreesCw fontSize="small" />
                    </button>
                    <button
                      type="button"
                      className="btn-photo-edit"
                      title="Girar à direita"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        photoRotation: (prev.photoRotation || 0) + 90
                      }))}
                    >
                      🔃
                    </button>
                    <button
                      type="button"
                      className="btn-photo-edit"
                      title="Zoom out"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        photoZoom: Math.max(0.5, (prev.photoZoom || 1) - 0.1)
                      }))}
                    >
                      <Search fontSize="small" />
                    </button>
                    <button
                      type="button"
                      className="btn-photo-edit"
                      title="Zoom in"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        photoZoom: Math.min(3, (prev.photoZoom || 1) + 0.1)
                      }))}
                    >
                      🔎
                    </button>
                    <button
                      type="button"
                      className="btn-photo-edit"
                      title="Reset"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        photoRotation: 0,
                        photoZoom: 1,
                        photoFlipX: 1,
                        photoPositionX: 0,
                        photoPositionY: 0
                      }))}
                    >
                      ⚡
                    </button>
                    <button
                      type="button"
                      className="btn-photo-edit"
                      title="Centralizar posição"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        photoPositionX: 0,
                        photoPositionY: 0
                      }))}
                    >
                      🎯
                    </button>
                  </div>
                )}
              </div>

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
            </div>
          </div>

          {/* Coluna 2: Nova senha e Perfis de acesso */}
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

            {/* Seção: Perfis de acesso */}
            <div className="profile-section">
              <h3 className="section-title">Perfis de acesso</h3>
              <p className="section-description">
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

          {/* Coluna 3: Trocar usuário */}
          <div className="profile-column">
            <div className="profile-section">
              <h3 className="section-title">Trocar usuário</h3>

              <form onSubmit={handleChangeEmail}>
                <div className="form-group">
                  <label htmlFor="newEmail">Informe um novo e-mail diferente do anterior</label>
                  <input
                    type="email"
                    id="newEmail"
                    name="newEmail"
                    value={formData.newEmail}
                    onChange={handleInputChange}
                    placeholder="E-mail"
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
