import React, { useState, useEffect } from "react";
import "./PatientRegister.css";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";

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
}

interface PatientFormData {
  id?: string;
  name: string;
  isResponsible: boolean;
  phone: string;
  cep: string;
  documentType: string;
  document: string;
  email: string;
  responsibleName: string;
  address: string;
  number: string;
  expeditorOrgan: string;
  birthDate: string;
  responsibleDocumentType: string;
  responsibleDocument: string;
  complement: string;
  neighborhood: string;
  gender: string;
  kinship: string;
  responsiblePhone: string;
  city: string;
  uf: string;
  nativeLanguage: string;
  originCountry: string;
  responsibleEmail: string;
  isComplete: boolean;
  observations: string;
  referredBy: string;
  entryChannel: string;
  photo?: string;
  photoRotation?: number;
  photoZoom?: number;
  photoFlipX?: number;
  photoPositionX?: number;
  photoPositionY?: number;
  responsible2Name: string;
  responsible2DocumentType: string;
  responsible2Document: string;
  responsible2Kinship: string;
  responsible2Phone: string;
  responsible2Email: string;
  responsibleFinancial: boolean;
  responsible2Financial: boolean;
}

const PatientRegister: React.FC = () => {
  const { goToPatients, goToDashboard, goToSchedule } = useNavigation();
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    isResponsible: false,
    phone: "",
    cep: "",
    documentType: "CPF",
    document: "",
    email: "",
    responsibleName: "",
    address: "",
    number: "",
    expeditorOrgan: "",
    birthDate: "",
    responsibleDocumentType: "CPF",
    responsibleDocument: "",
    complement: "",
    neighborhood: "",
    gender: "",
    kinship: "",
    responsiblePhone: "",
    city: "",
    uf: "",
    nativeLanguage: "Português",
    originCountry: "Brasil",
    responsibleEmail: "",
    isComplete: false,
    observations: "",
    referredBy: "",
    entryChannel: "",
    responsible2Name: "",
    responsible2DocumentType: "CPF",
    responsible2Document: "",
    responsible2Kinship: "",
    responsible2Phone: "",
    responsible2Email: "",
    responsibleFinancial: false,
    responsible2Financial: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('cadastro');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cepLoading, setCepLoading] = useState(false);

  // Limpar campo "Indicado por" quando canal não for indicação
  useEffect(() => {
    if (formData.entryChannel && !formData.entryChannel.includes('Indicação')) {
      setFormData(prev => ({ ...prev, referredBy: '' }));
    }
  }, [formData.entryChannel]);

  // Simulação de carregamento da sessão do usuário
  useEffect(() => {
    document.title = "Clinic4Us - Cadastro de Paciente";

    const simulatedUserSession: UserSession = {
      email: "user@clinic4us.com",
      alias: "User Demo",
      clinicName: "Clínica Demo",
      role: "Professional",
      permissions: ["view_schedule", "manage_appointments"],
      menuItems: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Agenda", href: "/schedule" },
        { label: "Pacientes", href: "/patients" },
        { label: "Relatórios", href: "/reports" }
      ],
      loginTime: new Date().toISOString()
    };

    setUserSession(simulatedUserSession);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue: any = value;

    // Handle boolean fields that come as strings from radio buttons
    if (name === 'isResponsible' || name === 'isComplete') {
      processedValue = value === 'true';
    } else if (type === 'checkbox') {
      processedValue = checked;
    }

    // Handle mutual exclusion for financial responsible checkboxes
    if (name === 'responsibleFinancial' || name === 'responsible2Financial') {
      if (checked) {
        // If checking one, uncheck the other
        setFormData(prev => ({
          ...prev,
          [name]: true,
          // Uncheck the other financial responsible
          ...(name === 'responsibleFinancial'
            ? { responsible2Financial: false }
            : { responsibleFinancial: false })
        }));
      } else {
        // If unchecking, just update the current field
        setFormData(prev => ({
          ...prev,
          [name]: false
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';

    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} ano${years !== 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mês${months !== 1 ? 'es' : ''}`);
    if (days > 0) parts.push(`${days} dia${days !== 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : '0 dias';
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      return;
    }

    setCepLoading(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          uf: data.uf || ''
        }));
      } else {
        alert('CEP não encontrado. Verifique o código digitado.');
      }
    } catch (error) {
      alert('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setCepLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.document.trim()) {
      newErrors.document = "Documento é obrigatório";
    } else if (formData.document.replace(/\D/g, '').length < 11) {
      newErrors.document = "Documento deve ter pelo menos 11 dígitos";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    }

    if (formData.isResponsible === undefined || formData.isResponsible === null) {
      newErrors.isResponsible = "Deve informar se é o próprio responsável";
    }

    // Validação de contato - obrigatório se for o próprio responsável
    if (formData.isResponsible) {
      if (!formData.phone.trim()) {
        newErrors.phone = "Telefone é obrigatório quando é o próprio responsável";
      } else if (formData.phone.replace(/\D/g, '').length < 10) {
        newErrors.phone = "Telefone deve ter pelo menos 10 dígitos";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email é obrigatório quando é o próprio responsável";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email deve ter um formato válido";
      }
    } else {
      // Validação opcional se não for o próprio responsável
      if (formData.phone.trim() && formData.phone.replace(/\D/g, '').length < 10) {
        newErrors.phone = "Telefone deve ter pelo menos 10 dígitos";
      }

      if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email deve ter um formato válido";
      }
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

    try {
      // Criar a foto cortada se existir uma foto
      let finalFormData = { ...formData };
      if (formData.photo) {
        const croppedPhoto = await createCroppedPhoto();
        finalFormData = {
          ...formData,
          photo: croppedPhoto
        };
      }

      // Aqui seria feita a integração com a API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API call

      console.log("Paciente salvo:", finalFormData);
      goToPatients();
    } catch (error) {
      setErrors({ general: "Erro ao salvar paciente. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    goToPatients();
  };

  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'cadastro', label: 'Cadastro', enabled: true },
      { id: 'resumo', label: 'Resumo', enabled: true },
      { id: 'anotacoes', label: 'Anotações', enabled: true },
      { id: 'agenda', label: 'Agenda', enabled: true },
      { id: 'diagnostico', label: 'Diagnóstico', enabled: true },
      { id: 'avaliacoes', label: 'Avaliações', enabled: true },
      { id: 'plano-terap', label: 'Plano Terap', enabled: true },
      { id: 'evolucoes', label: 'Evoluções', enabled: true },
      { id: 'financeiro', label: 'Financeiro', enabled: true },
      { id: 'receituario', label: 'Receituário', enabled: true },
      { id: 'arquivos', label: 'Arquivos', enabled: true }
    ];

    // Filter tabs based on user permissions
    const userPermissions = userSession?.permissions || [];
    return allTabs.filter(tab => {
      if (tab.id === 'cadastro') return true; // Always show cadastro
      if (tab.id === 'resumo') return true;
      if (tab.id === 'financeiro') return userPermissions.includes('manage_finances') || true; // Allow for demo
      if (tab.id === 'receituario') return userPermissions.includes('manage_prescriptions') || true; // Allow for demo
      return true;
    });
  };

  const handleTabChange = (tabId: string) => {
    const availableTabs = getAvailableTabs();
    const tab = availableTabs.find(t => t.id === tabId);
    if (tab && tab.enabled) {
      setActiveTab(tabId);
    }
  };

  const handleSearchPatient = () => {
    // Simular busca por paciente existente
    const searchName = formData.name.toLowerCase();
    if (searchName.includes('joão') || searchName.includes('joao')) {
      // Simular dados de paciente existente
      setFormData(prev => ({
        ...prev,
        id: '12345',
        name: 'João Silva Santos',
        phone: '(11) 99999-9999',
        document: '123.456.789-00',
        email: 'joao@email.com',
        birthDate: '1990-05-15',
        isComplete: true
      }));
      setIsEditing(true);
    }
  };

  if (!userSession) {
    return <div>Carregando...</div>;
  }

  const loggedMenuItems = [
    { label: "Dashboard", href: "#", onClick: () => goToDashboard() },
    { label: "Agenda", href: "#", onClick: () => goToSchedule() },
    { label: "Pacientes", href: "#", onClick: () => goToPatients() },
    { label: "Relatórios", href: "#", onClick: () => alert("Funcionalidade em desenvolvimento") }
  ];

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

  // Funções para arrastar a foto
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

    // Limitar o movimento dentro da área do preview (250x250px)
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

  // Função para criar a foto cortada no tamanho do preview
  const createCroppedPhoto = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!formData.photo) {
        resolve('');
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(formData.photo);
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Definir o tamanho do canvas como o tamanho do preview (250x250)
        canvas.width = 250;
        canvas.height = 250;

        // Calcular as transformações
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Aplicar as transformações no contexto do canvas
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.translate(formData.photoPositionX || 0, formData.photoPositionY || 0);
        ctx.rotate((formData.photoRotation || 0) * Math.PI / 180);
        ctx.scale(formData.photoZoom || 1, (formData.photoZoom || 1) * (formData.photoFlipX || 1));

        // Desenhar a imagem centralizada
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2, img.naturalWidth, img.naturalHeight);
        ctx.restore();

        // Converter para base64
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(croppedDataUrl);
      };

      img.src = formData.photo;
    });
  };

  return (
    <div className="patient-register-page">
      <HeaderInternal
        menuItems={userSession.menuItems}
        loggedMenuItems={loggedMenuItems}
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

      <main className="patient-register-main">
        {/* Tabs de navegação */}
        <div className="patient-tabs-container">
          <div className="patient-tabs">
            {getAvailableTabs().map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${!tab.enabled ? 'disabled' : ''}`}
                data-tab={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={!tab.enabled}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="patient-register-container">
          {/* Conteúdo da aba ativa */}
          <div className="tab-content">
            {activeTab === 'cadastro' && (
              <form onSubmit={handleSubmit} className="patient-register-form">
                {/* Seção: Dados Pessoais */}
                <div className="personal-data-layout">
                    {/* Seção de Upload de Foto */}
                    <div className="photo-upload-container">
                      <div className="photo-upload-component">
                        <div
                          className="photo-preview"
                          onClick={() => !formData.photo && document.getElementById('photo-upload')?.click()}
                          onMouseMove={handlePhotoMouseMove}
                          onMouseUp={handlePhotoMouseUp}
                          onMouseLeave={handlePhotoMouseLeave}
                        >
                          {formData.photo ? (
                            <img
                              src={formData.photo}
                              alt="Foto do paciente"
                              className="patient-photo"
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

                                // Only set initial scale if it's not already set
                                if (formData.photoZoom === undefined) {
                                  const containerWidth = 250;
                                  const containerHeight = 250;
                                  const imgAspectRatio = img.naturalWidth / img.naturalHeight;
                                  const containerAspectRatio = containerWidth / containerHeight;

                                  let initialScale = 1;
                                  if (imgAspectRatio > containerAspectRatio) {
                                    // Image is wider than container - scale to fit width
                                    initialScale = containerWidth / img.naturalWidth;
                                  } else {
                                    // Image is taller than container - scale to fit height
                                    initialScale = containerHeight / img.naturalHeight;
                                  }

                                  // Set initial scale to fit the image in the container while preserving aspect ratio
                                  setFormData(prev => ({
                                    ...prev,
                                    photoZoom: initialScale
                                  }));
                                }
                              }}
                            />
                          ) : (
                            <div className="no-photo-placeholder">
                              <div className="photo-icon">📷</div>
                              <span>Clique para adicionar foto</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="photo-upload"
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
                                  photoZoom: undefined, // Will be set by onLoad
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
                        <div className="photo-main-controls">
                          <button
                            type="button"
                            className="btn-photo-main"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                          >
                            {formData.photo ? 'Alterar' : 'Selecionar'}
                          </button>
                          {formData.photo && (
                            <button
                              type="button"
                              className="btn-photo-main btn-remove"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                photo: '',
                                photoRotation: 0,
                                photoZoom: 1,
                                photoFlipX: 1,
                                photoPositionX: 0,
                                photoPositionY: 0
                              }))}
                              title="Remover foto"
                            >
                              Remover
                            </button>
                          )}
                        </div>

                        {/* Controles de edição */}
                        {formData.photo && (
                          <div className="photo-edit-controls">
                            <div className="edit-control-row">
                              <button
                                type="button"
                                className="btn-photo-edit-small"
                                title="Girar à esquerda"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  photoRotation: (prev.photoRotation || 0) - 90
                                }))}
                              >
                                🔄
                              </button>
                              <button
                                type="button"
                                className="btn-photo-edit-small"
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
                                className="btn-photo-edit-small"
                                title="Zoom out"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  photoZoom: Math.max(0.5, (prev.photoZoom || 1) - 0.1)
                                }))}
                              >
                                🔍
                              </button>
                              <button
                                type="button"
                                className="btn-photo-edit-small"
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
                                className="btn-photo-edit-small"
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
                                className="btn-photo-edit-small"
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
                          </div>
                        )}

                        <div className="photo-instructions">
                          <small>JPG, PNG, GIF • Max 5MB</small>
                          {formData.photo && (
                            <>
                              <small>🖱️ Arraste a foto para posicioná-la</small>
                              <small>📐 A foto será cortada no tamanho do preview ao salvar</small>
                            </>
                          )}
                        </div>

                        {/* Mini Dashboard de Presenças */}
                        <div className="mini-dashboard">
                          <h4 className="dashboard-title">📊 Resumo de Presenças</h4>

                          <div className="dashboard-item">
                            <span className="dashboard-label">📅 Última presença:</span>
                            <span className="dashboard-value">15/03/2024</span>
                          </div>

                          <div className="dashboard-section">
                            <h5 className="dashboard-subtitle">📈 Total Geral</h5>
                            <div className="dashboard-stats">
                              <div className="stat-item stat-present">
                                <span className="stat-number">42</span>
                                <span className="stat-label">Presenças</span>
                              </div>
                              <div className="stat-item stat-absent">
                                <span className="stat-number">3</span>
                                <span className="stat-label">Faltas</span>
                              </div>
                              <div className="stat-item stat-cancelled">
                                <span className="stat-number">1</span>
                                <span className="stat-label">Cancelam.</span>
                              </div>
                            </div>
                          </div>

                          <div className="dashboard-section">
                            <h5 className="dashboard-subtitle">📅 Últimos 30 dias</h5>
                            <div className="dashboard-stats">
                              <div className="stat-item stat-present">
                                <span className="stat-number">12</span>
                                <span className="stat-label">Presenças</span>
                              </div>
                              <div className="stat-item stat-absent">
                                <span className="stat-number">1</span>
                                <span className="stat-label">Faltas</span>
                              </div>
                              <div className="stat-item stat-cancelled">
                                <span className="stat-number">0</span>
                                <span className="stat-label">Cancelam.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Seção de Campos */}
                    <div className="personal-data-fields">
                      {/* Primeira linha: Nome, Data de Nascimento + Idade, Gênero */}
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="name">Nome Completo*</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nome completo do paciente"
                          />
                        </div>
                        <div className="form-group birth-age-group">
                          <div className="birth-age-container">
                            <div className="form-subgroup">
                              <label htmlFor="birthDate">Data de Nascimento*</label>
                              <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="form-subgroup">
                              <label htmlFor="age">Idade</label>
                              <input
                                type="text"
                                id="age"
                                name="age"
                                value={calculateAge(formData.birthDate)}
                                readOnly
                                disabled
                                placeholder="Calculado automaticamente"
                                className="age-field"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="gender">Gênero*</label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                          >
                            <option value="">Selecione o gênero</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                          </select>
                        </div>
                      </div>

                      {/* Segunda linha: Documento (Tipo + Número), Órgão Expedidor */}
                      <div className="form-row">
                        <div className="form-group document-type-number">
                          <div className="document-container">
                            <div className="form-subgroup">
                              <label htmlFor="documentType">Tipo de Documento*</label>
                              <select
                                id="documentType"
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleInputChange}
                                className="document-type-input"
                              >
                                <option value="CPF">CPF</option>
                                <option value="RG">RG</option>
                                <option value="CNH">CNH</option>
                                <option value="Passaporte">Passaporte</option>
                              </select>
                            </div>
                            <div className="form-subgroup">
                              <label htmlFor="document">Documento*</label>
                              <input
                                type="text"
                                id="document"
                                name="document"
                                value={formData.document}
                                onChange={handleInputChange}
                                placeholder="000.000.000-00"
                                className="document-number-input"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="expeditorOrgan">Órgão Expedidor</label>
                          <input
                            type="text"
                            id="expeditorOrgan"
                            name="expeditorOrgan"
                            value={formData.expeditorOrgan}
                            onChange={handleInputChange}
                            placeholder="SSP, DETRAN, etc."
                          />
                        </div>
                        <div className="form-group country-language">
                          <div className="country-language-container">
                            <div className="form-subgroup">
                              <label htmlFor="originCountry">País de Origem*</label>
                              <select
                                id="originCountry"
                                name="originCountry"
                                value={formData.originCountry}
                                onChange={handleInputChange}
                                className="country-input"
                              >
                                <option value="Brasil">Brasil</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Estados Unidos">Estados Unidos</option>
                              </select>
                            </div>
                            <div className="form-subgroup">
                              <label htmlFor="nativeLanguage">Idioma Nativo*</label>
                              <select
                                id="nativeLanguage"
                                name="nativeLanguage"
                                value={formData.nativeLanguage}
                                onChange={handleInputChange}
                                className="language-input"
                              >
                                <option value="Português">Português</option>
                                <option value="Inglês">Inglês</option>
                                <option value="Espanhol">Espanhol</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Terceira linha: Responsabilidade, Telefone + Email */}
                      <div className="form-row">
                        <div className="form-group">
                          <label>É o próprio responsável?*</label>
                          <div className="radio-group">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="isResponsible"
                                value="true"
                                checked={formData.isResponsible === true}
                                onChange={(e) => handleInputChange({
                                  ...e,
                                  target: { ...e.target, name: 'isResponsible', value: 'true' }
                                })}
                              />
                              <span>Sim</span>
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="isResponsible"
                                value="false"
                                checked={formData.isResponsible === false}
                                onChange={(e) => handleInputChange({
                                  ...e,
                                  target: { ...e.target, name: 'isResponsible', value: 'false' }
                                })}
                              />
                              <span>Não</span>
                            </label>
                          </div>
                          {errors.isResponsible && <span className="error-message">{errors.isResponsible}</span>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">
                            Telefone (Whatsapp){formData.isResponsible ? '*' : ''}
                          </label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formatPhone(formData.phone)}
                            onChange={(e) => handleInputChange({
                              ...e,
                              target: { ...e.target, value: e.target.value.replace(/\D/g, '') }
                            })}
                            placeholder="(11) 99999-9999"
                            maxLength={15}
                            className={errors.phone ? 'error' : ''}
                          />
                          {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">
                            E-mail{formData.isResponsible ? '*' : ''}
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="email@exemplo.com"
                            className={errors.email ? 'error' : ''}
                          />
                          {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                      </div>

                      {/* Responsáveis (condicional) */}
                      {!formData.isResponsible && (
                        <>
                          <div className="responsible-divider">
                            <h4>Responsáveis</h4>
                          </div>
                          {/* 1º Responsável */}
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="responsibleName">Nome Completo (1º Resp)*</label>
                              <input
                                type="text"
                                id="responsibleName"
                                name="responsibleName"
                                value={formData.responsibleName}
                                onChange={handleInputChange}
                                placeholder="Nome completo do responsável"
                              />
                            </div>
                            <div className="form-group cpf-financial-group">
                              <div className="cpf-financial-container">
                                <div className="form-subgroup">
                                  <label htmlFor="responsibleDocument">CPF</label>
                                  <input
                                    type="text"
                                    id="responsibleDocument"
                                    name="responsibleDocument"
                                    value={formData.responsibleDocument}
                                    onChange={handleInputChange}
                                    placeholder="000.000.000-00"
                                  />
                                </div>
                                <div className="form-subgroup checkbox-subgroup">
                                  <label className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      name="responsibleFinancial"
                                      checked={formData.responsibleFinancial}
                                      onChange={handleInputChange}
                                    />
                                    Resp. Financeiro
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-group phone-email">
                              <div className="phone-email-container">
                                <div className="form-subgroup">
                                  <label htmlFor="responsiblePhone">Telefone (Whatsapp)</label>
                                  <input
                                    type="text"
                                    id="responsiblePhone"
                                    name="responsiblePhone"
                                    value={formatPhone(formData.responsiblePhone)}
                                    onChange={(e) => handleInputChange({
                                      ...e,
                                      target: { ...e.target, value: e.target.value.replace(/\D/g, '') }
                                    })}
                                    placeholder="(11) 99999-9999"
                                    maxLength={15}
                                  />
                                </div>
                                <div className="form-subgroup">
                                  <label htmlFor="responsibleEmail">E-mail</label>
                                  <input
                                    type="email"
                                    id="responsibleEmail"
                                    name="responsibleEmail"
                                    value={formData.responsibleEmail}
                                    onChange={handleInputChange}
                                    placeholder="email@exemplo.com"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2º Responsável */}
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="responsible2Name">Nome Completo (2º Resp)</label>
                              <input
                                type="text"
                                id="responsible2Name"
                                name="responsible2Name"
                                value={formData.responsible2Name}
                                onChange={handleInputChange}
                                placeholder="Nome completo do 2º responsável"
                              />
                            </div>
                            <div className="form-group cpf-financial-group">
                              <div className="cpf-financial-container">
                                <div className="form-subgroup">
                                  <label htmlFor="responsible2Document">CPF</label>
                                  <input
                                    type="text"
                                    id="responsible2Document"
                                    name="responsible2Document"
                                    value={formData.responsible2Document}
                                    onChange={handleInputChange}
                                    placeholder="000.000.000-00"
                                  />
                                </div>
                                <div className="form-subgroup checkbox-subgroup">
                                  <label className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      name="responsible2Financial"
                                      checked={formData.responsible2Financial}
                                      onChange={handleInputChange}
                                    />
                                    Resp. Financeiro
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-group phone-email">
                              <div className="phone-email-container">
                                <div className="form-subgroup">
                                  <label htmlFor="responsible2Phone">Telefone (Whatsapp)</label>
                                  <input
                                    type="text"
                                    id="responsible2Phone"
                                    name="responsible2Phone"
                                    value={formatPhone(formData.responsible2Phone)}
                                    onChange={(e) => handleInputChange({
                                      ...e,
                                      target: { ...e.target, value: e.target.value.replace(/\D/g, '') }
                                    })}
                                    placeholder="(11) 99999-9999"
                                    maxLength={15}
                                  />
                                </div>
                                <div className="form-subgroup">
                                  <label htmlFor="responsible2Email">E-mail</label>
                                  <input
                                    type="email"
                                    id="responsible2Email"
                                    name="responsible2Email"
                                    value={formData.responsible2Email}
                                    onChange={handleInputChange}
                                    placeholder="email@exemplo.com"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Seção: Endereço */}
                      <div className="responsible-divider">
                        <h4>Endereço</h4>
                      </div>

                      {/* CEP e Logradouro na primeira linha */}
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="cep">CEP*</label>
                          <div className="cep-input-container">
                            <input
                              type="text"
                              id="cep"
                              name="cep"
                              value={formatCep(formData.cep)}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const cep = rawValue.replace(/\D/g, '');

                                // Permitir apenas 8 dígitos
                                if (cep.length <= 8) {
                                  setFormData(prev => ({
                                    ...prev,
                                    cep: cep
                                  }));

                                  // Auto-busca quando CEP completo
                                  if (cep.length === 8) {
                                    handleCepSearch(cep);
                                  }
                                }
                              }}
                              placeholder="00000-000"
                              maxLength={9}
                            />
                            {cepLoading && <span className="cep-loading">🔍</span>}
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="address">Logradouro*</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Rua, Avenida, etc."
                          />
                        </div>
                        <div className="form-group address-number-complement">
                          <div className="number-complement-container">
                            <div className="form-subgroup">
                              <label htmlFor="number">Número*</label>
                              <input
                                type="text"
                                id="number"
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                placeholder="123"
                                className="number-input"
                              />
                            </div>
                            <div className="form-subgroup">
                              <label htmlFor="complement">Complemento</label>
                              <input
                                type="text"
                                id="complement"
                                name="complement"
                                value={formData.complement}
                                onChange={handleInputChange}
                                placeholder="Apto, Bloco, etc."
                                className="complement-input"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bairro, Cidade, UF */}
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="neighborhood">Bairro*</label>
                          <input
                            type="text"
                            id="neighborhood"
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            placeholder="Nome do bairro"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="city">Cidade*</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Nome da cidade"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="uf">UF*</label>
                          <select
                            id="uf"
                            name="uf"
                            value={formData.uf}
                            onChange={handleInputChange}
                          >
                            <option value="">Selecione</option>
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AP">AP</option>
                            <option value="AM">AM</option>
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option>
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option>
                            <option value="MT">MT</option>
                            <option value="MS">MS</option>
                            <option value="MG">MG</option>
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PR">PR</option>
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="RJ">RJ</option>
                            <option value="RN">RN</option>
                            <option value="RS">RS</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="SC">SC</option>
                            <option value="SP">SP</option>
                            <option value="SE">SE</option>
                            <option value="TO">TO</option>
                          </select>
                        </div>
                      </div>

                      {/* Observações ocupando 3 colunas dentro da seção de endereço */}
                      <div className="responsible-divider">
                        <h4>Observações</h4>
                      </div>

                      <div className="form-row">
                        <div className="form-group observations-group">
                          <label htmlFor="observations">Observações Gerais</label>
                          <textarea
                            id="observations"
                            name="observations"
                            value={formData.observations}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Observações importantes sobre o paciente, medicações, alergias, etc."
                            className="observations-textarea"
                          />
                        </div>
                      </div>

                      {/* Linha com 3 colunas: Canal de entrada, Indicado por e Status + Botões */}
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="entryChannel">Canal de entrada</label>
                          <select
                            id="entryChannel"
                            name="entryChannel"
                            value={formData.entryChannel}
                            onChange={handleInputChange}
                          >
                            <option value="">Selecione</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Google">Google</option>
                            <option value="Site">Site</option>
                            <option value="Indicação profissional">Indicação profissional</option>
                            <option value="Indicação de conhecido">Indicação de conhecido</option>
                            <option value="Outros">Outros</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="referredBy">Indicado por</label>
                          <input
                            type="text"
                            id="referredBy"
                            name="referredBy"
                            value={formData.referredBy || ''}
                            onChange={handleInputChange}
                            placeholder="Nome da pessoa ou instituição que indicou o paciente"
                            disabled={!formData.entryChannel.includes('Indicação')}
                          />
                        </div>
                        <div className="form-group">
                          <label>Status do Cadastro</label>
                          <div className="radio-group">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="isComplete"
                                value="true"
                                checked={formData.isComplete === true}
                                onChange={(e) => handleInputChange({
                                  ...e,
                                  target: { ...e.target, name: 'isComplete', value: 'true' }
                                })}
                              />
                              <span>Completo</span>
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="isComplete"
                                value="false"
                                checked={formData.isComplete === false}
                                onChange={(e) => handleInputChange({
                                  ...e,
                                  target: { ...e.target, name: 'isComplete', value: 'false' }
                                })}
                              />
                              <span>Incompleto</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Linha demarcatória turquesa entre observações e botões */}
                      <div className="form-divider-line"></div>

                      {/* Nova linha com 3 colunas para os botões */}
                      <div className="form-row">
                        <div className="form-group">
                          {/* Primeira coluna vazia */}
                        </div>
                        <div className="form-group">
                          {/* Segunda coluna vazia */}
                        </div>
                        <div className="form-group">
                          <div className="form-actions-inline">
                            <button
                              type="button"
                              className="btn-cancel-form-small"
                              onClick={handleCancel}
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="btn-save-small"
                              disabled={isLoading}
                            >
                              {isLoading ? "Salvando..." : "Salvar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </form>
            )}

            {/* Conteúdo da aba Resumo */}
            {activeTab === 'resumo' && (
              <div className="tab-content-section">
                <h3>Resumo do Paciente</h3>
                <div className="resume-cards">
                  <div className="resume-card">
                    <h4>Dados Pessoais</h4>
                    <p><strong>Nome:</strong> {formData.name || 'Não informado'}</p>
                    <p><strong>Data de Nascimento:</strong> {formData.birthDate || 'Não informado'}</p>
                    <p><strong>Gênero:</strong> {formData.gender || 'Não informado'}</p>
                    <p><strong>Documento:</strong> {formData.document || 'Não informado'}</p>
                  </div>
                  <div className="resume-card">
                    <h4>Contato</h4>
                    <p><strong>Telefone:</strong> {formData.phone || 'Não informado'}</p>
                    <p><strong>Email:</strong> {formData.email || 'Não informado'}</p>
                    <p><strong>Endereço:</strong> {formData.address || 'Não informado'}</p>
                  </div>
                  <div className="resume-card">
                    <h4>Status do Cadastro</h4>
                    <p><strong>Completo:</strong> {formData.isComplete ? 'Sim' : 'Não'}</p>
                    <p><strong>Responsável:</strong> {formData.isResponsible ? 'Próprio paciente' : 'Terceiro'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Anotações */}
            {activeTab === 'anotacoes' && (
              <div className="tab-content-section">
                <h3>Anotações do Paciente</h3>
                <div className="notes-section">
                  <div className="notes-toolbar">
                    <button className="btn-add-note">+ Nova Anotação</button>
                    <select className="notes-filter">
                      <option>Todas as anotações</option>
                      <option>Consultas</option>
                      <option>Observações</option>
                      <option>Exames</option>
                    </select>
                  </div>
                  <div className="notes-list">
                    <div className="note-item">
                      <div className="note-header">
                        <span className="note-date">15/03/2024 - 14:30</span>
                        <span className="note-type">Consulta</span>
                      </div>
                      <p className="note-content">Paciente apresentou melhora significativa nos sintomas após início do tratamento.</p>
                      <div className="note-footer">
                        <span className="note-author">Dr. João Silva</span>
                      </div>
                    </div>
                    <div className="note-item">
                      <div className="note-header">
                        <span className="note-date">08/03/2024 - 09:15</span>
                        <span className="note-type">Observação</span>
                      </div>
                      <p className="note-content">Paciente relatou dificuldades para dormir. Recomendado ajuste na medicação.</p>
                      <div className="note-footer">
                        <span className="note-author">Dr. João Silva</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Agenda */}
            {activeTab === 'agenda' && (
              <div className="tab-content-section">
                <h3>Agenda do Paciente</h3>
                <div className="agenda-section">
                  <div className="agenda-toolbar">
                    <button className="btn-schedule">+ Agendar Consulta</button>
                    <div className="agenda-filters">
                      <select>
                        <option>Próximos 30 dias</option>
                        <option>Próximos 7 dias</option>
                        <option>Histórico</option>
                      </select>
                    </div>
                  </div>
                  <div className="appointments-list">
                    <div className="appointment-item future">
                      <div className="appointment-time">
                        <span className="date">22/03/2024</span>
                        <span className="time">14:00 - 15:00</span>
                      </div>
                      <div className="appointment-details">
                        <h4>Consulta de Retorno</h4>
                        <p>Dr. João Silva - Cardiologia</p>
                        <span className="status confirmed">Confirmada</span>
                      </div>
                      <div className="appointment-actions">
                        <button className="btn-edit">Editar</button>
                        <button className="btn-cancel">Cancelar</button>
                      </div>
                    </div>
                    <div className="appointment-item past">
                      <div className="appointment-time">
                        <span className="date">15/03/2024</span>
                        <span className="time">14:00 - 15:00</span>
                      </div>
                      <div className="appointment-details">
                        <h4>Consulta Inicial</h4>
                        <p>Dr. João Silva - Cardiologia</p>
                        <span className="status completed">Realizada</span>
                      </div>
                      <div className="appointment-actions">
                        <button className="btn-view">Ver Detalhes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Diagnóstico */}
            {activeTab === 'diagnostico' && (
              <div className="tab-content-section">
                <h3>Diagnósticos</h3>
                <div className="diagnosis-section">
                  <div className="diagnosis-toolbar">
                    <button className="btn-add-diagnosis">+ Novo Diagnóstico</button>
                  </div>
                  <div className="diagnosis-list">
                    <div className="diagnosis-item">
                      <div className="diagnosis-header">
                        <span className="diagnosis-code">I10</span>
                        <span className="diagnosis-date">15/03/2024</span>
                      </div>
                      <h4>Hipertensão arterial essencial</h4>
                      <p className="diagnosis-description">Hipertensão arterial sistêmica de causa primária, sem complicações.</p>
                      <div className="diagnosis-footer">
                        <span className="diagnosis-status active">Ativo</span>
                        <span className="diagnosis-doctor">Dr. João Silva</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Avaliações */}
            {activeTab === 'avaliacoes' && (
              <div className="tab-content-section">
                <h3>Avaliações</h3>
                <div className="evaluations-section">
                  <div className="evaluations-toolbar">
                    <button className="btn-new-evaluation">+ Nova Avaliação</button>
                    <select className="evaluation-type-filter">
                      <option>Todos os tipos</option>
                      <option>Avaliação Inicial</option>
                      <option>Reavaliação</option>
                      <option>Avaliação Especializada</option>
                    </select>
                  </div>
                  <div className="evaluations-list">
                    <div className="evaluation-item">
                      <div className="evaluation-header">
                        <h4>Avaliação Cardiológica Inicial</h4>
                        <span className="evaluation-date">15/03/2024</span>
                      </div>
                      <p className="evaluation-summary">Avaliação inicial completa com ECG e ecocardiograma.</p>
                      <div className="evaluation-footer">
                        <span className="evaluation-status completed">Concluída</span>
                        <button className="btn-view-evaluation">Ver Detalhes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Plano Terapêutico */}
            {activeTab === 'plano-terap' && (
              <div className="tab-content-section">
                <h3>Plano Terapêutico</h3>
                <div className="therapy-plan-section">
                  <div className="therapy-toolbar">
                    <button className="btn-new-plan">+ Novo Plano</button>
                  </div>
                  <div className="therapy-plans">
                    <div className="therapy-plan-item">
                      <div className="plan-header">
                        <h4>Plano de Tratamento Cardiovascular</h4>
                        <span className="plan-period">15/03/2024 - 15/06/2024</span>
                      </div>
                      <div className="plan-objectives">
                        <h5>Objetivos:</h5>
                        <ul>
                          <li>Controle da pressão arterial</li>
                          <li>Redução do peso em 5kg</li>
                          <li>Melhora da capacidade cardiovascular</li>
                        </ul>
                      </div>
                      <div className="plan-interventions">
                        <h5>Intervenções:</h5>
                        <ul>
                          <li>Medicação anti-hipertensiva</li>
                          <li>Dieta com restrição de sódio</li>
                          <li>Atividade física supervisionada</li>
                        </ul>
                      </div>
                      <div className="plan-status">
                        <span className="status active">Em Andamento</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Evoluções */}
            {activeTab === 'evolucoes' && (
              <div className="tab-content-section">
                <h3>Evoluções</h3>
                <div className="evolution-section">
                  <div className="evolution-toolbar">
                    <button className="btn-new-evolution">+ Nova Evolução</button>
                  </div>
                  <div className="evolution-timeline">
                    <div className="evolution-item">
                      <div className="evolution-date">22/03/2024</div>
                      <div className="evolution-content">
                        <h4>Evolução - Consulta de Retorno</h4>
                        <p>Paciente apresenta melhora significativa. PA: 130/80 mmHg. Mantém medicação atual.</p>
                        <span className="evolution-author">Dr. João Silva</span>
                      </div>
                    </div>
                    <div className="evolution-item">
                      <div className="evolution-date">15/03/2024</div>
                      <div className="evolution-content">
                        <h4>Evolução - Consulta Inicial</h4>
                        <p>Paciente inicia tratamento para hipertensão. Orientações sobre dieta e exercícios.</p>
                        <span className="evolution-author">Dr. João Silva</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Financeiro */}
            {activeTab === 'financeiro' && (
              <div className="tab-content-section">
                <h3>Financeiro</h3>
                <div className="financial-section">
                  <div className="financial-summary">
                    <div className="financial-card">
                      <h4>Total Pendente</h4>
                      <span className="amount pending">R$ 850,00</span>
                    </div>
                    <div className="financial-card">
                      <h4>Total Pago</h4>
                      <span className="amount paid">R$ 1.200,00</span>
                    </div>
                  </div>
                  <div className="financial-transactions">
                    <h4>Transações</h4>
                    <div className="transaction-item">
                      <div className="transaction-date">22/03/2024</div>
                      <div className="transaction-description">Consulta Cardiologia</div>
                      <div className="transaction-amount pending">R$ 200,00</div>
                      <div className="transaction-status">Pendente</div>
                    </div>
                    <div className="transaction-item">
                      <div className="transaction-date">15/03/2024</div>
                      <div className="transaction-description">Consulta Inicial</div>
                      <div className="transaction-amount paid">R$ 200,00</div>
                      <div className="transaction-status">Pago</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Receituário */}
            {activeTab === 'receituario' && (
              <div className="tab-content-section">
                <h3>Receituário</h3>
                <div className="prescription-section">
                  <div className="prescription-toolbar">
                    <button className="btn-new-prescription">+ Nova Receita</button>
                  </div>
                  <div className="prescriptions-list">
                    <div className="prescription-item">
                      <div className="prescription-header">
                        <h4>Receita #001</h4>
                        <span className="prescription-date">15/03/2024</span>
                      </div>
                      <div className="prescription-medications">
                        <div className="medication">
                          <strong>Losartana 50mg</strong> - 1 comprimido ao dia, pela manhã
                        </div>
                        <div className="medication">
                          <strong>Hidroclorotiazida 25mg</strong> - 1 comprimido ao dia, pela manhã
                        </div>
                      </div>
                      <div className="prescription-footer">
                        <span className="prescription-doctor">Dr. João Silva - CRM 12345</span>
                        <button className="btn-print">Imprimir</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Arquivos */}
            {activeTab === 'arquivos' && (
              <div className="tab-content-section">
                <h3>Arquivos</h3>
                <div className="files-section">
                  <div className="files-toolbar">
                    <button className="btn-upload">+ Upload Arquivo</button>
                    <select className="file-type-filter">
                      <option>Todos os tipos</option>
                      <option>Exames</option>
                      <option>Documentos</option>
                      <option>Imagens</option>
                    </select>
                  </div>
                  <div className="files-grid">
                    <div className="file-item">
                      <div className="file-icon">📄</div>
                      <div className="file-info">
                        <h4>ECG_15032024.pdf</h4>
                        <p>Eletrocardiograma</p>
                        <span className="file-date">15/03/2024</span>
                      </div>
                      <div className="file-actions">
                        <button className="btn-download">Download</button>
                        <button className="btn-view">Visualizar</button>
                      </div>
                    </div>
                    <div className="file-item">
                      <div className="file-icon">🖼️</div>
                      <div className="file-info">
                        <h4>RX_Torax.jpg</h4>
                        <p>Raio-X de Tórax</p>
                        <span className="file-date">15/03/2024</span>
                      </div>
                      <div className="file-actions">
                        <button className="btn-download">Download</button>
                        <button className="btn-view">Visualizar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default PatientRegister;