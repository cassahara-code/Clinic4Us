import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation, useRouter } from "../contexts/RouterContext";
import { BarChart, CalendarToday, TrendingUp, InsertDriveFile, Person, Assessment, Note, Event, LocalHospital, Assignment, Psychology, Timeline, AttachMoney, LocalPharmacy, Folder } from '@mui/icons-material';
import { FaqButton } from "../components/FaqButton";
import PhotoUpload from "../components/PhotoUpload";
import {
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
  Button,
  Tabs,
  Tab
} from '@mui/material';

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
  const { goToPatients, goToDashboard } = useNavigation();
  const { getParam } = useRouter();
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // Reusable styles for form fields
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      height: '40px',
      fontSize: '1rem',
      backgroundColor: 'white',
      '& fieldset': {
        borderColor: '#ced4da',
        legend: { maxWidth: '100%' },
      },
    },
    '& .MuiSelect-select': {
      padding: '0.375rem 0.5rem',
      color: '#495057',
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.95rem',
      color: '#6c757d',
      backgroundColor: 'white',
      paddingLeft: '4px',
      paddingRight: '4px',
      '&.Mui-focused': {
        color: '#03B4C6',
      },
    },
  };

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
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cepLoading, setCepLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<PatientFormData | null>(null);

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

  // Carregar dados do paciente se houver ID na URL
  useEffect(() => {
    const patientId = getParam('id');

    if (patientId) {
      // Paciente existente - modo visualização
      setIsNewPatient(false);
      setIsEditing(false);

      // Dados mockados de um paciente existente
      const mockPatientData: PatientFormData = {
        id: patientId,
        name: "João Silva Santos",
        isResponsible: false,
        phone: "11999999999",
        cep: "01310100",
        documentType: "CPF",
        document: "12345678900",
        email: "joao.silva@email.com",
        responsibleName: "Maria Silva Santos",
        address: "Avenida Paulista",
        number: "1578",
        expeditorOrgan: "SSP",
        birthDate: "1990-05-15",
        responsibleDocumentType: "CPF",
        responsibleDocument: "98765432100",
        complement: "Apto 101",
        neighborhood: "Bela Vista",
        gender: "Masculino",
        kinship: "Mãe",
        responsiblePhone: "11988888888",
        city: "São Paulo",
        uf: "SP",
        nativeLanguage: "Português",
        originCountry: "Brasil",
        responsibleEmail: "maria.silva@email.com",
        isComplete: true,
        observations: "Paciente com histórico de hipertensão. Acompanhamento mensal necessário.",
        referredBy: "Dr. Carlos Mendes",
        entryChannel: "Indicação profissional",
        photo: undefined,
        photoRotation: 0,
        photoZoom: 1,
        photoFlipX: 1,
        photoPositionX: 0,
        photoPositionY: 0,
        responsible2Name: "Pedro Silva Santos",
        responsible2DocumentType: "CPF",
        responsible2Document: "11122233344",
        responsible2Kinship: "Pai",
        responsible2Phone: "11977777777",
        responsible2Email: "pedro.silva@email.com",
        responsibleFinancial: true,
        responsible2Financial: false
      };

      setFormData(mockPatientData);
      setOriginalFormData(mockPatientData);
    } else {
      // Novo paciente
      setIsNewPatient(true);
      setIsEditing(false);
    }
  }, [getParam]);

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
    if (isNewPatient) {
      goToPatients();
    } else {
      // Cancelar edição - restaurar dados originais
      if (originalFormData) {
        setFormData(originalFormData);
      }
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleEdit = () => {
    // Salvar os dados atuais antes de editar
    setOriginalFormData({ ...formData });
    setIsEditing(true);

    // Focar no primeiro campo após um pequeno delay para garantir que o campo foi habilitado
    setTimeout(() => {
      const nameInput = document.getElementById('name');
      if (nameInput) {
        nameInput.focus();
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Determina se os campos podem ser editados
  const canEdit = isNewPatient || isEditing;

  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'cadastro', label: 'Cadastro', enabled: true, icon: Person },
      { id: 'resumo', label: 'Resumo', enabled: true, icon: Assessment },
      { id: 'anotacoes', label: 'Anotações', enabled: true, icon: Note },
      { id: 'agenda', label: 'Agenda', enabled: true, icon: Event },
      { id: 'diagnostico', label: 'Diagnóstico', enabled: true, icon: LocalHospital },
      { id: 'avaliacoes', label: 'Avaliações', enabled: true, icon: Assignment },
      { id: 'plano-terap', label: 'Plano Terap', enabled: true, icon: Psychology },
      { id: 'evolucoes', label: 'Evoluções', enabled: true, icon: Timeline },
      { id: 'financeiro', label: 'Financeiro', enabled: true, icon: AttachMoney },
      { id: 'receituario', label: 'Receituário', enabled: true, icon: LocalPharmacy },
      { id: 'arquivos', label: 'Arquivos', enabled: true, icon: Folder }
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


  if (!userSession) {
    return <div>Carregando...</div>;
  }


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
        {/* Título da Página */}
        <div className="page-header-container">
          <div className="page-header-content">
            <Typography variant="h4" className="page-header-title" sx={{ fontSize: '1.3rem', mb: 1 }}>
              {isNewPatient ? 'Cadastro de Paciente' : formData.name || 'Paciente'}
            </Typography>
            {isNewPatient ? (
              <Typography variant="body2" className="page-header-description" sx={{ fontSize: '0.875rem', color: '#6c757d' }}>
                Preencha os dados para cadastrar um novo paciente no sistema.
              </Typography>
            ) : (
              <Typography variant="body2" className="page-header-description" sx={{ fontSize: '0.875rem', color: '#6c757d' }}>
                ID: {formData.id}
              </Typography>
            )}
          </div>
          <FaqButton />
        </div>

        {/* Tabs de navegação */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#ffffff', marginBottom: '1.5rem' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => handleTabChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: '48px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6c757d',
                '&.Mui-selected': {
                  color: '#03B4C6',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#03B4C6',
                height: '3px',
              },
            }}
          >
            {getAvailableTabs().map(tab => {
              const IconComponent = tab.icon;
              return (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={tab.label}
                  icon={<IconComponent sx={{ fontSize: '1rem' }} />}
                  iconPosition="start"
                  disabled={!tab.enabled}
                />
              );
            })}
          </Tabs>
        </Box>

        <div className="patient-register-container">
          {/* Conteúdo da aba ativa */}
          <div className="tab-content">
            {activeTab === 'cadastro' && (
              <form onSubmit={handleSubmit} className="patient-register-form">
                {/* Seção: Dados Pessoais */}
                <div className="personal-data-layout">
                    {/* Seção de Upload de Foto */}
                    <div className="photo-upload-container">
                      <PhotoUpload
                        photo={formData.photo}
                        photoRotation={formData.photoRotation}
                        photoZoom={formData.photoZoom}
                        photoFlipX={formData.photoFlipX}
                        photoPositionX={formData.photoPositionX}
                        photoPositionY={formData.photoPositionY}
                        onPhotoChange={(photoData) => setFormData(prev => ({ ...prev, ...photoData }))}
                      />

                      {/* Mini Dashboard de Presenças */}
                      <div className="mini-dashboard">
                          <h4 className="dashboard-title"><BarChart fontSize="small" style={{marginRight: '0.5rem', verticalAlign: 'middle'}} />Resumo de Presenças</h4>

                          <div className="dashboard-item">
                            <span className="dashboard-label"><CalendarToday fontSize="small" style={{marginRight: '0.25rem', verticalAlign: 'middle'}} />Última presença:</span>
                            <span className="dashboard-value">15/03/2024</span>
                          </div>

                          <div className="dashboard-section">
                            <h5 className="dashboard-subtitle"><TrendingUp fontSize="small" style={{marginRight: '0.5rem', verticalAlign: 'middle'}} />Total Geral</h5>
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
                            <h5 className="dashboard-subtitle"><CalendarToday fontSize="small" style={{marginRight: '0.5rem', verticalAlign: 'middle'}} />Últimos 30 dias</h5>
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

                    {/* Seção de Campos */}
                    <div className="personal-data-fields">
                      {/* Primeira linha: Nome, Data de Nascimento + Idade, Gênero */}
                      <div className="form-row">
                        <div className="form-group">
                          <TextField
                            fullWidth
                            size="small"
                            id="name"
                            name="name"
                            label="Nome Completo*"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nome completo do paciente"
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
                        </div>
                        <div className="form-group birth-age-group">
                          <div className="birth-age-container">
                            <div className="form-subgroup">
                              <TextField
                                fullWidth
                                size="small"
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                label="Data de Nascimento*"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldSx}
                              />
                            </div>
                            <div className="form-subgroup">
                              <TextField
                                fullWidth
                                size="small"
                                id="age"
                                name="age"
                                label="Idade"
                                value={calculateAge(formData.birthDate)}
                                disabled
                                placeholder="Calculado automaticamente"
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldSx}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <TextField
                            select
                            fullWidth
                            size="small"
                            id="gender"
                            name="gender"
                            label="Gênero*"
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{
                              MenuProps: {
                                PaperProps: {
                                  sx: {
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  },
                                },
                              },
                            }}
                            sx={textFieldSx}
                          >
                            <MenuItem value="">Selecione o gênero</MenuItem>
                            <MenuItem value="Masculino">Masculino</MenuItem>
                            <MenuItem value="Feminino">Feminino</MenuItem>
                            <MenuItem value="Outro">Outro</MenuItem>
                          </TextField>
                        </div>
                      </div>

                      {/* Segunda linha: Documento (Tipo + Número), Órgão Expedidor */}
                      <div className="form-row">
                        <div className="form-group document-type-number">
                          <div className="document-container">
                            <div className="form-subgroup">
                              <TextField
                                select
                                fullWidth
                                size="small"
                                id="documentType"
                                name="documentType"
                                label="Tipo de Documento*"
                                value={formData.documentType}
                                onChange={handleInputChange}
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{
                                  MenuProps: {
                                    PaperProps: {
                                      sx: {
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                      },
                                    },
                                  },
                                }}
                                sx={textFieldSx}
                              >
                                <MenuItem value="CPF">CPF</MenuItem>
                                <MenuItem value="RG">RG</MenuItem>
                                <MenuItem value="CNH">CNH</MenuItem>
                                <MenuItem value="Passaporte">Passaporte</MenuItem>
                              </TextField>
                            </div>
                            <div className="form-subgroup">
                              <TextField
                                fullWidth
                                size="small"
                                id="document"
                                name="document"
                                label="Documento*"
                                value={formData.document}
                                onChange={handleInputChange}
                                placeholder="000.000.000-00"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldSx}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <TextField
                            fullWidth
                            size="small"
                            id="expeditorOrgan"
                            name="expeditorOrgan"
                            label="Órgão Expedidor"
                            value={formData.expeditorOrgan}
                            onChange={handleInputChange}
                            placeholder="SSP, DETRAN, etc."
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
                        </div>
                        <div className="form-group country-language">
                          <div className="country-language-container">
                            <div className="form-subgroup">
                              <TextField
                                select
                                fullWidth
                                size="small"
                                id="originCountry"
                                name="originCountry"
                                label="País de Origem*"
                                value={formData.originCountry}
                                onChange={handleInputChange}
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{
                                  MenuProps: {
                                    PaperProps: {
                                      sx: {
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                      },
                                    },
                                  },
                                }}
                                sx={textFieldSx}
                              >
                                <MenuItem value="Brasil">Brasil</MenuItem>
                                <MenuItem value="Argentina">Argentina</MenuItem>
                                <MenuItem value="Estados Unidos">Estados Unidos</MenuItem>
                              </TextField>
                            </div>
                            <div className="form-subgroup">
                              <TextField
                                select
                                fullWidth
                                size="small"
                                id="nativeLanguage"
                                name="nativeLanguage"
                                label="Idioma Nativo*"
                                value={formData.nativeLanguage}
                                onChange={handleInputChange}
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{
                                  MenuProps: {
                                    PaperProps: {
                                      sx: {
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                      },
                                    },
                                  },
                                }}
                                sx={textFieldSx}
                              >
                                <MenuItem value="Português">Português</MenuItem>
                                <MenuItem value="Inglês">Inglês</MenuItem>
                                <MenuItem value="Espanhol">Espanhol</MenuItem>
                              </TextField>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Terceira linha: Responsabilidade, Telefone + Email */}
                      <div className="form-row">
                        <div className="form-group">
                          <FormControl component="fieldset" error={!!errors.isResponsible}>
                            <FormLabel component="legend" sx={{ fontSize: '0.95rem', color: '#6c757d', mb: 0.5 }}>
                              É o próprio responsável?*
                            </FormLabel>
                            <RadioGroup
                              row
                              name="isResponsible"
                              value={formData.isResponsible.toString()}
                              onChange={(e) => handleInputChange({
                                ...e,
                                target: { ...e.target, name: 'isResponsible', value: e.target.value }
                              })}
                            >
                              <FormControlLabel value="true" control={<Radio size="small" />} label="Sim" />
                              <FormControlLabel value="false" control={<Radio size="small" />} label="Não" />
                            </RadioGroup>
                            {errors.isResponsible && <Typography variant="caption" color="error">{errors.isResponsible}</Typography>}
                          </FormControl>
                        </div>
                        <div className="form-group">
                          <TextField
                            fullWidth
                            size="small"
                            id="phone"
                            name="phone"
                            label={`Telefone (Whatsapp)${formData.isResponsible ? '*' : ''}`}
                            value={formatPhone(formData.phone)}
                            onChange={(e) => handleInputChange({
                              ...e,
                              target: { ...e.target, value: e.target.value.replace(/\D/g, '') }
                            })}
                            placeholder="(11) 99999-9999"
                            inputProps={{ maxLength: 15 }}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
                        </div>
                        <div className="form-group">
                          <TextField
                            fullWidth
                            size="small"
                            type="email"
                            id="email"
                            name="email"
                            label={`E-mail${formData.isResponsible ? '*' : ''}`}
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="email@exemplo.com"
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
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
                              <TextField
                                fullWidth
                                size="small"
                                id="responsibleName"
                                name="responsibleName"
                                label="Nome Completo (1º Resp)*"
                                value={formData.responsibleName}
                                onChange={handleInputChange}
                                placeholder="Nome completo do responsável"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldSx}
                              />
                            </div>
                            <div className="form-group cpf-financial-group">
                              <div className="cpf-financial-container">
                                <div className="form-subgroup">
                                  <TextField
                                    fullWidth
                                    size="small"
                                    id="responsibleDocument"
                                    name="responsibleDocument"
                                    label="CPF"
                                    value={formData.responsibleDocument}
                                    onChange={handleInputChange}
                                    placeholder="000.000.000-00"
                                    disabled={!canEdit}
                                    InputLabelProps={{ shrink: true }}
                                    sx={textFieldSx}
                                  />
                                </div>
                                <div className="form-subgroup checkbox-subgroup">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name="responsibleFinancial"
                                        checked={formData.responsibleFinancial}
                                        onChange={handleInputChange}
                                        size="small"
                                        disabled={!canEdit}
                                      />
                                    }
                                    label="Resp. Financeiro"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group phone-email">
                              <div className="phone-email-container">
                                <div className="form-subgroup">
                                  <TextField
                                    fullWidth
                                    size="small"
                                    id="responsiblePhone"
                                    name="responsiblePhone"
                                    label="Telefone (Whatsapp)"
                                    value={formatPhone(formData.responsiblePhone)}
                                    onChange={(e) => handleInputChange({
                                      ...e,
                                      target: { ...e.target, value: e.target.value.replace(/\D/g, '') }
                                    })}
                                    placeholder="(11) 99999-9999"
                                    inputProps={{ maxLength: 15 }}
                                    disabled={!canEdit}
                                    InputLabelProps={{ shrink: true }}
                                    sx={textFieldSx}
                                  />
                                </div>
                                <div className="form-subgroup">
                                  <TextField
                                    fullWidth
                                    size="small"
                                    type="email"
                                    id="responsibleEmail"
                                    name="responsibleEmail"
                                    label="E-mail"
                                    value={formData.responsibleEmail}
                                    onChange={handleInputChange}
                                    placeholder="email@exemplo.com"
                                    disabled={!canEdit}
                                    InputLabelProps={{ shrink: true }}
                                    sx={textFieldSx}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2º Responsável */}
                          <div className="form-row">
                            <div className="form-group">
                              <TextField
                                fullWidth
                                size="small"
                                id="responsible2Name"
                                name="responsible2Name"
                                label="Nome Completo (2º Resp)"
                                value={formData.responsible2Name}
                                onChange={handleInputChange}
                                placeholder="Nome completo do 2º responsável"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldSx}
                              />
                            </div>
                            <div className="form-group cpf-financial-group">
                              <div className="cpf-financial-container">
                                <div className="form-subgroup">
                                  <TextField
                                    fullWidth
                                    size="small"
                                    id="responsible2Document"
                                    name="responsible2Document"
                                    label="CPF"
                                    value={formData.responsible2Document}
                                    onChange={handleInputChange}
                                    placeholder="000.000.000-00"
                                    disabled={!canEdit}
                                    InputLabelProps={{ shrink: true }}
                                    sx={textFieldSx}
                                  />
                                </div>
                                <div className="form-subgroup checkbox-subgroup">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name="responsible2Financial"
                                        checked={formData.responsible2Financial}
                                        onChange={handleInputChange}
                                        size="small"
                                        disabled={!canEdit}
                                      />
                                    }
                                    label="Resp. Financeiro"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group phone-email">
                              <div className="phone-email-container">
                                <div className="form-subgroup">
                                  <TextField
                                    fullWidth
                                    size="small"
                                    id="responsible2Phone"
                                    name="responsible2Phone"
                                    label="Telefone (Whatsapp)"
                                    value={formatPhone(formData.responsible2Phone)}
                                    onChange={(e) => handleInputChange({
                                      ...e,
                                      target: { ...e.target, value: e.target.value.replace(/\D/g, '') }
                                    })}
                                    placeholder="(11) 99999-9999"
                                    inputProps={{ maxLength: 15 }}
                                    disabled={!canEdit}
                                    InputLabelProps={{ shrink: true }}
                                    sx={textFieldSx}
                                  />
                                </div>
                                <div className="form-subgroup">
                                  <TextField
                                    fullWidth
                                    size="small"
                                    type="email"
                                    id="responsible2Email"
                                    name="responsible2Email"
                                    label="E-mail"
                                    value={formData.responsible2Email}
                                    onChange={handleInputChange}
                                    placeholder="email@exemplo.com"
                                    disabled={!canEdit}
                                    InputLabelProps={{ shrink: true }}
                                    sx={textFieldSx}
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
                          <TextField
                            fullWidth
                            size="small"
                            id="cep"
                            name="cep"
                            label="CEP*"
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
                            inputProps={{ maxLength: 9 }}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              endAdornment: cepLoading && <CircularProgress size={20} />
                            }}
                            sx={textFieldSx}
                          />
                        </div>
                        <div className="form-group">
                          <TextField
                            fullWidth
                            size="small"
                            id="address"
                            name="address"
                            label="Logradouro*"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Rua, Avenida, etc."
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
                        </div>
                        <div className="form-group address-number-complement">
                          <div className="number-complement-container">
                            <div className="form-subgroup">
                              <TextField
                                fullWidth
                                size="small"
                                id="number"
                                name="number"
                                label="Número*"
                                value={formData.number}
                                onChange={handleInputChange}
                                placeholder="123"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldSx}
                              />
                            </div>
                            <div className="form-subgroup">
                              <TextField
                                fullWidth
                                size="small"
                                id="complement"
                                name="complement"
                                label="Complemento"
                                value={formData.complement}
                                onChange={handleInputChange}
                                placeholder="Apto, Bloco, etc."
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldSx}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bairro, Cidade, UF */}
                      <div className="form-row">
                        <div className="form-group">
                          <TextField
                            fullWidth
                            size="small"
                            id="neighborhood"
                            name="neighborhood"
                            label="Bairro*"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            placeholder="Nome do bairro"
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
                        </div>
                        <div className="form-group">
                          <TextField
                            fullWidth
                            size="small"
                            id="city"
                            name="city"
                            label="Cidade*"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Nome da cidade"
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
                        </div>
                        <div className="form-group">
                          <TextField
                            select
                            fullWidth
                            size="small"
                            id="uf"
                            name="uf"
                            label="UF*"
                            value={formData.uf}
                            onChange={handleInputChange}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{
                              MenuProps: {
                                PaperProps: {
                                  sx: {
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  },
                                },
                              },
                            }}
                            sx={textFieldSx}
                          >
                            <MenuItem value="">Selecione</MenuItem>
                            <MenuItem value="AC">AC</MenuItem>
                            <MenuItem value="AL">AL</MenuItem>
                            <MenuItem value="AP">AP</MenuItem>
                            <MenuItem value="AM">AM</MenuItem>
                            <MenuItem value="BA">BA</MenuItem>
                            <MenuItem value="CE">CE</MenuItem>
                            <MenuItem value="DF">DF</MenuItem>
                            <MenuItem value="ES">ES</MenuItem>
                            <MenuItem value="GO">GO</MenuItem>
                            <MenuItem value="MA">MA</MenuItem>
                            <MenuItem value="MT">MT</MenuItem>
                            <MenuItem value="MS">MS</MenuItem>
                            <MenuItem value="MG">MG</MenuItem>
                            <MenuItem value="PA">PA</MenuItem>
                            <MenuItem value="PB">PB</MenuItem>
                            <MenuItem value="PR">PR</MenuItem>
                            <MenuItem value="PE">PE</MenuItem>
                            <MenuItem value="PI">PI</MenuItem>
                            <MenuItem value="RJ">RJ</MenuItem>
                            <MenuItem value="RN">RN</MenuItem>
                            <MenuItem value="RS">RS</MenuItem>
                            <MenuItem value="RO">RO</MenuItem>
                            <MenuItem value="RR">RR</MenuItem>
                            <MenuItem value="SC">SC</MenuItem>
                            <MenuItem value="SP">SP</MenuItem>
                            <MenuItem value="SE">SE</MenuItem>
                            <MenuItem value="TO">TO</MenuItem>
                          </TextField>
                        </div>
                      </div>

                      {/* Observações ocupando 3 colunas dentro da seção de endereço */}
                      <div className="responsible-divider">
                        <h4>Observações</h4>
                      </div>

                      <div className="form-row">
                        <div className="form-group observations-group">
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            id="observations"
                            name="observations"
                            label="Observações Gerais"
                            value={formData.observations}
                            onChange={handleInputChange}
                            placeholder="Observações importantes sobre o paciente, medicações, alergias, etc."
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
                        </div>
                      </div>

                      {/* Linha com 3 colunas: Canal de entrada, Indicado por e Status + Botões */}
                      <div className="form-row">
                        <div className="form-group">
                          <TextField
                            select
                            fullWidth
                            size="small"
                            id="entryChannel"
                            name="entryChannel"
                            label="Canal de entrada"
                            value={formData.entryChannel}
                            onChange={handleInputChange}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{
                              MenuProps: {
                                PaperProps: {
                                  sx: {
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  },
                                },
                              },
                            }}
                            sx={textFieldSx}
                          >
                            <MenuItem value="">Selecione</MenuItem>
                            <MenuItem value="Instagram">Instagram</MenuItem>
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="Google">Google</MenuItem>
                            <MenuItem value="Site">Site</MenuItem>
                            <MenuItem value="Indicação profissional">Indicação profissional</MenuItem>
                            <MenuItem value="Indicação de conhecido">Indicação de conhecido</MenuItem>
                            <MenuItem value="Outros">Outros</MenuItem>
                          </TextField>
                        </div>
                        <div className="form-group">
                          <TextField
                            fullWidth
                            size="small"
                            id="referredBy"
                            name="referredBy"
                            label="Indicado por"
                            value={formData.referredBy || ''}
                            onChange={handleInputChange}
                            placeholder="Nome da pessoa ou instituição que indicou o paciente"
                            disabled={!canEdit || !formData.entryChannel.includes('Indicação')}
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                          />
                        </div>
                        <div className="form-group">
                          <FormControl component="fieldset">
                            <FormLabel component="legend" sx={{ fontSize: '0.95rem', color: '#6c757d', mb: 0.5 }}>
                              Status do Cadastro
                            </FormLabel>
                            <RadioGroup
                              row
                              name="isComplete"
                              value={formData.isComplete.toString()}
                              onChange={(e) => handleInputChange({
                                ...e,
                                target: { ...e.target, name: 'isComplete', value: e.target.value }
                              })}
                            >
                              <FormControlLabel value="true" control={<Radio size="small" />} label="Completo" />
                              <FormControlLabel value="false" control={<Radio size="small" />} label="Incompleto" />
                            </RadioGroup>
                          </FormControl>
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
                          <Box sx={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            {isNewPatient || isEditing ? (
                              <>
                                <Button
                                  variant="outlined"
                                  onClick={handleCancel}
                                  sx={{
                                    color: '#6c757d',
                                    borderColor: '#6c757d',
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    padding: '0.5rem 1.5rem',
                                    '&:hover': {
                                      borderColor: '#5a6268',
                                      backgroundColor: 'rgba(108, 117, 125, 0.04)',
                                    },
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  disabled={isLoading}
                                  sx={{
                                    backgroundColor: '#03B4C6',
                                    color: '#ffffff',
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    padding: '0.5rem 1.5rem',
                                    boxShadow: 'none',
                                    '&:hover': {
                                      backgroundColor: '#029AAB',
                                      boxShadow: 'none',
                                    },
                                    '&:disabled': {
                                      backgroundColor: '#ced4da',
                                      color: '#ffffff',
                                    },
                                  }}
                                >
                                  {isLoading ? "Salvando..." : "Salvar"}
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={handleEdit}
                                sx={{
                                  backgroundColor: '#03B4C6',
                                  color: '#ffffff',
                                  textTransform: 'none',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  padding: '0.5rem 1.5rem',
                                  boxShadow: 'none',
                                  '&:hover': {
                                    backgroundColor: '#029AAB',
                                    boxShadow: 'none',
                                  },
                                }}
                              >
                                Editar
                              </Button>
                            )}
                          </Box>
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
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                  Anotações do Paciente
                </Typography>
                <div className="notes-section">
                  <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#48bb78',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#38a169',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      + Nova Anotação
                    </Button>
                    <TextField
                      select
                      size="small"
                      defaultValue="all"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          height: '36px',
                          backgroundColor: '#ffffff',
                        },
                      }}
                    >
                      <MenuItem value="all">Todas as anotações</MenuItem>
                      <MenuItem value="consultas">Consultas</MenuItem>
                      <MenuItem value="observacoes">Observações</MenuItem>
                      <MenuItem value="exames">Exames</MenuItem>
                    </TextField>
                  </Box>
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
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                  Agenda do Paciente
                </Typography>
                <div className="agenda-section">
                  <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#48bb78',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#38a169',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      + Agendar Consulta
                    </Button>
                    <TextField
                      select
                      size="small"
                      defaultValue="30days"
                      sx={{
                        minWidth: '180px',
                        '& .MuiOutlinedInput-root': {
                          height: '36px',
                          backgroundColor: '#ffffff',
                        },
                      }}
                    >
                      <MenuItem value="30days">Próximos 30 dias</MenuItem>
                      <MenuItem value="7days">Próximos 7 dias</MenuItem>
                      <MenuItem value="history">Histórico</MenuItem>
                    </TextField>
                  </Box>
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
                      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#2196f3',
                            color: '#2196f3',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: 'rgba(33, 150, 243, 0.04)',
                            },
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#dc3545',
                            color: '#dc3545',
                            '&:hover': {
                              borderColor: '#c82333',
                              backgroundColor: 'rgba(220, 53, 69, 0.04)',
                            },
                          }}
                        >
                          Cancelar
                        </Button>
                      </Box>
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
                      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#2196f3',
                            color: '#2196f3',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: 'rgba(33, 150, 243, 0.04)',
                            },
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Diagnóstico */}
            {activeTab === 'diagnostico' && (
              <div className="tab-content-section">
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                  Diagnósticos
                </Typography>
                <div className="diagnosis-section">
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#48bb78',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#38a169',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      + Novo Diagnóstico
                    </Button>
                  </Box>
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
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                  Avaliações
                </Typography>
                <div className="evaluations-section">
                  <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#48bb78',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#38a169',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      + Nova Avaliação
                    </Button>
                    <TextField
                      select
                      size="small"
                      defaultValue="all"
                      sx={{
                        minWidth: '220px',
                        '& .MuiOutlinedInput-root': {
                          height: '36px',
                          backgroundColor: '#ffffff',
                        },
                      }}
                    >
                      <MenuItem value="all">Todos os tipos</MenuItem>
                      <MenuItem value="inicial">Avaliação Inicial</MenuItem>
                      <MenuItem value="reavaliacao">Reavaliação</MenuItem>
                      <MenuItem value="especializada">Avaliação Especializada</MenuItem>
                    </TextField>
                  </Box>
                  <div className="evaluations-list">
                    <div className="evaluation-item">
                      <div className="evaluation-header">
                        <h4>Avaliação Cardiológica Inicial</h4>
                        <span className="evaluation-date">15/03/2024</span>
                      </div>
                      <p className="evaluation-summary">Avaliação inicial completa com ECG e ecocardiograma.</p>
                      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="evaluation-status completed">Concluída</span>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#2196f3',
                            color: '#2196f3',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: 'rgba(33, 150, 243, 0.04)',
                            },
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Plano Terapêutico */}
            {activeTab === 'plano-terap' && (
              <div className="tab-content-section">
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                  Plano Terapêutico
                </Typography>
                <div className="therapy-plan-section">
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#48bb78',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#38a169',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      + Novo Plano
                    </Button>
                  </Box>
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
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                  Evoluções
                </Typography>
                <div className="evolution-section">
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#48bb78',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#38a169',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      + Nova Evolução
                    </Button>
                  </Box>
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
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                  Receituário
                </Typography>
                <div className="prescription-section">
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#48bb78',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#38a169',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      + Nova Receita
                    </Button>
                  </Box>
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
                      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="prescription-doctor">Dr. João Silva - CRM 12345</span>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#2196f3',
                            color: '#2196f3',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: 'rgba(33, 150, 243, 0.04)',
                            },
                          }}
                        >
                          Imprimir
                        </Button>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Arquivos */}
            {activeTab === 'arquivos' && (
              <div className="tab-content-section">
                <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2 }}>
                  Arquivos
                </Typography>
                <div className="files-section">
                  <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#48bb78',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#38a169',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      + Upload Arquivo
                    </Button>
                    <TextField
                      select
                      size="small"
                      defaultValue="all"
                      sx={{
                        minWidth: '180px',
                        '& .MuiOutlinedInput-root': {
                          height: '36px',
                          backgroundColor: '#ffffff',
                        },
                      }}
                    >
                      <MenuItem value="all">Todos os tipos</MenuItem>
                      <MenuItem value="exames">Exames</MenuItem>
                      <MenuItem value="documentos">Documentos</MenuItem>
                      <MenuItem value="imagens">Imagens</MenuItem>
                    </TextField>
                  </Box>
                  <div className="files-grid">
                    <div className="file-item">
                      <div className="file-icon"><InsertDriveFile fontSize="large" /></div>
                      <div className="file-info">
                        <h4>ECG_15032024.pdf</h4>
                        <p>Eletrocardiograma</p>
                        <span className="file-date">15/03/2024</span>
                      </div>
                      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#2196f3',
                            color: '#2196f3',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: 'rgba(33, 150, 243, 0.04)',
                            },
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#03B4C6',
                            color: '#03B4C6',
                            '&:hover': {
                              borderColor: '#029AAB',
                              backgroundColor: 'rgba(3, 180, 198, 0.04)',
                            },
                          }}
                        >
                          Visualizar
                        </Button>
                      </Box>
                    </div>
                    <div className="file-item">
                      <div className="file-icon">🖼️</div>
                      <div className="file-info">
                        <h4>RX_Torax.jpg</h4>
                        <p>Raio-X de Tórax</p>
                        <span className="file-date">15/03/2024</span>
                      </div>
                      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#2196f3',
                            color: '#2196f3',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: 'rgba(33, 150, 243, 0.04)',
                            },
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#03B4C6',
                            color: '#03B4C6',
                            '&:hover': {
                              borderColor: '#029AAB',
                              backgroundColor: 'rgba(3, 180, 198, 0.04)',
                            },
                          }}
                        >
                          Visualizar
                        </Button>
                      </Box>
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