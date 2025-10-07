import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation, useRouter } from "../contexts/RouterContext";
import { useAuth } from "../contexts/AuthContext";
import { BarChart, CalendarToday, TrendingUp, InsertDriveFile, Person, Assessment, Note, Event, LocalHospital, Assignment, Psychology, Timeline, AttachMoney, LocalPharmacy, Folder, Check, Warning, MedicalServices, Edit, Delete, Add, FilterAltOff, Close, PriorityHigh, OpenInNew, DateRange, Print, Description, Article, Summarize, ListAlt, FileDownload, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { FaqButton } from "../components/FaqButton";
import PhotoUpload from "../components/PhotoUpload";
import AppointmentModal, { AppointmentData } from "../components/modals/AppointmentModal";
import TherapyPeriodModal from "../components/modals/TherapyPeriodModal";
import TherapyPlanModal from "../components/modals/TherapyPlanModal";
import EvolutionModal from "../components/modals/EvolutionModal";
import ConfirmModal from "../components/modals/ConfirmModal";
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
  Tab,
  Switch,
  Paper,
  IconButton,
  Tooltip,
  Pagination,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  LinearProgress
} from '@mui/material';
import { colors, typography, inputs, actionIcons } from '../theme/designSystem';

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
  const { user } = useAuth();
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

  // Estados para filtros de data do Status de Presença
  const [attendanceStartDate, setAttendanceStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [attendanceEndDate, setAttendanceEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });

  // Estados para paginação de anotações
  const [notesCurrentPage, setNotesCurrentPage] = useState(1);
  const [notesItemsPerPage, setNotesItemsPerPage] = useState(10);

  // Estados para filtros de data das anotações
  const [notesStartDate, setNotesStartDate] = useState('');
  const [notesEndDate, setNotesEndDate] = useState('');
  const [notesUserFilter, setNotesUserFilter] = useState('');
  const [notesSearchText, setNotesSearchText] = useState('');

  // Estados dos modais de anotações
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<any>(null);
  const [noteFormData, setNoteFormData] = useState({
    content: '',
    important: false
  });

  // Estados do modal de agendamento
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentModalMode, setAppointmentModalMode] = useState<'create' | 'edit'>('create');
  const [appointmentModalData, setAppointmentModalData] = useState<Partial<AppointmentData>>({});

  // Estados dos modais de diagnóstico
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [isDeleteDiagnosisModalOpen, setIsDeleteDiagnosisModalOpen] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<any>(null);
  const [diagnosisFormData, setDiagnosisFormData] = useState({
    cid: '',
    observations: ''
  });
  const [cidSearchText, setCidSearchText] = useState('');

  // Estados dos modais de avaliação
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isDeleteEvaluationModalOpen, setIsDeleteEvaluationModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<any>(null);
  const [evaluationFormData, setEvaluationFormData] = useState({
    form: '',
    observations: '',
    deadline: ''
  });

  // Estado do modal de períodos de plano terapêutico
  const [isTherapyPeriodModalOpen, setIsTherapyPeriodModalOpen] = useState(false);

  // Estados do modal de plano terapêutico
  const [isTherapyPlanModalOpen, setIsTherapyPlanModalOpen] = useState(false);
  const [therapyPlanModalMode, setTherapyPlanModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingTherapyPlan, setEditingTherapyPlan] = useState<any>(null);

  // Estados do modal de evolução
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const [evolutionModalMode, setEvolutionModalMode] = useState<'add' | 'edit'>('add');
  const [editingEvolution, setEditingEvolution] = useState<any>(null);

  // Estados do modal de exclusão de evolução
  const [isDeleteEvolutionModalOpen, setIsDeleteEvolutionModalOpen] = useState(false);
  const [evolutionToDelete, setEvolutionToDelete] = useState<any>(null);

  // Lista de pacientes para o modal (apenas o paciente atual)
  const patientsList = formData.name ? [formData.name] : [];

  // Lista mock de CIDs para busca
  const cidList = [
    { code: 'I10', description: 'Hipertensão arterial essencial' },
    { code: 'E11', description: 'Diabetes mellitus não-insulino-dependente' },
    { code: 'J44', description: 'Doença pulmonar obstrutiva crônica' },
    { code: 'I25', description: 'Doença isquêmica crônica do coração' },
    { code: 'M54', description: 'Dorsalgia' },
    { code: 'E78', description: 'Distúrbios do metabolismo de lipoproteínas' },
    { code: 'F41', description: 'Outros transtornos ansiosos' },
    { code: 'K21', description: 'Doença de refluxo gastroesofágico' },
  ];

  // Lista mock de formulários de avaliação
  const formList = [
    'Avaliação Cardiológica Inicial',
    'Avaliação Neurológica',
    'Avaliação Ortopédica',
    'Avaliação Psicológica',
    'Avaliação Nutricional',
    'Avaliação Fisioterapêutica',
    'Avaliação Pediátrica',
    'Avaliação Geriátrica',
  ];

  // Estados dos filtros de avaliações
  const [evalTypeFilter, setEvalTypeFilter] = useState('');
  const [evalStatusFilter, setEvalStatusFilter] = useState('');
  const [evalStartDate, setEvalStartDate] = useState('');
  const [evalEndDate, setEvalEndDate] = useState('');
  const [evalRequestedByFilter, setEvalRequestedByFilter] = useState('');

  // Estados dos filtros de evoluções
  const [evolutionStartDate, setEvolutionStartDate] = useState('');
  const [evolutionEndDate, setEvolutionEndDate] = useState('');
  const [evolutionProfessionalFilter, setEvolutionProfessionalFilter] = useState('');
  const [evolutionKeywordFilter, setEvolutionKeywordFilter] = useState('');

  // Estados de seleção para impressão de evoluções
  const [selectedEvolutionsForPrint, setSelectedEvolutionsForPrint] = useState<string[]>([]);

  // Estados para controle de expansão de texto das evoluções
  const [expandedEvolutions, setExpandedEvolutions] = useState<{ [key: string]: { therapeutic: boolean; conduct: boolean; observations: boolean } }>({});
  const [showAllExpanded, setShowAllExpanded] = useState(false);
  const [evolutionSortOrder, setEvolutionSortOrder] = useState<'asc' | 'desc'>('desc'); // 'desc' = mais recente primeiro

  // Debug: Log quando selectedEvolutionsForPrint mudar
  useEffect(() => {
    console.log('🔄 Estado de seleção atualizado:', selectedEvolutionsForPrint);
  }, [selectedEvolutionsForPrint]);

  // Debug: Log quando showAllExpanded mudar
  useEffect(() => {
    console.log('📖 Expandir todos alterado:', showAllExpanded);
  }, [showAllExpanded]);

  // Lista mock de avaliações
  const [evaluationsList, setEvaluationsList] = useState([
    {
      id: '1',
      form: 'Avaliação Cardiológica Inicial',
      type: 'inicial',
      observations: 'Paciente apresenta histórico familiar de problemas cardíacos',
      deadline: '2025-10-15',
      createdDate: '2025-10-01',
      completionPercentage: 100,
      status: 'Finalizada',
      requestedBy: 'dr_silva'
    },
    {
      id: '2',
      form: 'Avaliação Nutricional',
      type: 'inicial',
      observations: 'Necessário avaliar hábitos alimentares e orientar sobre dieta balanceada',
      deadline: '2025-10-20',
      createdDate: '2025-10-03',
      completionPercentage: 75,
      status: 'Em andamento',
      requestedBy: 'dra_oliveira'
    },
    {
      id: '3',
      form: 'Avaliação Psicológica',
      type: 'especializada',
      observations: 'Paciente relata ansiedade e estresse relacionado ao trabalho',
      deadline: '2025-10-18',
      createdDate: '2025-10-02',
      completionPercentage: 50,
      status: 'Em andamento',
      requestedBy: 'dr_santos'
    },
    {
      id: '4',
      form: 'Avaliação Fisioterapêutica',
      type: 'reavaliacao',
      observations: 'Avaliar mobilidade e recomendar exercícios para fortalecimento',
      deadline: '2025-10-25',
      createdDate: '2025-10-05',
      completionPercentage: 30,
      status: 'Em andamento',
      requestedBy: 'dra_costa'
    },
    {
      id: '5',
      form: 'Avaliação Ortopédica',
      type: 'inicial',
      observations: 'Paciente queixa-se de dores na coluna lombar',
      deadline: '2025-10-12',
      createdDate: '2025-09-28',
      completionPercentage: 100,
      status: 'Finalizada',
      requestedBy: 'dr_silva'
    },
    {
      id: '6',
      form: 'Avaliação Neurológica',
      type: 'especializada',
      observations: 'Avaliar episódios de enxaqueca recorrente',
      deadline: '2025-10-22',
      createdDate: '2025-10-04',
      completionPercentage: 15,
      status: 'Em andamento',
      requestedBy: 'dra_oliveira'
    },
    {
      id: '7',
      form: 'Avaliação Geriátrica',
      type: 'inicial',
      observations: 'Avaliação preventiva de saúde do idoso',
      deadline: '2025-10-30',
      createdDate: '2025-10-06',
      completionPercentage: 0,
      status: 'Pendente',
      requestedBy: 'dr_santos'
    },
    {
      id: '8',
      form: 'Avaliação Pediátrica',
      type: 'reavaliacao',
      observations: 'Acompanhamento de desenvolvimento motor e cognitivo',
      deadline: '2025-10-28',
      createdDate: '2025-10-05',
      completionPercentage: 100,
      status: 'Finalizada',
      requestedBy: 'dra_costa'
    }
  ]);

  // Lista mock de evoluções
  // Mock de evoluções para testes
  // NOTA: Para testar a validação de autoria, use o alias do usuário logado em algumas evoluções
  // Ex: Se logado como "admin", as evoluções 1, 4 e 6 estarão editáveis
  const [evolutionsList] = useState([
    {
      id: '1',
      date: '2025-10-05',
      title: 'Evolução - Consulta de Retorno',
      therapeuticEvolution: 'Paciente apresenta melhora significativa dos sintomas cardiovasculares. Pressão arterial aferida em 130/80 mmHg, mantendo-se dentro dos parâmetros considerados adequados para o caso clínico. Relata adesão satisfatória ao tratamento medicamentoso prescrito anteriormente, sem efeitos colaterais. Exame físico cardiovascular dentro da normalidade, com bulhas rítmicas e normofonéticas. Ausculta pulmonar sem ruídos adventícios. Edema de membros inferiores ausente. Paciente demonstra compreensão adequada sobre sua condição de saúde e a importância da continuidade terapêutica.',
      conductGuidance: 'Orientado a manter rigorosamente a dieta hipossódica prescrita, com restrição de sal a menos de 5g/dia. Enfatizada a importância da prática regular de exercícios físicos aeróbicos, preferencialmente caminhadas de 30 minutos, 5 vezes por semana. Manter uso contínuo das medicações anti-hipertensivas conforme prescrição vigente. Reforçadas orientações sobre monitoramento domiciliar da pressão arterial, registrando os valores em caderneta. Solicitar exames laboratoriais de rotina (hemograma, função renal, eletrólitos, perfil lipídico) para próxima consulta. Retorno agendado em 30 dias ou antes em caso de sintomas como cefaleia intensa, dispneia ou dor precordial.',
      observations: 'Paciente demonstrou boa aceitação às orientações fornecidas durante a consulta. Familiar presente acompanhando o atendimento. Importante destacar que o paciente tem demonstrado progressos constantes no autocuidado e na adesão terapêutica desde o início do tratamento. Continuaremos monitorando de perto a evolução do quadro clínico nas próximas consultas.',
      professional: user?.alias || 'Dr. João Silva',
      professionalId: 'current_user'
    },
    {
      id: '2',
      date: '2025-10-03',
      title: 'Evolução - Sessão de Fisioterapia',
      therapeuticEvolution: 'Texto curto de teste.',
      conductGuidance: 'Orientação curta.',
      observations: 'Observação breve.',
      professional: 'Dra. Maria Oliveira',
      professionalId: 'dra_oliveira'
    },
    {
      id: '3',
      date: '2025-10-01',
      title: 'Evolução - Avaliação Nutricional',
      therapeuticEvolution: 'Paciente compareceu à consulta nutricional de acompanhamento. Aderiu parcialmente às orientações nutricionais fornecidas na consulta anterior, relatando dificuldades em manter a regularidade das refeições devido à rotina de trabalho. Peso atual aferido em 78kg (peso anterior: 79,5kg), representando perda de 1,5kg no período de 30 dias. IMC calculado em 26,8 kg/m², classificado como sobrepeso. Circunferência abdominal medida em 92cm. Relata consumo aumentado de alimentos ultraprocessados nos finais de semana. Ingesta hídrica referida como insuficiente, aproximadamente 1 litro por dia.',
      conductGuidance: 'Orientação de curta duração para teste.',
      professional: 'Dr. Pedro Santos',
      professionalId: 'dr_santos'
    },
    {
      id: '4',
      date: '2025-09-28',
      title: 'Evolução - Consulta Psicológica',
      therapeuticEvolution: 'Durante a sessão de hoje, o paciente relatou melhora significativa do quadro ansioso que motivou o início do acompanhamento psicológico. Demonstrou maior capacidade de reconhecimento e manejo das emoções, utilizando adequadamente as técnicas de respiração diafragmática e exercícios de mindfulness ensinados nas sessões anteriores. Relata redução na frequência e intensidade das crises de ansiedade, que ocorriam diariamente e agora acontecem apenas em situações específicas de maior estresse laboral. Sono apresentando melhora progressiva, com redução do tempo de latência para adormecer. Paciente verbalizou sentir-se mais confiante para lidar com situações desafiadoras do cotidiano.',
      conductGuidance: 'Manter o acompanhamento psicológico semanal conforme estabelecido no plano terapêutico. Orientado a continuar praticando diariamente as técnicas de relaxamento e mindfulness, preferencialmente nos períodos matutino e noturno, com duração mínima de 10 minutos por sessão. Reforçada a importância do registro no diário emocional, anotando situações gatilho, pensamentos automáticos e estratégias de enfrentamento utilizadas. Sugerida a leitura do material psicoeducativo sobre manejo de ansiedade fornecido ao final da sessão. Caso ocorra intensificação dos sintomas ansiosos, orientado a entrar em contato antes da próxima sessão programada.',
      professional: user?.alias || 'Dra. Ana Costa',
      professionalId: 'current_user'
    },
    {
      id: '5',
      date: '2025-09-25',
      title: 'Evolução - Consulta Inicial',
      therapeuticEvolution: 'Primeira consulta do paciente na unidade. Comparece trazendo exames complementares realizados previamente que confirmam diagnóstico de hipertensão arterial sistêmica estágio I. Nega história familiar significativa de doenças cardiovasculares. Sedentário há aproximadamente 5 anos. Tabagista (10 cigarros/dia há 15 anos). Etilismo social. Ao exame físico: PA: 148/94 mmHg (média de 3 aferições), FC: 78 bpm, peso: 82kg, altura: 1,75m, IMC: 26,8 kg/m². Ausculta cardiopulmonar sem alterações. Fundoscopia sem sinais de retinopatia hipertensiva. Pulsos periféricos palpáveis e simétricos.',
      conductGuidance: 'Iniciado tratamento farmacológico anti-hipertensivo com Losartana 50mg, 1 comprimido pela manhã. Fornecidas orientações detalhadas sobre modificações no estilo de vida, incluindo: redução do consumo de sal, prática regular de atividade física, cessação do tabagismo e moderação no consumo de bebidas alcoólicas. Encaminhado ao programa de cessação do tabagismo da unidade. Solicitados exames laboratoriais complementares: hemograma completo, glicemia de jejum, hemoglobina glicada, função renal (ureia e creatinina), eletrólitos (sódio, potássio), perfil lipídico completo, TSH, ácido úrico, EAS e urocultura. Solicitado eletrocardiograma de repouso. Orientado sobre sinais de alerta que necessitam avaliação médica urgente. Retorno agendado em 30 dias para reavaliação clínica e ajuste terapêutico conforme resultados dos exames.',
      professional: 'Dr. Carlos Ferreira',
      professionalId: 'dr_ferreira'
    },
    {
      id: '6',
      date: '2025-09-22',
      title: 'Evolução - Retorno Ortopédico',
      therapeuticEvolution: 'Paciente retorna à consulta ortopédica relatando melhora significativa do quadro álgico lombar que motivou a primeira avaliação. Iniciou protocolo fisioterápico há 3 semanas, com frequência de 2 sessões semanais, apresentando evolução favorável. Dor mensurada pela escala visual analógica (EVA) reduziu de 8/10 para 3/10. Refere que a dor, anteriormente constante e incapacitante, agora é intermitente e de menor intensidade, manifestando-se principalmente ao final do dia ou após atividades que exigem permanência prolongada na posição ortostática. Mantém uso de analgésicos (paracetamol 750mg) apenas em situações de exacerbação da dor, com frequência aproximada de 2-3 vezes por semana. Ao exame físico: marcha preservada, amplitude de movimento da coluna lombar aumentada em relação à avaliação anterior, teste de Lasègue negativo bilateralmente, força muscular preservada em membros inferiores.',
      conductGuidance: 'Reforçada orientação sobre mecânica corporal adequada e ergonomia, especialmente evitar levantamento de objetos pesados, flexão anterior excessiva do tronco e movimentos bruscos da coluna. Manter o protocolo fisioterápico em andamento, com foco em fortalecimento da musculatura paravertebral e do core, alongamento da cadeia posterior e correção postural. Continuar com uso de analgésicos (paracetamol 750mg, até 4x ao dia) conforme necessidade, em caso de dor intensa. Liberado para retorno gradual às atividades laborais, evitando sobrecarga da coluna lombar. Orientado sobre exercícios domiciliares de manutenção. Retorno programado em 45 dias para reavaliação clínica. Paciente orientado a procurar atendimento antes do retorno caso apresente sinais de alarme como dor irradiada para membros inferiores, alterações de sensibilidade, fraqueza muscular ou alterações esfincterianas.',
      professional: user?.alias || 'Dr. Pedro Santos',
      professionalId: 'current_user'
    }
  ]);

  // Definição dos períodos com datas
  const therapyPeriods = [
    { id: 'Período 01', startDate: '2024-09-01', endDate: '2024-09-30' },
    { id: 'Período 02', startDate: '2025-01-01', endDate: '2025-06-30' }
  ];

  // Último período criado
  const lastPeriod = therapyPeriods[therapyPeriods.length - 1];

  // Estados dos filtros de plano terapêutico
  const [therapyStatusFilter, setTherapyStatusFilter] = useState('');
  const [therapyStartDate, setTherapyStartDate] = useState(lastPeriod.startDate);
  const [therapyEndDate, setTherapyEndDate] = useState(lastPeriod.endDate);
  const [therapyResponsibleFilter, setTherapyResponsibleFilter] = useState('');
  const [therapyPeriodFilter, setTherapyPeriodFilter] = useState(lastPeriod.id);

  // Handler para mudança de período que atualiza as datas
  const handlePeriodChange = (periodId: string) => {
    setTherapyPeriodFilter(periodId);
    if (periodId) {
      const selectedPeriod = therapyPeriods.find(p => p.id === periodId);
      if (selectedPeriod) {
        setTherapyStartDate(selectedPeriod.startDate);
        setTherapyEndDate(selectedPeriod.endDate);
      }
    } else {
      setTherapyStartDate('');
      setTherapyEndDate('');
    }
  };

  // Lista mock de planos terapêuticos
  const [therapyPlansList, setTherapyPlansList] = useState([
    // Planos do Período 01
    {
      id: '1',
      title: 'Plano de Tratamento Cardiovascular',
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      createdDate: '2024-08-25',
      period: 'Período 01',
      objectives: [
        'Controle da pressão arterial',
        'Redução do peso em 5kg',
        'Melhora da capacidade cardiovascular'
      ],
      interventions: [
        'Medicação anti-hipertensiva',
        'Dieta com restrição de sódio',
        'Atividade física supervisionada'
      ],
      status: 'Finalizado',
      completionPercentage: 100,
      responsible: 'dr_silva'
    },
    {
      id: '2',
      title: 'Plano Nutricional para Diabetes',
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      createdDate: '2024-08-28',
      period: 'Período 01',
      objectives: [
        'Controle glicêmico adequado',
        'Redução de HbA1c em 1%',
        'Educação alimentar'
      ],
      interventions: [
        'Dieta balanceada com controle de carboidratos',
        'Orientação sobre índice glicêmico',
        'Acompanhamento semanal'
      ],
      status: 'Finalizado',
      completionPercentage: 100,
      responsible: 'dra_oliveira'
    },
    {
      id: '3',
      title: 'Terapia de Fala e Linguagem',
      startDate: '2024-09-05',
      endDate: '2024-09-30',
      createdDate: '2024-09-01',
      period: 'Período 01',
      objectives: [
        'Melhorar articulação de fonemas',
        'Aumentar vocabulário expressivo',
        'Desenvolver comunicação funcional'
      ],
      interventions: [
        'Exercícios de motricidade orofacial',
        'Atividades lúdicas de linguagem',
        'Sessões de fonoaudiologia 2x/semana'
      ],
      status: 'Finalizado',
      completionPercentage: 100,
      responsible: 'dr_santos'
    },
    {
      id: '4',
      title: 'Programa de Atividade Física Adaptada',
      startDate: '2024-09-10',
      endDate: '2024-09-30',
      createdDate: '2024-09-05',
      period: 'Período 01',
      objectives: [
        'Melhorar condicionamento físico',
        'Desenvolver coordenação motora',
        'Promover socialização'
      ],
      interventions: [
        'Exercícios aeróbicos leves',
        'Atividades em grupo',
        'Treino funcional'
      ],
      status: 'Finalizado',
      completionPercentage: 100,
      responsible: 'dra_costa'
    },
    // Planos do Período 02
    {
      id: '5',
      title: 'Plano de Reabilitação Fisioterapêutica',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      createdDate: '2024-12-20',
      period: 'Período 02',
      objectives: [
        'Recuperar amplitude de movimento',
        'Fortalecer musculatura do joelho',
        'Reduzir dor articular'
      ],
      interventions: [
        'Exercícios de fortalecimento',
        'Terapia manual',
        'Crioterapia após sessões'
      ],
      status: 'Em andamento',
      completionPercentage: 45,
      responsible: 'dra_costa'
    },
    {
      id: '6',
      title: 'Plano de Acompanhamento Psicológico',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      createdDate: '2024-12-28',
      period: 'Período 02',
      objectives: [
        'Redução dos sintomas de ansiedade',
        'Desenvolvimento de estratégias de enfrentamento',
        'Melhora da qualidade do sono'
      ],
      interventions: [
        'Terapia cognitivo-comportamental',
        'Técnicas de relaxamento',
        'Sessões semanais'
      ],
      status: 'Em andamento',
      completionPercentage: 30,
      responsible: 'dr_santos'
    },
    {
      id: '7',
      title: 'Terapia Ocupacional - Atividades de Vida Diária',
      startDate: '2025-01-05',
      endDate: '2025-06-30',
      createdDate: '2025-01-02',
      period: 'Período 02',
      objectives: [
        'Desenvolver independência em AVDs',
        'Melhorar coordenação motora fina',
        'Adaptar ambiente doméstico'
      ],
      interventions: [
        'Treino de atividades cotidianas',
        'Exercícios de preensão',
        'Orientação familiar'
      ],
      status: 'Em andamento',
      completionPercentage: 25,
      responsible: 'dra_oliveira'
    },
    {
      id: '8',
      title: 'Programa de Integração Sensorial',
      startDate: '2025-01-10',
      endDate: '2025-06-30',
      createdDate: '2025-01-05',
      period: 'Período 02',
      objectives: [
        'Melhorar processamento sensorial',
        'Reduzir comportamentos defensivos',
        'Aumentar tolerância a estímulos'
      ],
      interventions: [
        'Atividades de estimulação sensorial',
        'Terapia de integração sensorial',
        'Sessões de 45min 2x/semana'
      ],
      status: 'Pendente',
      completionPercentage: 0,
      responsible: 'dr_silva'
    },
    {
      id: '9',
      title: 'Desenvolvimento de Habilidades Sociais',
      startDate: '2025-02-01',
      endDate: '2025-06-30',
      createdDate: '2025-01-25',
      period: 'Período 02',
      objectives: [
        'Melhorar interação social',
        'Desenvolver comunicação não-verbal',
        'Promover reconhecimento de emoções'
      ],
      interventions: [
        'Dinâmicas de grupo',
        'Role-playing de situações sociais',
        'Jogos cooperativos'
      ],
      status: 'Pendente',
      completionPercentage: 0,
      responsible: 'dr_santos'
    },
    {
      id: '10',
      title: 'Acompanhamento Nutricional Pediátrico',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      createdDate: '2025-01-10',
      period: 'Período 02',
      objectives: [
        'Adequar ingestão nutricional',
        'Ganho de peso adequado',
        'Educação alimentar familiar'
      ],
      interventions: [
        'Plano alimentar individualizado',
        'Suplementação quando necessário',
        'Consultas mensais de acompanhamento'
      ],
      status: 'Em andamento',
      completionPercentage: 35,
      responsible: 'dra_oliveira'
    }
  ]);

  // Função para limpar filtros de anotações
  const handleClearNotesFilters = () => {
    setNotesStartDate('');
    setNotesEndDate('');
    setNotesUserFilter('');
    setNotesSearchText('');
  };

  // Função para limpar filtros de avaliações
  const handleClearEvaluationsFilters = () => {
    setEvalTypeFilter('');
    setEvalStatusFilter('');
    setEvalStartDate('');
    setEvalEndDate('');
    setEvalRequestedByFilter('');
  };

  // Função para limpar filtros de plano terapêutico
  const handleClearTherapyFilters = () => {
    setTherapyStatusFilter('');
    setTherapyResponsibleFilter('');
    handlePeriodChange(lastPeriod.id);
  };

  // Função para filtrar avaliações
  const filteredEvaluations = evaluationsList.filter((evaluation) => {
    // Filtro por tipo
    if (evalTypeFilter && evaluation.type !== evalTypeFilter) {
      return false;
    }

    // Filtro por status
    if (evalStatusFilter) {
      const statusMap: { [key: string]: string } = {
        'concluida': 'Finalizada',
        'pendente': 'Pendente',
        'em_andamento': 'Em andamento'
      };
      if (evaluation.status !== statusMap[evalStatusFilter]) {
        return false;
      }
    }

    // Filtro por data inicial
    if (evalStartDate) {
      const evalDate = new Date(evaluation.createdDate);
      const filterDate = new Date(evalStartDate);
      if (evalDate < filterDate) {
        return false;
      }
    }

    // Filtro por data final
    if (evalEndDate) {
      const evalDate = new Date(evaluation.createdDate);
      const filterDate = new Date(evalEndDate);
      if (evalDate > filterDate) {
        return false;
      }
    }

    // Filtro por solicitante
    if (evalRequestedByFilter && evaluation.requestedBy !== evalRequestedByFilter) {
      return false;
    }

    return true;
  });

  // Função para filtrar evoluções
  const filteredEvolutions = evolutionsList.filter((evolution) => {
    // Filtro por data inicial
    if (evolutionStartDate) {
      const evolutionDate = new Date(evolution.date);
      const filterDate = new Date(evolutionStartDate);
      if (evolutionDate < filterDate) {
        return false;
      }
    }

    // Filtro por data final
    if (evolutionEndDate) {
      const evolutionDate = new Date(evolution.date);
      const filterDate = new Date(evolutionEndDate);
      if (evolutionDate > filterDate) {
        return false;
      }
    }

    // Filtro por profissional
    if (evolutionProfessionalFilter && evolution.professionalId !== evolutionProfessionalFilter) {
      return false;
    }

    // Filtro por palavra-chave
    if (evolutionKeywordFilter) {
      const keyword = evolutionKeywordFilter.toLowerCase();
      const matchesTitle = evolution.title.toLowerCase().includes(keyword);
      const matchesTherapeutic = evolution.therapeuticEvolution?.toLowerCase().includes(keyword) || false;
      const matchesConduct = evolution.conductGuidance?.toLowerCase().includes(keyword) || false;
      const matchesProfessional = evolution.professional.toLowerCase().includes(keyword);

      if (!matchesTitle && !matchesTherapeutic && !matchesConduct && !matchesProfessional) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return evolutionSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Função para limpar filtros de evoluções
  const handleClearEvolutionsFilters = () => {
    setEvolutionStartDate('');
    setEvolutionEndDate('');
    setEvolutionProfessionalFilter('');
    setEvolutionKeywordFilter('');
  };

  // Funções para gerenciar seleção de evoluções para impressão
  const handleToggleEvolutionSelection = (evolutionId: string) => {
    console.log('=== TOGGLE CHECKBOX ===');
    console.log('ID clicado:', evolutionId);
    console.log('Estado ANTES:', selectedEvolutionsForPrint);

    setSelectedEvolutionsForPrint(prev => {
      const isSelected = prev.includes(evolutionId);
      console.log('Está selecionado?', isSelected);

      if (isSelected) {
        const newState = prev.filter(id => id !== evolutionId);
        console.log('Removendo - Novo estado:', newState);
        return newState;
      } else {
        const newState = [...prev, evolutionId];
        console.log('Adicionando - Novo estado:', newState);
        return newState;
      }
    });
  };

  const handleSelectAllEvolutions = () => {
    console.log('=== SELECIONAR TODOS ===');
    const filteredIds = filteredEvolutions.map(ev => ev.id);
    console.log('IDs filtrados:', filteredIds);
    console.log('Estado atual:', selectedEvolutionsForPrint);

    const allCurrentSelected = filteredIds.length > 0 && filteredIds.every(id => selectedEvolutionsForPrint.includes(id));
    console.log('Todos já selecionados?', allCurrentSelected);

    if (allCurrentSelected) {
      // Desmarcar todos os itens filtrados (mantém seleções de outras páginas/filtros)
      console.log('→ Desmarcando todos');
      setSelectedEvolutionsForPrint(prev => {
        const newState = prev.filter(id => !filteredIds.includes(id));
        console.log('Novo estado:', newState);
        return newState;
      });
    } else {
      // Marcar todos os itens filtrados (mantém seleções anteriores)
      console.log('→ Marcando todos');
      setSelectedEvolutionsForPrint(prev => {
        const allIds = new Set([...prev, ...filteredIds]);
        const newState = Array.from(allIds);
        console.log('Novo estado:', newState);
        return newState;
      });
    }
  };

  // Verificar se todos os itens filtrados estão selecionados
  const filteredIds = filteredEvolutions.map(ev => ev.id);
  const isAllEvolutionsSelected = filteredEvolutions.length > 0 && filteredIds.every(id => selectedEvolutionsForPrint.includes(id));
  const isSomeEvolutionsSelected = filteredEvolutions.length > 0 && filteredIds.some(id => selectedEvolutionsForPrint.includes(id)) && !isAllEvolutionsSelected;

  // Funções para controlar expansão de texto
  const toggleEvolutionText = (evolutionId: string, field: 'therapeutic' | 'conduct' | 'observations') => {
    setExpandedEvolutions(prev => ({
      ...prev,
      [evolutionId]: {
        therapeutic: field === 'therapeutic' ? !prev[evolutionId]?.therapeutic : prev[evolutionId]?.therapeutic || false,
        conduct: field === 'conduct' ? !prev[evolutionId]?.conduct : prev[evolutionId]?.conduct || false,
        observations: field === 'observations' ? !prev[evolutionId]?.observations : prev[evolutionId]?.observations || false
      }
    }));
  };

  const isTextExpanded = (evolutionId: string, field: 'therapeutic' | 'conduct' | 'observations') => {
    const result = showAllExpanded ? true : (expandedEvolutions[evolutionId]?.[field] || false);
    console.log(`📖 isTextExpanded(${evolutionId}, ${field}): showAllExpanded=${showAllExpanded}, result=${result}`);
    return result;
  };

  // Handlers do modal de evolução
  const handleSaveEvolution = (evolutionData: any) => {
    console.log('Salvar nova evolução:', evolutionData);
    // TODO: Implementar lógica de salvamento (adicionar à lista ou enviar ao backend)
    setIsEvolutionModalOpen(false);
  };

  const handleUpdateEvolution = (evolutionData: any) => {
    console.log('Atualizar evolução:', editingEvolution?.id, evolutionData);
    // TODO: Implementar lógica de atualização (atualizar na lista ou enviar ao backend)
    setIsEvolutionModalOpen(false);
  };

  const handleConfirmDeleteEvolution = () => {
    console.log('Deletar evolução:', evolutionToDelete?.id);
    // TODO: Implementar lógica de exclusão (remover da lista ou enviar ao backend)
    setIsDeleteEvolutionModalOpen(false);
    setEvolutionToDelete(null);
  };

  const handleCloseDeleteEvolutionModal = () => {
    setIsDeleteEvolutionModalOpen(false);
    setEvolutionToDelete(null);
  };

  const handleCloseEvolutionModal = () => {
    setIsEvolutionModalOpen(false);
    setEditingEvolution(null);
  };

  // Função para filtrar planos terapêuticos
  const filteredTherapyPlans = therapyPlansList.filter((plan) => {
    // Filtro por status
    if (therapyStatusFilter) {
      const statusMap: { [key: string]: string } = {
        'finalizado': 'Finalizado',
        'pendente': 'Pendente',
        'em_andamento': 'Em andamento'
      };
      if (plan.status !== statusMap[therapyStatusFilter]) {
        return false;
      }
    }

    // Filtro por data inicial
    if (therapyStartDate) {
      const planDate = new Date(plan.createdDate);
      const filterDate = new Date(therapyStartDate);
      if (planDate < filterDate) {
        return false;
      }
    }

    // Filtro por data final
    if (therapyEndDate) {
      const planDate = new Date(plan.createdDate);
      const filterDate = new Date(therapyEndDate);
      if (planDate > filterDate) {
        return false;
      }
    }

    // Filtro por responsável
    if (therapyResponsibleFilter && plan.responsible !== therapyResponsibleFilter) {
      return false;
    }

    // Filtro por período
    if (therapyPeriodFilter && plan.period !== therapyPeriodFilter) {
      return false;
    }

    return true;
  });

  // Funções para gerenciar anotações
  const handleOpenNoteModal = (note?: any) => {
    if (note) {
      setCurrentNote(note);
      setNoteFormData({
        content: note.content,
        important: note.important || false
      });
    } else {
      setCurrentNote(null);
      setNoteFormData({
        content: '',
        important: false
      });
    }
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setCurrentNote(null);
    setNoteFormData({
      content: '',
      important: false
    });
  };

  const handleSaveNote = () => {
    // TODO: Implementar lógica de salvamento
    console.log('Salvando anotação:', noteFormData);
    handleCloseNoteModal();
  };

  const handleOpenDeleteNoteModal = (note: any) => {
    setCurrentNote(note);
    setIsDeleteNoteModalOpen(true);
  };

  const handleCloseDeleteNoteModal = () => {
    setIsDeleteNoteModalOpen(false);
    setCurrentNote(null);
  };

  const handleDeleteNote = () => {
    // TODO: Implementar lógica de exclusão
    console.log('Excluindo anotação:', currentNote);
    handleCloseDeleteNoteModal();
  };

  // Funções para gerenciar agendamentos
  const handleOpenAppointmentModal = (appointment?: any) => {
    if (appointment) {
      // Modo edição
      setAppointmentModalData({
        patient: formData.name,
        startDate: appointment.date,
        startTime: appointment.startTime,
        endDate: appointment.date,
        endTime: appointment.endTime,
        professional: appointment.professional,
        serviceType: appointment.service,
        observations: appointment.observations || ''
      });
      setAppointmentModalMode('edit');
    } else {
      // Modo criação
      const today = new Date().toISOString().split('T')[0];
      setAppointmentModalData({
        patient: formData.name,
        startDate: today,
        endDate: today
      });
      setAppointmentModalMode('create');
    }
    setIsAppointmentModalOpen(true);
  };

  const handleCloseAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setAppointmentModalData({});
  };

  const handleSaveAppointment = (data: AppointmentData) => {
    // TODO: Implementar lógica de salvamento
    console.log('Salvando agendamento:', data);
    handleCloseAppointmentModal();
  };

  // Funções para gerenciar diagnósticos
  const handleOpenDiagnosisModal = (diagnosis?: any) => {
    if (diagnosis) {
      setCurrentDiagnosis(diagnosis);
      setDiagnosisFormData({
        cid: diagnosis.cid,
        observations: diagnosis.observations || ''
      });
      setCidSearchText(`${diagnosis.cid} - ${diagnosis.name}`);
    } else {
      setCurrentDiagnosis(null);
      setDiagnosisFormData({
        cid: '',
        observations: ''
      });
      setCidSearchText('');
    }
    setIsDiagnosisModalOpen(true);
  };

  const handleCloseDiagnosisModal = () => {
    setIsDiagnosisModalOpen(false);
    setCurrentDiagnosis(null);
    setDiagnosisFormData({
      cid: '',
      observations: ''
    });
    setCidSearchText('');
  };

  const handleSaveDiagnosis = () => {
    // TODO: Implementar lógica de salvamento
    console.log('Salvando diagnóstico:', diagnosisFormData);
    handleCloseDiagnosisModal();
  };

  const handleOpenDeleteDiagnosisModal = (diagnosis: any) => {
    setCurrentDiagnosis(diagnosis);
    setIsDeleteDiagnosisModalOpen(true);
  };

  const handleCloseDeleteDiagnosisModal = () => {
    setIsDeleteDiagnosisModalOpen(false);
    setCurrentDiagnosis(null);
  };

  const handleDeleteDiagnosis = () => {
    // TODO: Implementar lógica de exclusão
    console.log('Excluindo diagnóstico:', currentDiagnosis);
    handleCloseDeleteDiagnosisModal();
  };

  // Funções dos modais de avaliação
  const handleOpenEvaluationModal = (evaluation?: any) => {
    if (evaluation) {
      setCurrentEvaluation(evaluation);
      setEvaluationFormData({
        form: evaluation.form || '',
        observations: evaluation.observations || '',
        deadline: evaluation.deadline || ''
      });
    } else {
      setCurrentEvaluation(null);
      setEvaluationFormData({
        form: '',
        observations: '',
        deadline: ''
      });
    }
    setIsEvaluationModalOpen(true);
  };

  const handleCloseEvaluationModal = () => {
    setIsEvaluationModalOpen(false);
    setCurrentEvaluation(null);
    setEvaluationFormData({
      form: '',
      observations: '',
      deadline: ''
    });
  };

  const handleSaveEvaluation = () => {
    if (currentEvaluation) {
      // Editar avaliação existente
      setEvaluationsList(evaluationsList.map(evaluation =>
        evaluation.id === currentEvaluation.id
          ? { ...evaluation, observations: evaluationFormData.observations, deadline: evaluationFormData.deadline }
          : evaluation
      ));
    } else {
      // Criar nova avaliação
      const newEvaluation = {
        id: `${Date.now()}`,
        form: evaluationFormData.form,
        type: 'inicial',
        observations: evaluationFormData.observations,
        deadline: evaluationFormData.deadline,
        createdDate: new Date().toISOString().split('T')[0],
        completionPercentage: 0,
        status: 'Pendente',
        requestedBy: 'dr_silva'
      };
      setEvaluationsList([...evaluationsList, newEvaluation]);
    }
    handleCloseEvaluationModal();
  };

  const handleOpenDeleteEvaluationModal = (evaluation: any) => {
    setCurrentEvaluation(evaluation);
    setIsDeleteEvaluationModalOpen(true);
  };

  const handleCloseDeleteEvaluationModal = () => {
    setIsDeleteEvaluationModalOpen(false);
    setCurrentEvaluation(null);
  };

  const handleDeleteEvaluation = () => {
    setEvaluationsList(evaluationsList.filter(evaluation => evaluation.id !== currentEvaluation.id));
    handleCloseDeleteEvaluationModal();
  };

  // Filtrar CIDs baseado no texto de busca
  const filteredCidList = cidList.filter(cid =>
    cidSearchText.length >= 3 &&
    (cid.code.toLowerCase().includes(cidSearchText.toLowerCase()) ||
     cid.description.toLowerCase().includes(cidSearchText.toLowerCase()))
  );

  // Dados mock de anotações (será substituído por dados reais)
  const allNotesMock = [
    { id: 1, date: '2024-03-15', time: '14:30', content: 'Paciente apresentou melhora significativa nos sintomas após início do tratamento.', user: 'Dr. João Silva', important: true, canEdit: true },
    { id: 2, date: '2024-03-08', time: '09:15', content: 'Paciente relatou dificuldades para dormir. Recomendado ajuste na medicação.', user: 'Dr. João Silva', important: false, canEdit: false },
  ];

  // Filtragem de anotações
  const filteredNotes = allNotesMock.filter(note => {
    // Filtro de busca por texto (mínimo 3 caracteres)
    if (notesSearchText && notesSearchText.length >= 3) {
      const searchLower = notesSearchText.toLowerCase();
      if (!note.content.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filtro por usuário
    if (notesUserFilter && note.user.toLowerCase() !== notesUserFilter.toLowerCase().replace('_', ' ')) {
      return false;
    }

    // Filtro por data inicial
    if (notesStartDate && note.date < notesStartDate) {
      return false;
    }

    // Filtro por data final
    if (notesEndDate && note.date > notesEndDate) {
      return false;
    }

    return true;
  });

  const totalNotes = filteredNotes.length;
  const totalNotesPages = Math.ceil(totalNotes / notesItemsPerPage);
  const notesStartIndex = (notesCurrentPage - 1) * notesItemsPerPage;
  const notesEndIndex = notesStartIndex + notesItemsPerPage;
  const paginatedNotes = filteredNotes.slice(notesStartIndex, notesEndIndex);

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

    // Validação: data de nascimento não pode ser maior que hoje
    if (birth > today) {
      return 'Data inválida';
    }

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
      { id: 'cadastro', label: 'Cadastro', enabled: true, icon: Person, color: '#03B4C6' },
      { id: 'resumo', label: 'Resumo', enabled: true, icon: Assessment, color: '#2196f3' },
      { id: 'anotacoes', label: 'Anotações', enabled: true, icon: Note, color: '#ff9800' },
      { id: 'agenda', label: 'Agenda', enabled: true, icon: Event, color: '#9c27b0' },
      { id: 'diagnostico', label: 'Diagnóstico', enabled: true, icon: LocalHospital, color: '#f44336' },
      { id: 'avaliacoes', label: 'Avaliações', enabled: true, icon: Assignment, color: '#4caf50' },
      { id: 'plano-terap', label: 'Plano Terap', enabled: true, icon: Psychology, color: '#e91e63' },
      { id: 'evolucoes', label: 'Evoluções', enabled: true, icon: Timeline, color: '#00bcd4' },
      { id: 'financeiro', label: 'Financeiro', enabled: true, icon: AttachMoney, color: '#4caf50' },
      { id: 'receituario', label: 'Receituário', enabled: true, icon: LocalPharmacy, color: '#009688' },
      { id: 'arquivos', label: 'Arquivos', enabled: true, icon: Folder, color: '#795548' }
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1,
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
              {isNewPatient ? 'Cadastro de Paciente' : formData.name || 'Paciente'}
            </Typography>
            {isNewPatient ? (
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary,
                  pb: '15px'
                }}
              >
                Preencha os dados para cadastrar um novo paciente no sistema.
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary,
                  pb: '15px'
                }}
              >
                ID: {formData.id}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaqButton />
          </Box>
        </Box>

        <div className="patient-register-container">
          {/* Tabs de navegação */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: '-5px', mx: '-1.5rem' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => handleTabChange(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: '1.5rem',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minHeight: '48px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#6c757d',
                  padding: '12px 12px',
                  minWidth: 'auto',
                  '&.Mui-selected': {
                    color: '#03B4C6',
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#03B4C6',
                  height: '3px',
                },
                '& .MuiTabScrollButton-root': {
                  width: '30px',
                  padding: '0',
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
                    icon={<IconComponent sx={{ fontSize: '1rem', color: tab.color }} />}
                    iconPosition="start"
                    disabled={!tab.enabled}
                  />
                );
              })}
            </Tabs>
          </Box>

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
                      {/* Grid de migração - 3 colunas com bordas */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          md: 'repeat(3, 1fr)'
                        },
                        gap: 2,
                        mb: '15px',
                        '& > div': {
                          pt: '10px',
                          px: 0,
                          pb: '5px'
                        }
                      }}>
                        <Box>
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
                            error={!!errors.name}
                            helperText={errors.name}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
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
                            error={!!errors.birthDate}
                            helperText={errors.birthDate}
                            InputLabelProps={{ shrink: true }}
                          />
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
                            sx={{
                              '& .MuiInputBase-input': {
                                fontSize: '12px'
                              }
                            }}
                          />
                        </Box>
                        <Box>
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
                          >
                            <MenuItem value="" disabled>Selecione</MenuItem>
                            <MenuItem value="Masculino">Masculino</MenuItem>
                            <MenuItem value="Feminino">Feminino</MenuItem>
                            <MenuItem value="Outro">Outro</MenuItem>
                          </TextField>
                        </Box>
                      </Box>

                      {/* Segunda linha do grid de migração */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          md: 'repeat(3, 1fr)'
                        },
                        gap: 2,
                        mb: '15px',
                        '& > div': {
                          pt: '10px',
                          px: 0,
                          pb: '5px'
                        }
                      }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            id="documentType-new"
                            name="documentType"
                            label="Tipo de Documento*"
                            value={formData.documentType}
                            onChange={handleInputChange}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          >
                            <MenuItem value="CPF">CPF</MenuItem>
                            <MenuItem value="RG">RG</MenuItem>
                            <MenuItem value="CNH">CNH</MenuItem>
                            <MenuItem value="Passaporte">Passaporte</MenuItem>
                          </TextField>
                          <TextField
                            fullWidth
                            size="small"
                            id="document-new"
                            name="document"
                            label="Documento*"
                            value={formData.document}
                            onChange={handleInputChange}
                            placeholder="000.000.000-00"
                            disabled={!canEdit}
                            error={!!errors.document}
                            helperText={errors.document}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            id="expeditorOrgan-new"
                            name="expeditorOrgan"
                            label="Órgão Expedidor"
                            value={formData.expeditorOrgan}
                            onChange={handleInputChange}
                            placeholder="SSP, DETRAN, etc."
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            id="originCountry-new"
                            name="originCountry"
                            label="País de Origem*"
                            value={formData.originCountry}
                            onChange={handleInputChange}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          >
                            <MenuItem value="Brasil">Brasil</MenuItem>
                            <MenuItem value="Argentina">Argentina</MenuItem>
                            <MenuItem value="Estados Unidos">Estados Unidos</MenuItem>
                          </TextField>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            id="nativeLanguage-new"
                            name="nativeLanguage"
                            label="Idioma Nativo*"
                            value={formData.nativeLanguage}
                            onChange={handleInputChange}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          >
                            <MenuItem value="Português">Português</MenuItem>
                            <MenuItem value="Inglês">Inglês</MenuItem>
                            <MenuItem value="Espanhol">Espanhol</MenuItem>
                          </TextField>
                        </Box>
                      </Box>

                      {/* Terceira linha do grid de migração */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          md: 'repeat(3, 1fr)'
                        },
                        gap: 2,
                        mb: '15px',
                        '& > div': {
                          pt: '2px',
                          px: 0,
                          pb: '5px'
                        },
                        '& > div:nth-child(2), & > div:nth-child(3)': {
                          pt: '10px'
                        }
                      }}>
                        <Box>
                          <FormControl component="fieldset" error={!!errors.isResponsible}>
                            <FormLabel component="legend" sx={{ fontSize: '11px', color: '#6c757d', mb: 0.5, pt: 0 }}>
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
                              <FormControlLabel value="true" control={<Radio size="small" />} label="Sim" disabled={!canEdit} />
                              <FormControlLabel value="false" control={<Radio size="small" />} label="Não" disabled={!canEdit} />
                            </RadioGroup>
                            {errors.isResponsible && <Typography variant="caption" color="error">{errors.isResponsible}</Typography>}
                          </FormControl>
                        </Box>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            id="phone-new"
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
                          />
                        </Box>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            type="email"
                            id="email-new"
                            name="email"
                            label={`E-mail${formData.isResponsible ? '*' : ''}`}
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="email@exemplo.com"
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      </Box>


                      {/* Responsáveis (condicional) */}
                      {!formData.isResponsible && (
                        <>
                          <div className="responsible-divider">
                            <h4>Responsáveis</h4>
                          </div>

                          {/* 1º Responsável - Grid de 3 colunas */}
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              md: 'repeat(3, 1fr)'
                            },
                            gap: 2,
                            mb: '15px',
                            '& > div': {
                              pt: '10px',
                              px: 0,
                              pb: '5px'
                            }
                          }}>
                            <Box>
                              <TextField
                                fullWidth
                                size="small"
                                id="responsibleName-new"
                                name="responsibleName"
                                label="Nome Completo (1º Resp)*"
                                value={formData.responsibleName}
                                onChange={handleInputChange}
                                placeholder="Nome completo do responsável"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                              <TextField
                                fullWidth
                                size="small"
                                id="responsibleDocument-new"
                                name="responsibleDocument"
                                label="CPF"
                                value={formData.responsibleDocument}
                                onChange={handleInputChange}
                                placeholder="000.000.000-00"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                              />
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
                                sx={{ whiteSpace: 'nowrap' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <TextField
                                fullWidth
                                size="small"
                                id="responsiblePhone-new"
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
                              />
                              <TextField
                                fullWidth
                                size="small"
                                type="email"
                                id="responsibleEmail-new"
                                name="responsibleEmail"
                                label="E-mail"
                                value={formData.responsibleEmail}
                                onChange={handleInputChange}
                                placeholder="email@exemplo.com"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Box>
                          </Box>

                          {/* 2º Responsável - Grid de 3 colunas */}
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              md: 'repeat(3, 1fr)'
                            },
                            gap: 2,
                            mb: '15px',
                            '& > div': {
                              pt: '10px',
                              px: 0,
                              pb: '5px'
                            }
                          }}>
                            <Box>
                              <TextField
                                fullWidth
                                size="small"
                                id="responsible2Name-new"
                                name="responsible2Name"
                                label="Nome Completo (2º Resp)"
                                value={formData.responsible2Name}
                                onChange={handleInputChange}
                                placeholder="Nome completo do 2º responsável"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                              <TextField
                                fullWidth
                                size="small"
                                id="responsible2Document-new"
                                name="responsible2Document"
                                label="CPF"
                                value={formData.responsible2Document}
                                onChange={handleInputChange}
                                placeholder="000.000.000-00"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                              />
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
                                sx={{ whiteSpace: 'nowrap' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <TextField
                                fullWidth
                                size="small"
                                id="responsible2Phone-new"
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
                              />
                              <TextField
                                fullWidth
                                size="small"
                                type="email"
                                id="responsible2Email-new"
                                name="responsible2Email"
                                label="E-mail"
                                value={formData.responsible2Email}
                                onChange={handleInputChange}
                                placeholder="email@exemplo.com"
                                disabled={!canEdit}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Box>
                          </Box>
                        </>
                      )}

                      {/* Seção: Endereço */}
                      <div className="responsible-divider">
                        <h4>Endereço</h4>
                      </div>

                      {/* Primeira linha de Endereço - Grid de 3 colunas */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          md: 'repeat(3, 1fr)'
                        },
                        gap: 2,
                        mb: '15px',
                        '& > div': {
                          pt: '10px',
                          px: 0,
                          pb: '5px'
                        }
                      }}>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            id="cep-new"
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
                          />
                        </Box>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            id="address-new"
                            name="address"
                            label="Logradouro*"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Rua, Avenida, etc."
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            id="number-new"
                            name="number"
                            label="Número*"
                            value={formData.number}
                            onChange={handleInputChange}
                            placeholder="123"
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            id="complement-new"
                            name="complement"
                            label="Complemento"
                            value={formData.complement}
                            onChange={handleInputChange}
                            placeholder="Apto, Bloco, etc."
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      </Box>

                      {/* Segunda linha de Endereço - Grid de 3 colunas */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          md: 'repeat(3, 1fr)'
                        },
                        gap: 2,
                        mb: '15px',
                        '& > div': {
                          pt: '10px',
                          px: 0,
                          pb: '5px'
                        }
                      }}>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            id="neighborhood-new"
                            name="neighborhood"
                            label="Bairro*"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            placeholder="Nome do bairro"
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            id="city-new"
                            name="city"
                            label="Cidade*"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Nome da cidade"
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            id="uf-new"
                            name="uf"
                            label="UF*"
                            value={formData.uf}
                            onChange={handleInputChange}
                            disabled={!canEdit}
                            InputLabelProps={{ shrink: true }}
                          >
                            <MenuItem value="" disabled>Selecione</MenuItem>
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
                        </Box>
                      </Box>

                      {/* Observações ocupando 3 colunas dentro da seção de endereço */}
                      <div className="responsible-divider">
                        <h4>Observações</h4>
                      </div>

                      {/* Grid de Observações - 1 coluna ocupando o tamanho de 3 colunas */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          md: 'repeat(3, 1fr)'
                        },
                        gap: 2,
                        mb: '15px',
                        '& > div': {
                          pt: '10px',
                          px: 0,
                          pb: '5px'
                        }
                      }}>
                        <Box sx={{ gridColumn: 'span 3' }}>
                          <TextField
                            label="Observações Gerais"
                            fullWidth
                            multiline
                            rows={3}
                            name="observations"
                            value={formData.observations}
                            onChange={handleInputChange}
                            placeholder="Observações sobre o paciente"
                            disabled={!canEdit}
                            InputLabelProps={{
                              shrink: inputs.multiline.labelShrink,
                              sx: {
                                fontSize: inputs.multiline.labelFontSize,
                                color: inputs.multiline.labelColor,
                                backgroundColor: inputs.multiline.labelBackground,
                                padding: inputs.multiline.labelPadding,
                                '&.Mui-focused': {
                                  color: colors.primary,
                                },
                              },
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                position: inputs.multiline.position,
                                opacity: inputs.multiline.opacity,
                                alignItems: inputs.multiline.alignItems,
                                fontSize: inputs.multiline.fontSize,
                                minHeight: inputs.multiline.minHeight,
                                maxHeight: inputs.multiline.maxHeight,
                                overflow: inputs.multiline.overflow,
                                padding: 0,
                                '& fieldset': {
                                  borderColor: inputs.multiline.borderColor,
                                },
                                '&:hover fieldset': {
                                  borderColor: inputs.multiline.borderColor,
                                },
                                '& textarea': {
                                  wordWrap: inputs.multiline.wordWrap,
                                  whiteSpace: inputs.multiline.whiteSpace,
                                  padding: inputs.multiline.inputPadding,
                                  height: inputs.multiline.textareaHeight,
                                  maxHeight: inputs.multiline.textareaMaxHeight,
                                  overflow: `${inputs.multiline.textareaOverflow} !important`,
                                  boxSizing: inputs.multiline.textareaBoxSizing,
                                  '&::-webkit-scrollbar': {
                                    width: inputs.multiline.scrollbarWidth,
                                  },
                                  '&::-webkit-scrollbar-track': {
                                    backgroundColor: inputs.multiline.scrollbarTrackColor,
                                  },
                                  '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: inputs.multiline.scrollbarThumbColor,
                                    borderRadius: '4px',
                                    '&:hover': {
                                      backgroundColor: inputs.multiline.scrollbarThumbHoverColor,
                                    },
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Grid: Canal de entrada, Indicado por e Status */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          md: 'repeat(3, 1fr)'
                        },
                        gap: 2,
                        mb: '15px',
                        '& > div': {
                          pt: '2px',
                          px: 0,
                          pb: '5px'
                        },
                        '& > div:nth-child(1), & > div:nth-child(2)': {
                          pt: '10px'
                        }
                      }}>
                        <Box>
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
                        </Box>

                        <Box>
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
                          />
                        </Box>

                        <Box>
                          <FormControl component="fieldset">
                            <FormLabel component="legend" sx={{ fontSize: '11px', color: '#6c757d', mb: 0.5, pt: 0 }}>
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
                        </Box>
                      </Box>

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
              <Box sx={{ p: 2, pt: '6px', px: '11px' }}>
                {/* Workflow Section */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
                    gap: 2
                  }}>
                    {/* Card 1: Cadastro */}
                    <Box sx={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      position: 'relative',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Person sx={{ fontSize: '1.8rem', color: colors.primary }} />
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: '#4caf50',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Check sx={{ fontSize: '0.875rem', color: '#fff' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: colors.textPrimary }}>
                        Cadastro
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.textSecondary, lineHeight: 1.4 }}>
                        Dados cadastrais do paciente
                      </Typography>
                    </Box>

                    {/* Card 2: Diagnóstico */}
                    <Box sx={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      p: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      position: 'relative',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <LocalHospital sx={{ fontSize: '1.8rem', color: '#f44336' }} />
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: '#ff9800',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Warning sx={{ fontSize: '0.875rem', color: '#fff' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: colors.textPrimary }}>
                        Diagnóstico
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.textSecondary, lineHeight: 1.4 }}>
                        Diagnóstico clínico
                      </Typography>
                    </Box>

                    {/* Card 3: Plano terapêutico */}
                    <Box sx={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      p: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      position: 'relative',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Assignment sx={{ fontSize: '1.8rem', color: '#2196f3' }} />
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: '#ff9800',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Warning sx={{ fontSize: '0.875rem', color: '#fff' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: colors.textPrimary }}>
                        Plano terap.
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.textSecondary, lineHeight: 1.4 }}>
                        Plano terapêutico
                      </Typography>
                    </Box>

                    {/* Card 4: Agendamento */}
                    <Box sx={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      p: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      position: 'relative',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Event sx={{ fontSize: '1.8rem', color: '#9c27b0' }} />
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: '#ff9800',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Warning sx={{ fontSize: '0.875rem', color: '#fff' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: colors.textPrimary }}>
                        Agendamento
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.textSecondary, lineHeight: 1.4 }}>
                        Sessões agendadas
                      </Typography>
                    </Box>

                    {/* Card 5: Atendimentos */}
                    <Box sx={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      p: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      position: 'relative',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <MedicalServices sx={{ fontSize: '1.8rem', color: '#4caf50' }} />
                        <Box sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: '#ff9800',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Warning sx={{ fontSize: '0.875rem', color: '#fff' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: colors.textPrimary }}>
                        Atendimentos
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: colors.textSecondary, lineHeight: 1.4 }}>
                        Histórico de sessões
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Grid: Gráfico de Status, Resumo e Supervisores */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 2fr' },
                  gap: 3,
                }}>
                  {/* Gráfico de Status de Presença */}
                  <Box sx={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    p: 3,
                  }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2, color: colors.textPrimary }}>
                      Status de presença
                    </Typography>

                    {/* Filtros */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      mb: 3,
                    }}>
                      <TextField
                        select
                        size="small"
                        defaultValue=""
                        label="Profissional"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                          },
                        }}
                      >
                        <MenuItem value="">Todos os profissionais</MenuItem>
                        <MenuItem value="1">Dr. João Silva</MenuItem>
                        <MenuItem value="2">Dra. Maria Santos</MenuItem>
                      </TextField>

                      <Box sx={{ height: '10px' }} />

                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField
                          type="date"
                          size="small"
                          label="Data Inicial"
                          value={attendanceStartDate}
                          onChange={(e) => setAttendanceStartDate(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            flex: 1,
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.875rem',
                            },
                          }}
                        />

                        <TextField
                          type="date"
                          size="small"
                          label="Data Final"
                          value={attendanceEndDate}
                          onChange={(e) => setAttendanceEndDate(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            flex: 1,
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Gráfico Circular Animado */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Gráfico de pizza animado */}
                      <Box sx={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                        <svg width="120" height="120" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                          {/* Background circle */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e9ecef" strokeWidth="3"/>
                          {/* Presente - 60% */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#4caf50" strokeWidth="3"
                            strokeDasharray="60 40" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Falta - 20% */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f44336" strokeWidth="3"
                            strokeDasharray="20 80" strokeDashoffset="-60" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 0.5s forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Justificado - 20% */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ff9800" strokeWidth="3"
                            strokeDasharray="20 80" strokeDashoffset="-80" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 1s forwards',
                              strokeDashoffset: '100'
                            }}/>
                        </svg>

                        {/* Total no centro */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                            46
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {/* Lista de estatísticas */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%' }}></Box>
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Presente</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>42 (60%)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#f44336', borderRadius: '50%' }}></Box>
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Falta</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>3 (20%)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#ff9800', borderRadius: '50%' }}></Box>
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Justificado</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>1 (20%)</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Resumo de Presenças */}
                  <Box sx={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    p: 3,
                  }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BarChart sx={{ fontSize: '1.1rem' }} />
                      Resumo de Presenças
                    </Typography>

                    {/* Última presença */}
                    <Box sx={{ mb: 2.5, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <CalendarToday sx={{ fontSize: '0.875rem', color: colors.textSecondary }} />
                        <Typography sx={{ fontSize: '0.75rem', color: colors.textSecondary }}>
                          Última presença:
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.textPrimary }}>
                        15/03/2024
                      </Typography>
                    </Box>

                    {/* Total Geral */}
                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1.5, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp sx={{ fontSize: '1rem' }} />
                        Total Geral
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#4caf50', lineHeight: 1 }}>
                            42
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mt: 0.5 }}>
                            Presenças
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#f44336', lineHeight: 1 }}>
                            3
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mt: 0.5 }}>
                            Faltas
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff9800', lineHeight: 1 }}>
                            1
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mt: 0.5 }}>
                            Cancelam.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Últimos 30 dias */}
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1.5, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday sx={{ fontSize: '1rem' }} />
                        Últimos 30 dias
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#4caf50', lineHeight: 1 }}>
                            12
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mt: 0.5 }}>
                            Presenças
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#f44336', lineHeight: 1 }}>
                            1
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mt: 0.5 }}>
                            Faltas
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff9800', lineHeight: 1 }}>
                            0
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mt: 0.5 }}>
                            Cancelam.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Supervisores x Supervisionados */}
                  <Box sx={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    p: 3,
                  }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2, color: colors.textPrimary }}>
                      Supervisores x Supervisionados
                    </Typography>

                    {/* Filtro por Supervisor */}
                    <Box sx={{ mb: 2.5 }}>
                      <TextField
                        select
                        size="small"
                        defaultValue=""
                        label="Filtrar por Supervisor"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '100%',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                          },
                        }}
                      >
                        <MenuItem value="">Todos os supervisores</MenuItem>
                        <MenuItem value="1">Dr. João Silva</MenuItem>
                        <MenuItem value="2">Dra. Maria Santos</MenuItem>
                        <MenuItem value="3">Dr. Carlos Oliveira</MenuItem>
                      </TextField>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      maxHeight: '400px',
                      overflowY: 'auto',
                      pr: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: '#555',
                        },
                      },
                    }}>
                      {/* Item 1 */}
                      <Box sx={{
                        p: 1.5,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '6px',
                        borderLeft: '3px solid',
                        borderLeftColor: colors.primary,
                      }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Supervisor
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.textPrimary }}>
                              Dr. João Silva
                            </Typography>
                          </Box>
                          <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Supervisionado
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.textPrimary }}>
                              Dra. Maria Santos
                            </Typography>
                          </Box>
                          <Box sx={{ flex: '0 0 auto', display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Box sx={{ minWidth: '70px' }}>
                              <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5 }}>
                                Início
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: colors.textPrimary }}>
                                15/01/2024
                              </Typography>
                            </Box>
                            <Box sx={{ minWidth: '70px' }}>
                              <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5 }}>
                                Fim
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: colors.textPrimary }}>
                                15/12/2024
                              </Typography>
                            </Box>
                            <Switch defaultChecked size="small" />
                          </Box>
                        </Box>
                      </Box>

                      {/* Item 2 */}
                      <Box sx={{
                        p: 1.5,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '6px',
                        borderLeft: '3px solid',
                        borderLeftColor: colors.primary,
                      }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Supervisor
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.textPrimary }}>
                              Dr. João Silva
                            </Typography>
                          </Box>
                          <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Supervisionado
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.textPrimary }}>
                              Dr. Carlos Oliveira
                            </Typography>
                          </Box>
                          <Box sx={{ flex: '0 0 auto', display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Box sx={{ minWidth: '70px' }}>
                              <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5 }}>
                                Início
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: colors.textPrimary }}>
                                20/02/2024
                              </Typography>
                            </Box>
                            <Box sx={{ minWidth: '70px' }}>
                              <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5 }}>
                                Fim
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: colors.textPrimary }}>
                                -
                              </Typography>
                            </Box>
                            <Switch defaultChecked size="small" />
                          </Box>
                        </Box>
                      </Box>

                      {/* Item 3 */}
                      <Box sx={{
                        p: 1.5,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '6px',
                        borderLeft: '3px solid',
                        borderLeftColor: '#2196f3',
                      }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Supervisor
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.textPrimary }}>
                              Dra. Maria Santos
                            </Typography>
                          </Box>
                          <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Supervisionado
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.textPrimary }}>
                              Ana Paula Silva
                            </Typography>
                          </Box>
                          <Box sx={{ flex: '0 0 auto', display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Box sx={{ minWidth: '70px' }}>
                              <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5 }}>
                                Início
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: colors.textPrimary }}>
                                10/03/2024
                              </Typography>
                            </Box>
                            <Box sx={{ minWidth: '70px' }}>
                              <Typography sx={{ fontSize: '0.7rem', color: colors.textSecondary, mb: 0.5 }}>
                                Fim
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: colors.textPrimary }}>
                                10/06/2024
                              </Typography>
                            </Box>
                            <Switch size="small" />
                          </Box>
                        </Box>
                      </Box>

                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Conteúdo da aba Anotações */}
            {activeTab === 'anotacoes' && (
              <div className="tab-content-section">
                <Box sx={{ mb: '21px', p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: colors.textSecondary, lineHeight: 1.6 }}>
                    <strong>Importante:</strong> Esta área é destinada apenas para anotações gerais. Para registros de evolução clínica, utilize a aba "Evoluções".
                  </Typography>
                </Box>
                <div className="notes-section">
                  <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                      <TextField
                        size="small"
                        label="Buscar"
                        placeholder="Digite ao menos 3 letras..."
                        value={notesSearchText}
                        onChange={(e) => setNotesSearchText(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '250px',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            height: '40px',
                          },
                        }}
                      />
                      <TextField
                        select
                        size="small"
                        label="Usuário"
                        value={notesUserFilter}
                        onChange={(e) => setNotesUserFilter(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                          displayEmpty: true,
                          renderValue: (value) => {
                            if (value === "") return "Selecione";
                            if (value === "joao_silva") return "Dr. João Silva";
                            if (value === "maria_santos") return "Dra. Maria Santos";
                            if (value === "carlos_oliveira") return "Dr. Carlos Oliveira";
                            return value as string;
                          }
                        }}
                        sx={{
                          width: '180px',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            height: '40px',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>Selecione</MenuItem>
                        <MenuItem value="joao_silva">Dr. João Silva</MenuItem>
                        <MenuItem value="maria_santos">Dra. Maria Santos</MenuItem>
                        <MenuItem value="carlos_oliveira">Dr. Carlos Oliveira</MenuItem>
                      </TextField>
                      <TextField
                        type="date"
                        size="small"
                        label="Data Inicial"
                        value={notesStartDate}
                        onChange={(e) => setNotesStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '180px',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            height: '40px',
                          },
                        }}
                      />
                      <TextField
                        type="date"
                        size="small"
                        label="Data Final"
                        value={notesEndDate}
                        onChange={(e) => setNotesEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '180px',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            height: '40px',
                          },
                        }}
                      />
                      <Tooltip title={notesStartDate || notesEndDate || notesUserFilter || notesSearchText ? "Limpar filtros" : "Nenhum filtro aplicado"} arrow>
                        <span>
                          <IconButton
                            onClick={handleClearNotesFilters}
                            disabled={!notesStartDate && !notesEndDate && !notesUserFilter && !notesSearchText}
                            sx={{
                              bgcolor: (notesStartDate || notesEndDate || notesUserFilter || notesSearchText) ? '#6c757d' : '#e9ecef',
                              color: (notesStartDate || notesEndDate || notesUserFilter || notesSearchText) ? 'white' : '#6c757d',
                              width: 40,
                              height: 40,
                              '&:hover': {
                                bgcolor: (notesStartDate || notesEndDate || notesUserFilter || notesSearchText) ? '#5a6268' : '#e9ecef',
                              },
                              '&.Mui-disabled': {
                                bgcolor: '#e9ecef',
                                color: '#6c757d',
                                opacity: 0.5,
                              },
                            }}
                          >
                            <FilterAltOff fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                    <Tooltip title="Nova Anotação" arrow>
                      <IconButton
                        onClick={() => handleOpenNoteModal()}
                        sx={{
                          borderColor: '#03B4C6',
                          color: '#03B4C6',
                          border: '2px solid #03B4C6',
                          borderRadius: '8px',
                          width: '40px',
                          height: '40px',
                          '&:hover': {
                            borderColor: '#029AAB',
                            backgroundColor: 'rgba(3, 180, 198, 0.08)',
                          },
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Contador simplificado - Superior */}
                  <Box sx={{ mb: 2, px: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      <strong>{totalNotes}</strong> anotações encontradas
                    </Typography>
                  </Box>

                  <div className="notes-list">
                    {paginatedNotes.length === 0 ? (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                          Nenhuma anotação encontrada com os filtros aplicados.
                        </Typography>
                      </Box>
                    ) : (
                      paginatedNotes.map((note) => (
                        <Box
                          key={note.id}
                          sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            mb: 2,
                            overflow: 'hidden',
                            opacity: note.canEdit ? 1 : 0.7
                          }}
                        >
                          <Box sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}>
                            <Box sx={{ flex: 1 }}>
                              {/* Primeira linha: Data, Horário, Usuário e Badge */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>
                                  {note.date.split('-').reverse().join('/')}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                                  •
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                                  {note.time}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                                  •
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.text, fontSize: '0.9rem' }}>
                                  {note.user}
                                </Typography>
                                {note.important && (
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    backgroundColor: '#fff3cd',
                                    color: '#856404',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    border: '1px solid #ffeaa7'
                                  }}>
                                    <PriorityHigh sx={{ fontSize: '0.9rem' }} />
                                    Importante
                                  </Box>
                                )}
                                {!note.canEdit && (
                                  <Typography variant="caption" sx={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: '0.75rem', ml: 'auto' }}>
                                    Somente leitura
                                  </Typography>
                                )}
                              </Box>

                              {/* Segunda linha: Conteúdo da anotação */}
                              <Typography variant="body2" sx={{ color: colors.text, lineHeight: 1.6, fontSize: '0.875rem' }}>
                                {note.content}
                              </Typography>
                            </Box>

                            {/* Botões de ação à direita */}
                            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                              <Tooltip title={note.canEdit ? "Editar anotação" : "Você não tem permissão para editar"} arrow>
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={!note.canEdit}
                                    onClick={() => note.canEdit && handleOpenNoteModal(note)}
                                    sx={{
                                      backgroundColor: 'transparent',
                                      color: note.canEdit ? '#2196f3' : '#9e9e9e',
                                      border: `1px solid ${note.canEdit ? '#e3f2fd' : '#e0e0e0'}`,
                                      width: '32px',
                                      height: '32px',
                                      opacity: note.canEdit ? 1 : 0.5,
                                      '&:hover': note.canEdit ? {
                                        backgroundColor: '#e3f2fd',
                                        borderColor: '#2196f3',
                                      } : {}
                                    }}
                                  >
                                    <Edit sx={{ fontSize: '1rem' }} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title={note.canEdit ? "Deletar anotação" : "Você não tem permissão para deletar"} arrow>
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={!note.canEdit}
                                    onClick={() => note.canEdit && handleOpenDeleteNoteModal(note)}
                                    sx={{
                                      backgroundColor: 'transparent',
                                      color: note.canEdit ? '#dc3545' : '#9e9e9e',
                                      border: `1px solid ${note.canEdit ? '#f8d7da' : '#e0e0e0'}`,
                                      width: '32px',
                                      height: '32px',
                                      opacity: note.canEdit ? 1 : 0.5,
                                      '&:hover': note.canEdit ? {
                                        backgroundColor: '#f8d7da',
                                        borderColor: '#dc3545',
                                      } : {}
                                    }}
                                  >
                                    <Delete sx={{ fontSize: '1rem' }} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    )}
                  </div>

                  {/* Navegador de páginas - Inferior */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mt: 2,
                      bgcolor: '#f8f9fa',
                      border: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Mostrando {notesStartIndex + 1}-{Math.min(notesEndIndex, totalNotes)} de{' '}
                        <strong>{totalNotes}</strong> anotações
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Seletor de itens por página */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                            Itens por página:
                          </Typography>
                          <FormControl size="small">
                            <Select
                              value={notesItemsPerPage}
                              onChange={(e) => {
                                setNotesItemsPerPage(Number(e.target.value));
                                setNotesCurrentPage(1);
                              }}
                              sx={{
                                minWidth: 80,
                                height: '40px',
                                fontSize: '1rem',
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#ced4da',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#ced4da',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#03B4C6',
                                  boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                                },
                                '& .MuiSelect-select': {
                                  padding: '0.375rem 0.5rem',
                                  color: '#495057',
                                },
                              }}
                            >
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={15}>15</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Navegação de páginas */}
                        <Pagination
                          count={totalNotesPages}
                          page={notesCurrentPage}
                          onChange={(event, page) => setNotesCurrentPage(page)}
                          color="primary"
                          showFirstButton
                          showLastButton
                          size="small"
                          sx={{
                            '& .MuiPaginationItem-root': {
                              color: '#495057',
                              '&.Mui-selected': {
                                backgroundColor: '#03B4C6',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#029AAB',
                                },
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Agenda */}
            {activeTab === 'agenda' && (
              <div className="tab-content-section">
                <div className="agenda-section">
                  {/* Filtros */}
                  <Box sx={{ display: 'flex', gap: '1rem', mb: '21px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                      <TextField
                        select
                        size="small"
                        label="Profissional"
                        defaultValue=""
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                          displayEmpty: true,
                          renderValue: (value) => value === "" ? "Selecione" : value === "joao_silva" ? "Dr. João Silva" : "Dra. Maria Santos"
                        }}
                        sx={{
                          width: '200px',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            height: '40px',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>Selecione</MenuItem>
                        <MenuItem value="joao_silva">Dr. João Silva</MenuItem>
                        <MenuItem value="maria_santos">Dra. Maria Santos</MenuItem>
                      </TextField>
                      <TextField
                        select
                        size="small"
                        label="Status"
                        defaultValue=""
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                          displayEmpty: true,
                          renderValue: (value) => {
                            if (value === "") return "Selecione";
                            if (value === "confirmada") return "Confirmada";
                            if (value === "realizada") return "Realizada";
                            if (value === "cancelada") return "Cancelada";
                            if (value === "faltou") return "Faltou";
                            return value as string;
                          }
                        }}
                        sx={{
                          width: '180px',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            height: '40px',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>Selecione</MenuItem>
                        <MenuItem value="confirmada">Confirmada</MenuItem>
                        <MenuItem value="realizada">Realizada</MenuItem>
                        <MenuItem value="cancelada">Cancelada</MenuItem>
                        <MenuItem value="faltou">Faltou</MenuItem>
                      </TextField>
                      <TextField
                        type="date"
                        size="small"
                        label="Data Inicial"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '160px',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            height: '40px',
                          },
                        }}
                      />
                      <TextField
                        type="date"
                        size="small"
                        label="Data Final"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '160px',
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            height: '40px',
                          },
                        }}
                      />
                      <Tooltip title="Limpar filtros" arrow>
                        <span>
                          <IconButton
                            sx={{
                              bgcolor: '#e9ecef',
                              color: '#6c757d',
                              width: 40,
                              height: 40,
                              '&:hover': {
                                bgcolor: '#e9ecef',
                              },
                            }}
                          >
                            <FilterAltOff fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                    <Tooltip title="Agendar Consulta" arrow>
                      <IconButton
                        onClick={() => handleOpenAppointmentModal()}
                        sx={{
                          borderColor: '#03B4C6',
                          color: '#03B4C6',
                          border: '2px solid #03B4C6',
                          borderRadius: '8px',
                          width: '40px',
                          height: '40px',
                          '&:hover': {
                            borderColor: '#029AAB',
                            backgroundColor: 'rgba(3, 180, 198, 0.08)',
                          },
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Contador de registros */}
                  <Box sx={{ mb: 2, px: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      <strong>2</strong> consultas encontradas
                    </Typography>
                  </Box>
                  <div className="appointments-list">
                    <Box sx={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      mb: 2,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <Box sx={{ flex: 1 }}>
                          {/* Primeira linha: Data, Horário, Profissional e Status */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>
                              22/03/2024
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                              •
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                              14:00 - 15:00
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                              •
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.text, fontSize: '0.9rem' }}>
                              Dr. João Silva
                            </Typography>
                            <Box sx={{
                              backgroundColor: '#d4edda',
                              color: '#155724',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: '1px solid #c3e6cb'
                            }}>
                              Confirmada
                            </Box>
                          </Box>

                          {/* Segunda linha: Tipo de serviço e observações */}
                          <Typography variant="body2" sx={{ color: colors.text, lineHeight: 1.6, fontSize: '0.875rem' }}>
                            <strong>Consulta de Retorno</strong> - Paciente apresentou melhora significativa. Recomendado acompanhamento trimestral.
                          </Typography>
                        </Box>

                        {/* Botões de ação à direita */}
                        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                          <Tooltip title="Editar consulta" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenAppointmentModal({
                                date: '2024-03-22',
                                startTime: '14:00',
                                endTime: '15:00',
                                professional: 'Dr. João Silva',
                                service: 'Consulta de Retorno',
                                observations: 'Paciente apresentou melhora significativa. Recomendado acompanhamento trimestral.'
                              })}
                              sx={{
                                backgroundColor: 'transparent',
                                color: '#2196f3',
                                border: '1px solid #e3f2fd',
                                width: '32px',
                                height: '32px',
                                '&:hover': {
                                  backgroundColor: '#e3f2fd',
                                  borderColor: '#2196f3',
                                }
                              }}
                            >
                              <Edit sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      mb: 2,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <Box sx={{ flex: 1 }}>
                          {/* Primeira linha: Data, Horário, Profissional e Status */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>
                              15/03/2024
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                              •
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                              14:00 - 15:00
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                              •
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.text, fontSize: '0.9rem' }}>
                              Dr. João Silva
                            </Typography>
                            <Box sx={{
                              backgroundColor: '#d1ecf1',
                              color: '#0c5460',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: '1px solid #bee5eb'
                            }}>
                              Realizada
                            </Box>
                          </Box>

                          {/* Segunda linha: Tipo de serviço e observações */}
                          <Typography variant="body2" sx={{ color: colors.text, lineHeight: 1.6, fontSize: '0.875rem' }}>
                            <strong>Consulta Inicial</strong> - Primeira avaliação do paciente.
                          </Typography>
                        </Box>

                        {/* Botões de ação à direita */}
                        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                          <Tooltip title="Editar consulta" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenAppointmentModal({
                                date: '2024-03-15',
                                startTime: '14:00',
                                endTime: '15:00',
                                professional: 'Dr. João Silva',
                                service: 'Consulta Inicial',
                                observations: 'Primeira avaliação do paciente.'
                              })}
                              sx={{
                                backgroundColor: 'transparent',
                                color: '#2196f3',
                                border: '1px solid #e3f2fd',
                                width: '32px',
                                height: '32px',
                                '&:hover': {
                                  backgroundColor: '#e3f2fd',
                                  borderColor: '#2196f3',
                                }
                              }}
                            >
                              <Edit sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </div>

                  {/* Navegador de páginas - Inferior */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mt: 2,
                      bgcolor: '#f8f9fa',
                      border: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Mostrando 1-2 de <strong>2</strong> consultas
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                            Itens por página:
                          </Typography>
                          <FormControl size="small">
                            <Select
                              value={10}
                              sx={{
                                minWidth: 80,
                                height: '40px',
                                fontSize: '1rem',
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#ced4da',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#ced4da',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#03B4C6',
                                  boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                                },
                                '& .MuiSelect-select': {
                                  padding: '0.375rem 0.5rem',
                                  color: '#495057',
                                },
                              }}
                            >
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={15}>15</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        <Pagination
                          count={1}
                          page={1}
                          color="primary"
                          showFirstButton
                          showLastButton
                          size="small"
                          sx={{
                            '& .MuiPaginationItem-root': {
                              color: '#495057',
                              '&.Mui-selected': {
                                backgroundColor: '#03B4C6',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#029AAB',
                                },
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </div>
              </div>
            )}

            {/* Conteúdo da aba Diagnóstico */}
            {activeTab === 'diagnostico' && (
              <div className="tab-content-section">
                {/* Filtros e ações */}
                <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      select
                      size="small"
                      label="Status"
                      defaultValue=""
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '150px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="ativo">Ativo</MenuItem>
                      <MenuItem value="inativo">Inativo</MenuItem>
                      <MenuItem value="resolvido">Resolvido</MenuItem>
                    </TextField>
                    <TextField
                      type="date"
                      size="small"
                      label="Data Inicial"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <TextField
                      type="date"
                      size="small"
                      label="Data Final"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <Tooltip title="Limpar filtros" arrow>
                      <span>
                        <IconButton
                          sx={{
                            color: '#6c757d',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            '&:hover': {
                              bgcolor: '#e9ecef',
                            },
                          }}
                        >
                          <FilterAltOff fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                  <Tooltip title="Novo Diagnóstico" arrow>
                    <IconButton
                      onClick={() => handleOpenDiagnosisModal()}
                      sx={{
                        borderColor: '#03B4C6',
                        color: '#03B4C6',
                        border: '2px solid #03B4C6',
                        borderRadius: '8px',
                        width: '40px',
                        height: '40px',
                        '&:hover': {
                          borderColor: '#029AAB',
                          backgroundColor: 'rgba(3, 180, 198, 0.08)',
                        },
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Contador de registros */}
                <Box sx={{ mb: 2, px: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    <strong>1</strong> diagnóstico encontrado
                  </Typography>
                </Box>

                {/* Lista de diagnósticos */}
                <div className="diagnosis-list">
                  <Box sx={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    mb: 2,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <Box sx={{ flex: 1 }}>
                        {/* Primeira linha: Data, Profissional e Status */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>
                            15/03/2024
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                            •
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.text, fontSize: '0.9rem' }}>
                            Dr. João Silva
                          </Typography>
                          <Box sx={{
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: '1px solid #c3e6cb'
                          }}>
                            Ativo
                          </Box>
                        </Box>

                        {/* Segunda linha: CID, Nome do diagnóstico e descrição */}
                        <Typography variant="body2" sx={{ color: colors.text, lineHeight: 1.6, fontSize: '0.875rem' }}>
                          <strong>CID I10 - Hipertensão arterial essencial</strong> - Hipertensão arterial sistêmica de causa primária, sem complicações.
                        </Typography>
                      </Box>

                      {/* Botões de ação à direita */}
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <Tooltip title="Editar diagnóstico" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDiagnosisModal({
                              cid: 'I10',
                              name: 'Hipertensão arterial essencial',
                              observations: 'Hipertensão arterial sistêmica de causa primária, sem complicações.'
                            })}
                            sx={{
                              backgroundColor: 'transparent',
                              color: '#2196f3',
                              border: '1px solid #e3f2fd',
                              width: '32px',
                              height: '32px',
                              '&:hover': {
                                backgroundColor: '#e3f2fd',
                                borderColor: '#2196f3',
                              }
                            }}
                          >
                            <Edit sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Deletar diagnóstico" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDiagnosisModal({
                              cid: 'I10',
                              name: 'Hipertensão arterial essencial'
                            })}
                            sx={{
                              backgroundColor: 'transparent',
                              color: '#dc3545',
                              border: '1px solid #f8d7da',
                              width: '32px',
                              height: '32px',
                              '&:hover': {
                                backgroundColor: '#f8d7da',
                                borderColor: '#dc3545',
                              }
                            }}
                          >
                            <Delete sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </div>

                {/* Navegador de páginas */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: '#f8f9fa',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Mostrando 1-1 de <strong>1</strong> diagnóstico
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Seletor de itens por página */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          Itens por página:
                        </Typography>
                        <FormControl size="small">
                          <Select
                            value={10}
                            sx={{
                              minWidth: 80,
                              height: '40px',
                              fontSize: '1rem',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ced4da',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ced4da',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#03B4C6',
                                boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                              },
                              '& .MuiSelect-select': {
                                padding: '0.375rem 0.5rem',
                                color: '#495057',
                              },
                            }}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Navegação de páginas */}
                      <Pagination
                        count={1}
                        page={1}
                        color="primary"
                        showFirstButton
                        showLastButton
                        size="small"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: '#495057',
                            '&.Mui-selected': {
                              backgroundColor: '#03B4C6',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#029AAB',
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </div>
            )}

            {/* Conteúdo da aba Avaliações */}
            {activeTab === 'avaliacoes' && (
              <div className="tab-content-section">
                {/* Filtros e ações */}
                <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      select
                      size="small"
                      label="Tipo de Avaliação"
                      value={evalTypeFilter}
                      onChange={(e) => setEvalTypeFilter(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (value === "") return "Selecione";
                          if (value === "inicial") return "Avaliação Inicial";
                          if (value === "reavaliacao") return "Reavaliação";
                          if (value === "especializada") return "Avaliação Especializada";
                          return value as string;
                        }
                      }}
                      sx={{
                        width: '200px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="inicial">Avaliação Inicial</MenuItem>
                      <MenuItem value="reavaliacao">Reavaliação</MenuItem>
                      <MenuItem value="especializada">Avaliação Especializada</MenuItem>
                    </TextField>
                    <TextField
                      select
                      size="small"
                      label="Status"
                      value={evalStatusFilter}
                      onChange={(e) => setEvalStatusFilter(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (value === "") return "Selecione";
                          if (value === "concluida") return "Concluída";
                          if (value === "pendente") return "Pendente";
                          if (value === "em_andamento") return "Em Andamento";
                          return value as string;
                        }
                      }}
                      sx={{
                        width: '180px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="concluida">Concluída</MenuItem>
                      <MenuItem value="pendente">Pendente</MenuItem>
                      <MenuItem value="em_andamento">Em Andamento</MenuItem>
                    </TextField>
                    <TextField
                      type="date"
                      size="small"
                      label="Data Inicial"
                      value={evalStartDate}
                      onChange={(e) => setEvalStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <TextField
                      type="date"
                      size="small"
                      label="Data Final"
                      value={evalEndDate}
                      onChange={(e) => setEvalEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <TextField
                      select
                      size="small"
                      label="Solicitante"
                      value={evalRequestedByFilter}
                      onChange={(e) => setEvalRequestedByFilter(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (value === "") return "Selecione";
                          return value as string;
                        }
                      }}
                      sx={{
                        width: '200px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="dr_silva">Dr. Silva</MenuItem>
                      <MenuItem value="dra_oliveira">Dra. Oliveira</MenuItem>
                      <MenuItem value="dr_santos">Dr. Santos</MenuItem>
                      <MenuItem value="dra_costa">Dra. Costa</MenuItem>
                    </TextField>
                    <Tooltip title="Limpar filtros" arrow>
                      <span>
                        <IconButton
                          onClick={handleClearEvaluationsFilters}
                          sx={{
                            color: '#6c757d',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            '&:hover': {
                              bgcolor: '#e9ecef',
                            },
                          }}
                        >
                          <FilterAltOff fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                  <Tooltip title="Nova Avaliação" arrow>
                    <IconButton
                      onClick={() => handleOpenEvaluationModal()}
                      sx={{
                        borderColor: '#03B4C6',
                        color: '#03B4C6',
                        border: '2px solid #03B4C6',
                        borderRadius: '8px',
                        width: '40px',
                        height: '40px',
                        '&:hover': {
                          borderColor: '#029AAB',
                          backgroundColor: 'rgba(3, 180, 198, 0.08)',
                        },
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Contador de registros */}
                <Box sx={{ mb: 2, px: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    <strong>{filteredEvaluations.length}</strong> {filteredEvaluations.length === 1 ? 'avaliação encontrada' : 'avaliações encontradas'}
                  </Typography>
                </Box>

                {/* Lista de avaliações */}
                <div className="evaluations-list">
                  {filteredEvaluations.map((evaluation) => {
                    const isFinalized = evaluation.completionPercentage === 100;
                    const statusConfig = evaluation.status === 'Finalizada'
                      ? { bg: '#d4edda', color: '#155724', border: '#c3e6cb' }
                      : evaluation.status === 'Em andamento'
                      ? { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' }
                      : { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };

                    return (
                      <Box key={evaluation.id} sx={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        mb: 2,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <Box sx={{ flex: 1 }}>
                            {/* Primeira linha: Data, Tipo e Status */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>
                                {new Date(evaluation.createdDate).toLocaleDateString('pt-BR')}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                                •
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.text, fontSize: '0.9rem' }}>
                                Prazo: {new Date(evaluation.deadline).toLocaleDateString('pt-BR')}
                              </Typography>
                              <Box sx={{
                                backgroundColor: statusConfig.bg,
                                color: statusConfig.color,
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                border: `1px solid ${statusConfig.border}`
                              }}>
                                {evaluation.status}
                              </Box>
                            </Box>

                            {/* Segunda linha: Título e descrição */}
                            <Typography variant="body2" sx={{ color: colors.text, lineHeight: 1.6, fontSize: '0.875rem', mb: 1.5 }}>
                              <strong>{evaluation.form}</strong> - {evaluation.observations}
                            </Typography>

                            {/* Terceira linha: Barra de progresso */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: colors.textSecondary, minWidth: '40px' }}>
                                {evaluation.completionPercentage}%
                              </Typography>
                              <Box sx={{ width: '120px', position: 'relative' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={evaluation.completionPercentage}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      backgroundColor: evaluation.completionPercentage === 100 ? '#4caf50' : '#ffc107',
                                    }
                                  }}
                                />
                              </Box>
                            </Box>

                            {/* Quarta linha: Solicitante */}
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: colors.textSecondary }}>
                              Solicitante: <strong style={{ color: colors.text }}>
                                {evaluation.requestedBy === 'dr_silva' ? 'Dr. Silva' :
                                 evaluation.requestedBy === 'dra_oliveira' ? 'Dra. Oliveira' :
                                 evaluation.requestedBy === 'dr_santos' ? 'Dr. Santos' :
                                 evaluation.requestedBy === 'dra_costa' ? 'Dra. Costa' :
                                 evaluation.requestedBy}
                              </strong>
                            </Typography>
                          </Box>

                          {/* Botões de ação à direita */}
                          <Box sx={{ display: 'flex', gap: 1, ml: 2, alignSelf: 'flex-start' }}>
                            <Tooltip title="Imprimir avaliação" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const patientData = {
                                    name: formData.name,
                                    birthDate: formData.birthDate,
                                    responsible: formData.responsibleName
                                  };
                                  const evaluationData = {
                                    id: evaluation.id,
                                    form: evaluation.form,
                                    createdDate: evaluation.createdDate,
                                    deadline: evaluation.deadline,
                                    status: evaluation.status,
                                    observations: evaluation.observations,
                                    requestedBy: evaluation.requestedBy
                                  };
                                  const patientDataEncoded = encodeURIComponent(JSON.stringify(patientData));
                                  const evaluationDataEncoded = encodeURIComponent(JSON.stringify(evaluationData));
                                  window.open(`/?page=evaluation-print&patientData=${patientDataEncoded}&evaluationData=${evaluationDataEncoded}`, '_blank');
                                }}
                                sx={{
                                  backgroundColor: 'transparent',
                                  color: actionIcons.print.color,
                                  border: `1px solid ${actionIcons.print.borderColor}`,
                                  width: '32px',
                                  height: '32px',
                                  '&:hover': {
                                    backgroundColor: actionIcons.print.hoverBackgroundColor,
                                    borderColor: actionIcons.print.hoverBorderColor,
                                  }
                                }}
                              >
                                <Print sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Exportar para Excel" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // TODO: Implementar exportação para Excel
                                  console.log('Exportar avaliação para Excel:', evaluation);
                                }}
                                sx={{
                                  backgroundColor: 'transparent',
                                  color: actionIcons.excel.color,
                                  border: `1px solid ${actionIcons.excel.borderColor}`,
                                  width: '32px',
                                  height: '32px',
                                  '&:hover': {
                                    backgroundColor: actionIcons.excel.hoverBackgroundColor,
                                    borderColor: actionIcons.excel.hoverBorderColor,
                                  }
                                }}
                              >
                                <FileDownload sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Acessar avaliação" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // TODO: Navegar para página de avaliação
                                  console.log('Acessar avaliação:', evaluation);
                                }}
                                sx={{
                                  backgroundColor: 'transparent',
                                  color: '#03B4C6',
                                  border: '1px solid #e0f7fa',
                                  width: '32px',
                                  height: '32px',
                                  '&:hover': {
                                    backgroundColor: '#e0f7fa',
                                    borderColor: '#03B4C6',
                                  }
                                }}
                              >
                                <OpenInNew sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={isFinalized ? "Avaliação finalizada não pode ser editada" : "Editar avaliação"} arrow>
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={isFinalized}
                                  onClick={() => handleOpenEvaluationModal(evaluation)}
                                  sx={{
                                    backgroundColor: 'transparent',
                                    color: isFinalized ? '#ccc' : '#2196f3',
                                    border: `1px solid ${isFinalized ? '#e0e0e0' : '#e3f2fd'}`,
                                    width: '32px',
                                    height: '32px',
                                    cursor: isFinalized ? 'not-allowed' : 'pointer',
                                    opacity: isFinalized ? 0.5 : 1,
                                    '&:hover': {
                                      backgroundColor: isFinalized ? 'transparent' : '#e3f2fd',
                                      borderColor: isFinalized ? '#e0e0e0' : '#2196f3',
                                    }
                                  }}
                                >
                                  <Edit sx={{ fontSize: '1rem' }} />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={isFinalized ? "Avaliação finalizada não pode ser excluída" : "Deletar avaliação"} arrow>
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={isFinalized}
                                  onClick={() => handleOpenDeleteEvaluationModal(evaluation)}
                                  sx={{
                                    backgroundColor: 'transparent',
                                    color: isFinalized ? '#ccc' : '#dc3545',
                                    border: `1px solid ${isFinalized ? '#e0e0e0' : '#f8d7da'}`,
                                    width: '32px',
                                    height: '32px',
                                    cursor: isFinalized ? 'not-allowed' : 'pointer',
                                    opacity: isFinalized ? 0.5 : 1,
                                    '&:hover': {
                                      backgroundColor: isFinalized ? 'transparent' : '#f8d7da',
                                      borderColor: isFinalized ? '#e0e0e0' : '#dc3545',
                                    }
                                  }}
                                >
                                  <Delete sx={{ fontSize: '1rem' }} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </div>

                {/* Navegador de páginas */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: '#f8f9fa',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Mostrando 1-1 de <strong>1</strong> avaliação
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Seletor de itens por página */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          Itens por página:
                        </Typography>
                        <FormControl size="small">
                          <Select
                            value={10}
                            sx={{
                              minWidth: 80,
                              height: '40px',
                              fontSize: '1rem',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ced4da',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ced4da',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#03B4C6',
                                boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                              },
                              '& .MuiSelect-select': {
                                padding: '0.375rem 0.5rem',
                                color: '#495057',
                              },
                            }}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Navegação de páginas */}
                      <Pagination
                        count={1}
                        page={1}
                        color="primary"
                        showFirstButton
                        showLastButton
                        size="small"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: '#495057',
                            '&.Mui-selected': {
                              backgroundColor: '#03B4C6',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#029AAB',
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </div>
            )}

            {/* Conteúdo da aba Plano Terapêutico */}
            {activeTab === 'plano-terap' && (
              <div className="tab-content-section">
                {/* Filtros e ações */}
                <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      select
                      size="small"
                      label="Período"
                      value={therapyPeriodFilter}
                      onChange={(e) => handlePeriodChange(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (value === "") return "Todos os períodos";
                          return value as string;
                        }
                      }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    >
                      <MenuItem value="">Todos os períodos</MenuItem>
                      <MenuItem value="Período 01">Período 01</MenuItem>
                      <MenuItem value="Período 02">Período 02</MenuItem>
                    </TextField>
                    <Tooltip title="Relatório de Período" arrow>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const patientData = {
                            name: formData.name,
                            birthDate: formData.birthDate,
                            responsible: formData.responsibleName
                          };
                          const selectedPeriod = therapyPeriods.find(p => p.id === therapyPeriodFilter);
                          const periodData = selectedPeriod || { id: '', startDate: '', endDate: '' };
                          const filteredPlans = therapyPlansList.filter(plan =>
                            therapyPeriodFilter ? plan.period === therapyPeriodFilter : true
                          ).map((plan, index) => {
                            // Mock scores variados entre 3 e 9
                            const mockScores = [5, 7, 4, 8, 6, 9, 3, 7, 8, 6];
                            const scoreLatest = mockScores[index % mockScores.length];
                            const scoreInitial = 4;
                            const scoreAverage = (scoreInitial + scoreLatest) / 2;
                            return {
                              id: plan.id,
                              number: index + 1,
                              title: plan.title,
                              responsibles: plan.responsible,
                              priority: 'Urgente',
                              startDate: plan.startDate,
                              endDate: plan.endDate,
                              scoreInitial: scoreInitial,
                              scoreLatest: scoreLatest,
                              scoreAverage: scoreAverage,
                              status: plan.status,
                              progress: plan.completionPercentage
                            };
                          });
                          const patientDataEncoded = encodeURIComponent(JSON.stringify(patientData));
                          const periodDataEncoded = encodeURIComponent(JSON.stringify(periodData));
                          const plansDataEncoded = encodeURIComponent(JSON.stringify(filteredPlans));
                          window.open(`/?page=period-report-print&patientData=${patientDataEncoded}&periodData=${periodDataEncoded}&plansData=${plansDataEncoded}`, '_blank');
                        }}
                        sx={{
                          color: actionIcons.print.color,
                          border: `1px solid ${actionIcons.print.borderColor}`,
                          borderRadius: '4px',
                          width: '40px',
                          height: '40px',
                          '&:hover': {
                            borderColor: actionIcons.print.hoverBorderColor,
                            backgroundColor: actionIcons.print.hoverBackgroundColor,
                          },
                        }}
                      >
                        <Summarize sx={{ fontSize: '1.25rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Relatório Detalhado" arrow>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const patientData = {
                            name: formData.name,
                            birthDate: formData.birthDate,
                            responsible: formData.responsibleName
                          };
                          const selectedPeriod = therapyPeriods.find(p => p.id === therapyPeriodFilter);
                          const periodData = selectedPeriod || { id: '', startDate: '', endDate: '' };
                          const filteredPlans = therapyPlansList.filter(plan =>
                            therapyPeriodFilter ? plan.period === therapyPeriodFilter : true
                          ).map((plan, index) => {
                            const mockScores = [5, 7, 4, 8, 6, 9, 3, 7, 8, 6];
                            const scoreLatest = mockScores[index % mockScores.length];
                            const scoreInitial = 4;
                            const scoreAverage = (scoreInitial + scoreLatest) / 2;
                            return {
                              id: plan.id,
                              number: index + 1,
                              title: plan.title,
                              responsibles: plan.responsible,
                              priority: 'Urgente',
                              startDate: plan.startDate,
                              endDate: plan.endDate,
                              progress: plan.completionPercentage,
                              justification: 'Paciente está acima do peso 10 Kg',
                              objective: 'Perder 5 kg em 3 meses',
                              metric: 'Pesar no início e final',
                              observations: 'Paciente hoje com 70 kg',
                              scoreInitial: scoreInitial,
                              scoreLatest: scoreLatest,
                              scoreAverage: scoreAverage
                            };
                          });
                          const patientDataEncoded = encodeURIComponent(JSON.stringify(patientData));
                          const periodDataEncoded = encodeURIComponent(JSON.stringify(periodData));
                          const plansDataEncoded = encodeURIComponent(JSON.stringify(filteredPlans));
                          window.open(`/?page=detailed-period-report-print&patientData=${patientDataEncoded}&periodData=${periodDataEncoded}&plansData=${plansDataEncoded}`, '_blank');
                        }}
                        sx={{
                          color: actionIcons.print.color,
                          border: `1px solid ${actionIcons.print.borderColor}`,
                          borderRadius: '4px',
                          width: '40px',
                          height: '40px',
                          '&:hover': {
                            borderColor: actionIcons.print.hoverBorderColor,
                            backgroundColor: actionIcons.print.hoverBackgroundColor,
                          },
                        }}
                      >
                        <ListAlt sx={{ fontSize: '1.25rem' }} />
                      </IconButton>
                    </Tooltip>
                    <TextField
                      type="date"
                      size="small"
                      label="Data Inicial"
                      value={therapyStartDate}
                      onChange={(e) => setTherapyStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <TextField
                      type="date"
                      size="small"
                      label="Data Final"
                      value={therapyEndDate}
                      onChange={(e) => setTherapyEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <TextField
                      select
                      size="small"
                      label="Responsável"
                      value={therapyResponsibleFilter}
                      onChange={(e) => setTherapyResponsibleFilter(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (value === "") return "Selecione";
                          return value as string;
                        }
                      }}
                      sx={{
                        width: '200px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="dr_silva">Dr. Silva</MenuItem>
                      <MenuItem value="dra_oliveira">Dra. Oliveira</MenuItem>
                      <MenuItem value="dr_santos">Dr. Santos</MenuItem>
                      <MenuItem value="dra_costa">Dra. Costa</MenuItem>
                    </TextField>
                    <TextField
                      select
                      size="small"
                      label="Status"
                      value={therapyStatusFilter}
                      onChange={(e) => setTherapyStatusFilter(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (value === "") return "Selecione";
                          if (value === "finalizado") return "Finalizado";
                          if (value === "pendente") return "Pendente";
                          if (value === "em_andamento") return "Em Andamento";
                          return value as string;
                        }
                      }}
                      sx={{
                        width: '180px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="finalizado">Finalizado</MenuItem>
                      <MenuItem value="pendente">Pendente</MenuItem>
                      <MenuItem value="em_andamento">Em Andamento</MenuItem>
                    </TextField>
                    <Tooltip title="Limpar filtros" arrow>
                      <span>
                        <IconButton
                          onClick={handleClearTherapyFilters}
                          sx={{
                            color: '#6c757d',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            '&:hover': {
                              bgcolor: '#e9ecef',
                            },
                          }}
                        >
                          <FilterAltOff fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Administração de Períodos" arrow>
                      <IconButton
                        onClick={() => setIsTherapyPeriodModalOpen(true)}
                        sx={{
                          borderColor: '#03B4C6',
                          color: '#03B4C6',
                          border: '2px solid #03B4C6',
                          borderRadius: '8px',
                          width: '40px',
                          height: '40px',
                          '&:hover': {
                            borderColor: '#029AAB',
                            backgroundColor: 'rgba(3, 180, 198, 0.08)',
                          },
                        }}
                      >
                        <DateRange />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Novo Plano Terapêutico" arrow>
                      <IconButton
                        onClick={() => {
                          setTherapyPlanModalMode('add');
                          setEditingTherapyPlan(null);
                          setIsTherapyPlanModalOpen(true);
                        }}
                        sx={{
                          borderColor: '#03B4C6',
                          color: '#03B4C6',
                          border: '2px solid #03B4C6',
                          borderRadius: '8px',
                          width: '40px',
                          height: '40px',
                          '&:hover': {
                            borderColor: '#029AAB',
                            backgroundColor: 'rgba(3, 180, 198, 0.08)',
                          },
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Contador de registros */}
                <Box sx={{ mb: 2, px: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    <strong>{filteredTherapyPlans.length}</strong> {filteredTherapyPlans.length === 1 ? 'plano encontrado' : 'planos encontrados'}
                  </Typography>
                </Box>

                {/* Lista de planos terapêuticos */}
                <div className="therapy-plans-list">
                  {filteredTherapyPlans.map((plan) => {
                    const isFinalized = plan.completionPercentage === 100;
                    const statusConfig = plan.status === 'Finalizado'
                      ? { bg: '#d4edda', color: '#155724', border: '#c3e6cb' }
                      : plan.status === 'Em andamento'
                      ? { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' }
                      : { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };

                    return (
                      <Box key={plan.id} sx={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        mb: 2,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <Box sx={{ flex: 1 }}>
                            {/* Primeira linha: Título e Status */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>
                                {plan.title}
                              </Typography>
                              <Box sx={{
                                backgroundColor: statusConfig.bg,
                                color: statusConfig.color,
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                border: `1px solid ${statusConfig.border}`
                              }}>
                                {plan.status}
                              </Box>
                            </Box>

                            {/* Segunda linha: Período */}
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.875rem', mb: 1.5 }}>
                              Período: <strong style={{ color: colors.text }}>
                                {new Date(plan.startDate).toLocaleDateString('pt-BR')} - {new Date(plan.endDate).toLocaleDateString('pt-BR')}
                              </strong>
                            </Typography>

                            {/* Terceira linha: Objetivos */}
                            <Box sx={{ mb: 1.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: colors.text, mb: 0.5 }}>
                                Objetivos:
                              </Typography>
                              <Box component="ul" sx={{
                                margin: 0,
                                paddingLeft: '1.5rem',
                                '& li': {
                                  fontSize: '0.8rem',
                                  color: colors.textSecondary,
                                  lineHeight: 1.6,
                                  marginBottom: '0.25rem'
                                }
                              }}>
                                {plan.objectives.map((objective, index) => (
                                  <li key={index}>{objective}</li>
                                ))}
                              </Box>
                            </Box>

                            {/* Quarta linha: Barra de progresso */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: colors.textSecondary, minWidth: '40px' }}>
                                {plan.completionPercentage}%
                              </Typography>
                              <Box sx={{ width: '120px', position: 'relative' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={plan.completionPercentage}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      backgroundColor: plan.completionPercentage === 100 ? '#4caf50' : '#ffc107',
                                    }
                                  }}
                                />
                              </Box>
                            </Box>

                            {/* Quinta linha: Responsável */}
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: colors.textSecondary }}>
                              Responsável: <strong style={{ color: colors.text }}>
                                {plan.responsible === 'dr_silva' ? 'Dr. Silva' :
                                 plan.responsible === 'dra_oliveira' ? 'Dra. Oliveira' :
                                 plan.responsible === 'dr_santos' ? 'Dr. Santos' :
                                 plan.responsible === 'dra_costa' ? 'Dra. Costa' :
                                 plan.responsible}
                              </strong>
                            </Typography>
                          </Box>

                          {/* Botões de ação à direita */}
                          <Box sx={{ display: 'flex', gap: 1, ml: 2, alignSelf: 'flex-start' }}>
                            <Tooltip title="Imprimir plano" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const patientData = {
                                    name: formData.name,
                                    birthDate: formData.birthDate,
                                    responsible: formData.responsibleName
                                  };
                                  const planDataEncoded = encodeURIComponent(JSON.stringify(plan));
                                  const patientDataEncoded = encodeURIComponent(JSON.stringify(patientData));
                                  window.open(`/?page=therapy-plan-print&planData=${planDataEncoded}&patientData=${patientDataEncoded}`, '_blank');
                                }}
                                sx={{
                                  backgroundColor: 'transparent',
                                  color: actionIcons.print.color,
                                  border: `1px solid ${actionIcons.print.borderColor}`,
                                  width: '32px',
                                  height: '32px',
                                  '&:hover': {
                                    backgroundColor: actionIcons.print.hoverBackgroundColor,
                                    borderColor: actionIcons.print.hoverBorderColor,
                                  }
                                }}
                              >
                                <Print sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Acessar plano" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // TODO: Navegar para página de plano
                                  console.log('Acessar plano:', plan);
                                }}
                                sx={{
                                  backgroundColor: 'transparent',
                                  color: '#03B4C6',
                                  border: '1px solid #e0f7fa',
                                  width: '32px',
                                  height: '32px',
                                  '&:hover': {
                                    backgroundColor: '#e0f7fa',
                                    borderColor: '#03B4C6',
                                  }
                                }}
                              >
                                <OpenInNew sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={isFinalized ? "Plano finalizado não pode ser editado" : "Editar plano"} arrow>
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={isFinalized}
                                  onClick={() => {
                                    setTherapyPlanModalMode('edit');
                                    setEditingTherapyPlan(plan);
                                    setIsTherapyPlanModalOpen(true);
                                  }}
                                  sx={{
                                    backgroundColor: 'transparent',
                                    color: isFinalized ? '#ccc' : '#2196f3',
                                    border: `1px solid ${isFinalized ? '#e0e0e0' : '#e3f2fd'}`,
                                    width: '32px',
                                    height: '32px',
                                    cursor: isFinalized ? 'not-allowed' : 'pointer',
                                    opacity: isFinalized ? 0.5 : 1,
                                    '&:hover': {
                                      backgroundColor: isFinalized ? 'transparent' : '#e3f2fd',
                                      borderColor: isFinalized ? '#e0e0e0' : '#2196f3',
                                    }
                                  }}
                                >
                                  <Edit sx={{ fontSize: '1rem' }} />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={isFinalized ? "Plano finalizado não pode ser excluído" : "Deletar plano"} arrow>
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={isFinalized}
                                  onClick={() => {
                                    setTherapyPlanModalMode('delete');
                                    setEditingTherapyPlan(plan);
                                    setIsTherapyPlanModalOpen(true);
                                  }}
                                  sx={{
                                    backgroundColor: 'transparent',
                                    color: isFinalized ? '#ccc' : '#dc3545',
                                    border: `1px solid ${isFinalized ? '#e0e0e0' : '#f8d7da'}`,
                                    width: '32px',
                                    height: '32px',
                                    cursor: isFinalized ? 'not-allowed' : 'pointer',
                                    opacity: isFinalized ? 0.5 : 1,
                                    '&:hover': {
                                      backgroundColor: isFinalized ? 'transparent' : '#f8d7da',
                                      borderColor: isFinalized ? '#e0e0e0' : '#dc3545',
                                    }
                                  }}
                                >
                                  <Delete sx={{ fontSize: '1rem' }} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </div>

                {/* Navegador de páginas */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: '#f8f9fa',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Mostrando 1-{filteredTherapyPlans.length} de <strong>{filteredTherapyPlans.length}</strong> {filteredTherapyPlans.length === 1 ? 'plano' : 'planos'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Seletor de itens por página */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          Itens por página:
                        </Typography>
                        <FormControl size="small">
                          <Select
                            value={10}
                            sx={{
                              minWidth: 80,
                              height: '40px',
                              fontSize: '1rem',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ced4da',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ced4da',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#03B4C6',
                                boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                              },
                              '& .MuiSelect-select': {
                                padding: '0.375rem 0.5rem',
                                color: '#495057',
                              },
                            }}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Navegação de páginas */}
                      <Pagination
                        count={1}
                        page={1}
                        color="primary"
                        showFirstButton
                        showLastButton
                        size="small"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: '#495057',
                            '&.Mui-selected': {
                              backgroundColor: '#03B4C6',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#029AAB',
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </div>
            )}

            {/* Conteúdo da aba Evoluções */}
            {activeTab === 'evolucoes' && (
              <div className="tab-content-section">
                {/* Filtros e ações */}
                <Box sx={{ display: 'flex', gap: '1rem', mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      type="date"
                      size="small"
                      label="Data Inicial"
                      value={evolutionStartDate}
                      onChange={(e) => setEvolutionStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <TextField
                      type="date"
                      size="small"
                      label="Data Final"
                      value={evolutionEndDate}
                      onChange={(e) => setEvolutionEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '160px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <TextField
                      select
                      size="small"
                      label="Profissional"
                      value={evolutionProfessionalFilter}
                      onChange={(e) => setEvolutionProfessionalFilter(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (value === "") return "Selecione";
                          return value as string;
                        }
                      }}
                      sx={{
                        width: '200px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="dr_silva">Dr. João Silva</MenuItem>
                      <MenuItem value="dra_oliveira">Dra. Maria Oliveira</MenuItem>
                      <MenuItem value="dr_santos">Dr. Pedro Santos</MenuItem>
                      <MenuItem value="dra_costa">Dra. Ana Costa</MenuItem>
                    </TextField>
                    <TextField
                      size="small"
                      label="Palavra-chave"
                      value={evolutionKeywordFilter}
                      onChange={(e) => setEvolutionKeywordFilter(e.target.value)}
                      placeholder="Buscar..."
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: '200px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          height: '40px',
                        },
                      }}
                    />
                    <Tooltip title="Limpar filtros" arrow>
                      <span>
                        <IconButton
                          size="small"
                          onClick={handleClearEvolutionsFilters}
                          disabled={!evolutionStartDate && !evolutionEndDate && !evolutionProfessionalFilter && !evolutionKeywordFilter}
                          sx={{
                            backgroundColor: '#6c757d',
                            color: '#ffffff',
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: '#5a6268',
                            },
                            '&:disabled': {
                              backgroundColor: '#e9ecef',
                              color: '#adb5bd',
                              opacity: 0.6,
                            }
                          }}
                        >
                          <FilterAltOff sx={{ fontSize: '1.25rem' }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={selectedEvolutionsForPrint.length === 0 ? "Selecione pelo menos uma evolução para imprimir" : "Imprimir evoluções selecionadas"} arrow>
                      <span>
                        <IconButton
                          disabled={selectedEvolutionsForPrint.length === 0}
                          onClick={() => {
                            console.log('=== IMPRIMIR EVOLUÇÕES ===');
                            console.log('IDs selecionados:', selectedEvolutionsForPrint);

                            // Filtrar evoluções selecionadas
                            const selectedEvolutions = evolutionsList.filter(ev =>
                              selectedEvolutionsForPrint.includes(ev.id)
                            );

                            console.log('Evoluções filtradas:', selectedEvolutions);
                            console.log('Quantidade de evoluções:', selectedEvolutions.length);

                            // Dados do paciente para impressão
                            const patientDataForPrint = {
                              name: formData.name || 'Paciente',
                              birthDate: formData.birthDate || '',
                              responsible: formData.responsibleName || ''
                            };

                            console.log('Dados do paciente:', patientDataForPrint);

                            // Serializar dados para URL
                            const patientDataParam = encodeURIComponent(JSON.stringify(patientDataForPrint));
                            const evolutionsDataParam = encodeURIComponent(JSON.stringify(selectedEvolutions));

                            console.log('URL gerada:', `?page=evolutions-print&patientData=${patientDataParam}&evolutionsData=${evolutionsDataParam}`);

                            // Navegar para página de impressão
                            window.open(
                              `?page=evolutions-print&patientData=${patientDataParam}&evolutionsData=${evolutionsDataParam}`,
                              '_blank'
                            );
                          }}
                          sx={{
                            color: '#03B4C6',
                            border: `2px solid #03B4C6`,
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            '&:hover': {
                              borderColor: '#029AAB',
                              backgroundColor: 'rgba(3, 180, 198, 0.08)',
                            },
                            '&:disabled': {
                              color: '#e0e0e0',
                              borderColor: '#e0e0e0',
                              cursor: 'not-allowed'
                            }
                          }}
                        >
                          <Print sx={{ fontSize: '1.25rem' }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Nova Evolução" arrow>
                      <IconButton
                        onClick={() => {
                          setEvolutionModalMode('add');
                          setEditingEvolution(null);
                          setIsEvolutionModalOpen(true);
                        }}
                        sx={{
                          borderColor: '#03B4C6',
                          color: '#03B4C6',
                          border: '2px solid #03B4C6',
                          borderRadius: '8px',
                          width: '40px',
                          height: '40px',
                          '&:hover': {
                            borderColor: '#029AAB',
                            backgroundColor: 'rgba(3, 180, 198, 0.08)',
                          },
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Contador de evoluções e seleção */}
                <Box sx={{ mb: 2, px: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    <strong>{filteredEvolutions.length}</strong> {filteredEvolutions.length === 1 ? 'evolução encontrada' : 'evoluções encontradas'}
                    {selectedEvolutionsForPrint.length > 0 && (
                      <span style={{ marginLeft: '8px', color: colors.primary, fontWeight: 600 }}>
                        ({selectedEvolutionsForPrint.length} selecionada{selectedEvolutionsForPrint.length > 1 ? 's' : ''} para impressão)
                      </span>
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Botão para alternar ordem de classificação */}
                    <Tooltip title={evolutionSortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigas primeiro'}>
                      <IconButton
                        onClick={() => setEvolutionSortOrder(evolutionSortOrder === 'desc' ? 'asc' : 'desc')}
                        sx={{
                          padding: '8px',
                          color: colors.primary,
                          '&:hover': {
                            backgroundColor: 'rgba(3, 154, 171, 0.1)'
                          }
                        }}
                      >
                        {evolutionSortOrder === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                      </IconButton>
                    </Tooltip>

                    {/* Switch para expandir todos os textos */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 10
                      }}
                      onClick={() => {
                        console.log('📦 Box clicked, current showAllExpanded:', showAllExpanded);
                        const newValue = !showAllExpanded;
                        setShowAllExpanded(newValue);
                        // Se estiver desativando o switch, resetar todos os estados individuais
                        if (!newValue) {
                          setExpandedEvolutions({});
                        }
                      }}
                    >
                      <Switch
                        checked={showAllExpanded}
                        onChange={(e) => {
                          console.log('🔄 Switch onChange, current:', showAllExpanded, 'new value:', e.target.checked);
                        }}
                        size="small"
                        color="primary"
                        sx={{
                          pointerEvents: 'auto'
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.875rem',
                          color: colors.textSecondary,
                          userSelect: 'none'
                        }}
                      >
                        Expandir leia mais
                      </Typography>
                    </Box>

                    {/* Checkbox selecionar todos */}
                    <Box
                      onClick={() => filteredEvolutions.length > 0 && handleSelectAllEvolutions()}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: filteredEvolutions.length > 0 ? 'pointer' : 'default',
                        minHeight: '42px'
                      }}
                    >
                      <Checkbox
                        checked={isAllEvolutionsSelected}
                        indeterminate={isSomeEvolutionsSelected}
                        onChange={() => {}}
                        onClick={(e) => e.preventDefault()}
                        disabled={filteredEvolutions.length === 0}
                        inputProps={{ 'aria-label': 'Selecionar todas as evoluções' }}
                        sx={{
                          color: colors.primary,
                          '&.Mui-checked': { color: colors.primary },
                          '&.MuiCheckbox-indeterminate': { color: colors.primary },
                          padding: '9px',
                          '& .MuiSvgIcon-root': {
                            fontSize: '1.5rem'
                          },
                          pointerEvents: 'none'
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.875rem',
                          color: colors.textSecondary,
                          userSelect: 'none',
                          ml: -0.5,
                          pointerEvents: 'none'
                        }}
                      >
                        Selecionar todos
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Lista de evoluções */}
                <Box>
                  {filteredEvolutions.map((evolution, index) => (
                    <Box key={evolution.id} sx={{ mb: 3 }}>
                      {/* Card da evolução */}
                      <Box sx={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: selectedEvolutionsForPrint.includes(evolution.id) ? `2px solid ${colors.primary}` : '1px solid #e0e0e0',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          borderColor: '#03B4C6'
                        },
                        '& .MuiButtonBase-root': {
                          pointerEvents: 'auto'
                        }
                      }}>
                        <Box sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          {/* Checkbox de seleção com área clicável maior */}
                          <Box
                            onClick={() => handleToggleEvolutionSelection(evolution.id)}
                            sx={{
                              mr: 2,
                              mt: 0.5,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              minWidth: '42px',
                              minHeight: '42px'
                            }}
                          >
                            <Checkbox
                              checked={selectedEvolutionsForPrint.includes(evolution.id)}
                              onChange={() => {}}
                              onClick={(e) => e.preventDefault()}
                              inputProps={{ 'aria-label': `Selecionar evolução ${evolution.id}` }}
                              sx={{
                                color: colors.primary,
                                '&.Mui-checked': { color: colors.primary },
                                padding: '9px',
                                '& .MuiSvgIcon-root': {
                                  fontSize: '1.5rem'
                                },
                                pointerEvents: 'none'
                              }}
                            />
                          </Box>

                          <Box sx={{ flex: 1 }}>
                            {/* Primeira linha: Data - Título - Profissional */}
                            <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.9rem', color: colors.text }}>
                              <strong style={{ fontSize: '0.95rem' }}>
                                {new Date(evolution.date).toLocaleDateString('pt-BR')} {new Date(evolution.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </strong>
                              {' - '}
                              <span style={{ fontWeight: 600 }}>{evolution.title}</span>
                              {' - '}
                              <strong>{evolution.professional}</strong>
                            </Typography>

                            {/* Segunda linha: Evolução Terapêutica */}
                            <Box sx={{ mb: 1.5 }}>
                              <Typography variant="body2" sx={{ color: colors.text, fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                                Evolução Terapêutica:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: colors.textSecondary,
                                  fontSize: '0.875rem',
                                  lineHeight: 1.6,
                                  ...(isTextExpanded(evolution.id, 'therapeutic') ? {} : {
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  })
                                }}
                              >
                                {evolution.therapeuticEvolution}
                              </Typography>
                              {evolution.therapeuticEvolution && evolution.therapeuticEvolution.length > 80 && !showAllExpanded && (
                                <Typography
                                  variant="body2"
                                  onClick={() => toggleEvolutionText(evolution.id, 'therapeutic')}
                                  sx={{
                                    color: colors.primary,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    mt: 0.5,
                                    fontWeight: 600,
                                    '&:hover': {
                                      textDecoration: 'underline'
                                    }
                                  }}
                                >
                                  {isTextExpanded(evolution.id, 'therapeutic') ? 'Ler menos' : 'Leia mais'}
                                </Typography>
                              )}
                            </Box>

                            {/* Terceira linha: Orientação de Conduta */}
                            <Box sx={{ mb: 1.5 }}>
                              <Typography variant="body2" sx={{ color: colors.text, fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                                Orientação de Conduta:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: colors.textSecondary,
                                  fontSize: '0.875rem',
                                  lineHeight: 1.6,
                                  ...(isTextExpanded(evolution.id, 'conduct') ? {} : {
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  })
                                }}
                              >
                                {evolution.conductGuidance}
                              </Typography>
                              {evolution.conductGuidance && evolution.conductGuidance.length > 80 && !showAllExpanded && (
                                <Typography
                                  variant="body2"
                                  onClick={() => toggleEvolutionText(evolution.id, 'conduct')}
                                  sx={{
                                    color: colors.primary,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    mt: 0.5,
                                    fontWeight: 600,
                                    '&:hover': {
                                      textDecoration: 'underline'
                                    }
                                  }}
                                >
                                  {isTextExpanded(evolution.id, 'conduct') ? 'Ler menos' : 'Leia mais'}
                                </Typography>
                              )}
                            </Box>

                            {/* Quarta linha: Observações */}
                            {evolution.observations && (
                              <Box sx={{ mb: 1.5 }}>
                                <Typography variant="body2" sx={{ color: colors.text, fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                                  Observações:
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: colors.textSecondary,
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                    ...(isTextExpanded(evolution.id, 'observations') ? {} : {
                                      display: '-webkit-box',
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    })
                                  }}
                                >
                                  {evolution.observations}
                                </Typography>
                                {evolution.observations && evolution.observations.length > 80 && !showAllExpanded && (
                                  <Typography
                                    variant="body2"
                                    onClick={() => toggleEvolutionText(evolution.id, 'observations')}
                                    sx={{
                                      color: colors.primary,
                                      fontSize: '0.8rem',
                                      cursor: 'pointer',
                                      mt: 0.5,
                                      fontWeight: 600,
                                      '&:hover': {
                                        textDecoration: 'underline'
                                      }
                                    }}
                                  >
                                    {isTextExpanded(evolution.id, 'observations') ? 'Ler menos' : 'Leia mais'}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>

                          {/* Botões de ação à direita */}
                          <Box sx={{ display: 'flex', gap: 1, ml: 2, alignSelf: 'flex-start' }}>
                            {(() => {
                              // Verificar se o usuário atual é o autor da evolução
                              const isAuthor = user?.alias === evolution.professional;
                              const tooltipMessage = isAuthor ? "Editar evolução" : "Apenas o autor pode editar esta evolução";

                              return (
                                <Tooltip title={tooltipMessage} arrow>
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={!isAuthor}
                                      onClick={() => {
                                        if (isAuthor) {
                                          setEvolutionModalMode('edit');
                                          setEditingEvolution(evolution);
                                          setIsEvolutionModalOpen(true);
                                        }
                                      }}
                                      sx={{
                                        backgroundColor: 'transparent',
                                        color: isAuthor ? '#2196f3' : '#ccc',
                                        border: `1px solid ${isAuthor ? '#e3f2fd' : '#e0e0e0'}`,
                                        width: '32px',
                                        height: '32px',
                                        '&:hover': {
                                          backgroundColor: isAuthor ? '#e3f2fd' : 'transparent',
                                          borderColor: isAuthor ? '#2196f3' : '#e0e0e0',
                                        },
                                        '&:disabled': {
                                          cursor: 'not-allowed',
                                          opacity: 0.5
                                        }
                                      }}
                                    >
                                      <Edit sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              );
                            })()}

                            {(() => {
                              // Verificar se o usuário atual é o autor da evolução
                              const isAuthor = user?.alias === evolution.professional;
                              const tooltipMessage = isAuthor ? "Deletar evolução" : "Apenas o autor pode deletar esta evolução";

                              return (
                                <Tooltip title={tooltipMessage} arrow>
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={!isAuthor}
                                      onClick={() => {
                                        if (isAuthor) {
                                          setEvolutionToDelete(evolution);
                                          setIsDeleteEvolutionModalOpen(true);
                                        }
                                      }}
                                      sx={{
                                        backgroundColor: 'transparent',
                                        color: isAuthor ? '#dc3545' : '#ccc',
                                        border: `1px solid ${isAuthor ? '#f8d7da' : '#e0e0e0'}`,
                                        width: '32px',
                                        height: '32px',
                                        '&:hover': {
                                          backgroundColor: isAuthor ? '#f8d7da' : 'transparent',
                                          borderColor: isAuthor ? '#dc3545' : '#e0e0e0',
                                        },
                                        '&:disabled': {
                                          cursor: 'not-allowed',
                                          opacity: 0.5
                                        }
                                      }}
                                    >
                                      <Delete sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              );
                            })()}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Paginação */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: '#f8f9fa',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Mostrando 1-{filteredEvolutions.length} de <strong>{filteredEvolutions.length}</strong> {filteredEvolutions.length === 1 ? 'evolução' : 'evoluções'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Seletor de itens por página */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          Itens por página:
                        </Typography>
                        <FormControl size="small">
                          <Select
                            value={10}
                            sx={{
                              minWidth: 80,
                              height: '40px',
                              fontSize: '1rem',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ced4da',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ced4da',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#03B4C6',
                                boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                              },
                              '& .MuiSelect-select': {
                                padding: '0.375rem 0.5rem',
                                color: '#495057',
                              },
                            }}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Navegação de páginas */}
                      <Pagination
                        count={1}
                        page={1}
                        color="primary"
                        showFirstButton
                        showLastButton
                        size="small"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: '#495057',
                            '&.Mui-selected': {
                              backgroundColor: '#03B4C6',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#029AAB',
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
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

      {/* Modal de Inserção/Edição de Anotação */}
      <Dialog
        open={isNoteModalOpen}
        onClose={handleCloseNoteModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1.4rem',
              fontWeight: typography.fontWeight.semibold,
              margin: 0
            }}
          >
            {currentNote ? 'Editar Anotação' : 'Nova Anotação'}
          </Typography>
          <IconButton
            onClick={handleCloseNoteModal}
            sx={{
              color: colors.white,
              padding: '0.25rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Data de criação (somente leitura) */}
            <TextField
              label="Data de Criação"
              value={currentNote ? (currentNote.date.includes('-') ? currentNote.date.split('-').reverse().join('/') : currentNote.date) : new Date().toLocaleDateString('pt-BR')}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{
                width: '200px',
                '& .MuiOutlinedInput-root': {
                  fontSize: '1rem',
                  backgroundColor: '#f8f9fa',
                },
              }}
            />

            {/* Campo de Anotação */}
            <TextField
              fullWidth
              multiline
              rows={3}
              value={noteFormData.content}
              onChange={(e) => setNoteFormData(prev => ({ ...prev, content: e.target.value }))}
              label="Anotação"
              placeholder="Digite aqui o conteúdo da anotação..."
              InputLabelProps={{
                shrink: inputs.multiline.labelShrink,
                sx: {
                  fontSize: inputs.multiline.labelFontSize,
                  color: inputs.multiline.labelColor,
                  backgroundColor: inputs.multiline.labelBackground,
                  padding: inputs.multiline.labelPadding,
                  '&.Mui-focused': {
                    color: colors.primary,
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  position: inputs.multiline.position,
                  opacity: inputs.multiline.opacity,
                  alignItems: inputs.multiline.alignItems,
                  fontSize: inputs.multiline.fontSize,
                  minHeight: inputs.multiline.minHeight,
                  maxHeight: inputs.multiline.maxHeight,
                  overflow: inputs.multiline.overflow,
                  padding: 0,
                  '& fieldset': {
                    borderColor: inputs.multiline.borderColor,
                  },
                  '&:hover fieldset': {
                    borderColor: inputs.multiline.borderColor,
                  },
                  '& textarea': {
                    wordWrap: inputs.multiline.wordWrap,
                    whiteSpace: inputs.multiline.whiteSpace,
                    padding: inputs.multiline.inputPadding,
                    height: inputs.multiline.textareaHeight,
                    maxHeight: inputs.multiline.textareaMaxHeight,
                    overflow: `${inputs.multiline.textareaOverflow} !important`,
                    boxSizing: inputs.multiline.textareaBoxSizing,
                    '&::-webkit-scrollbar': {
                      width: inputs.multiline.scrollbarWidth,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: inputs.multiline.scrollbarTrackColor,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: inputs.multiline.scrollbarThumbColor,
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: inputs.multiline.scrollbarThumbHoverColor,
                      },
                    },
                  },
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={noteFormData.important}
                  onChange={(e) => setNoteFormData(prev => ({ ...prev, important: e.target.checked }))}
                  sx={{
                    color: colors.primary,
                    '&.Mui-checked': {
                      color: colors.primary,
                    },
                  }}
                />
              }
              label="Marcar como importante"
              sx={{
                margin: 0,
                marginLeft: '-9px',
                whiteSpace: 'nowrap',
                '& .MuiTypography-root': {
                  fontSize: '0.875rem',
                  color: colors.textSecondary
                }
              }}
            />

            <Box sx={{ p: 1.5, backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#856404', lineHeight: 1.6 }}>
                <strong>Lembre-se:</strong> Esta área é destinada apenas para anotações gerais. Para registros de evolução clínica, utilize a aba "Evoluções".
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{
          padding: '1.5rem 2rem',
          borderTop: `1px solid ${colors.backgroundAlt}`,
          backgroundColor: colors.background,
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <Button
            onClick={handleCloseNoteModal}
            variant="outlined"
            sx={{
              padding: '0.75rem 1.5rem',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              backgroundColor: colors.white,
              color: colors.textSecondary,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: colors.background,
                borderColor: '#adb5bd',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveNote}
            variant="contained"
            disabled={!noteFormData.content.trim()}
            sx={{
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#029AAB',
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                backgroundColor: '#e9ecef',
                color: '#6c757d',
              }
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={isDeleteNoteModalOpen}
        onClose={handleCloseDeleteNoteModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1.4rem',
              fontWeight: typography.fontWeight.semibold,
              margin: 0
            }}
          >
            Confirmar Exclusão
          </Typography>
          <IconButton
            onClick={handleCloseDeleteNoteModal}
            sx={{
              color: colors.white,
              padding: '0.25rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
          <Typography variant="body1" sx={{ marginBottom: '1rem', color: colors.textPrimary }}>
            Tem certeza que deseja excluir esta anotação?
          </Typography>
          {currentNote && (
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px', mb: 2 }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: colors.textSecondary, mb: 0.5 }}>
                <strong>Data:</strong> {currentNote.date}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                <strong>Conteúdo:</strong> {currentNote.content}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#fff3cd',
              color: '#856404',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
            }}
          >
            <Warning fontSize="small" />
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              Esta ação não poderá ser desfeita.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{
          padding: '1.5rem 2rem',
          borderTop: `1px solid ${colors.backgroundAlt}`,
          backgroundColor: colors.background,
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <Button
            onClick={handleCloseDeleteNoteModal}
            variant="outlined"
            sx={{
              padding: '0.75rem 1.5rem',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              backgroundColor: colors.white,
              color: colors.textSecondary,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: colors.background,
                borderColor: '#adb5bd',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteNote}
            variant="contained"
            sx={{
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              backgroundColor: colors.error,
              color: colors.white,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#c82333',
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              }
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Agendamento */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={handleCloseAppointmentModal}
        onSave={handleSaveAppointment}
        mode={appointmentModalMode}
        initialData={appointmentModalData}
        title={appointmentModalMode === 'create' ? 'Agendamento' : 'Editar Agendamento'}
        patientsList={patientsList}
        disablePatientField={true}
      />

      {/* Modal de Períodos de Plano Terapêutico */}
      <TherapyPeriodModal
        isOpen={isTherapyPeriodModalOpen}
        onClose={() => setIsTherapyPeriodModalOpen(false)}
        onSave={(periods) => {
          // TODO: Implementar salvamento de períodos
          console.log('Períodos salvos:', periods);
          setIsTherapyPeriodModalOpen(false);
        }}
      />

      {/* Modal de Plano Terapêutico */}
      <TherapyPlanModal
        isOpen={isTherapyPlanModalOpen}
        onClose={() => {
          setIsTherapyPlanModalOpen(false);
          setEditingTherapyPlan(null);
        }}
        onSave={(planData) => {
          // TODO: Implementar salvamento/edição/exclusão de plano
          console.log('Plano salvo:', planData);
          setIsTherapyPlanModalOpen(false);
          setEditingTherapyPlan(null);
        }}
        editData={editingTherapyPlan}
        mode={therapyPlanModalMode}
      />

      {/* Modal de Inserção/Edição de Diagnóstico */}
      <Dialog
        open={isDiagnosisModalOpen}
        onClose={handleCloseDiagnosisModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1.4rem',
              fontWeight: typography.fontWeight.semibold,
              margin: 0
            }}
          >
            {currentDiagnosis ? 'Editar Diagnóstico' : 'Novo Diagnóstico'}
          </Typography>
          <IconButton
            onClick={handleCloseDiagnosisModal}
            sx={{
              color: colors.white,
              padding: '0.25rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Campo de busca de CID com Autocomplete */}
            <Autocomplete
              freeSolo
              options={filteredCidList}
              getOptionLabel={(option) => typeof option === 'string' ? option : `${option.code} - ${option.description}`}
              value={cidSearchText}
              onChange={(_, newValue) => {
                if (typeof newValue === 'object' && newValue) {
                  setCidSearchText(`${newValue.code} - ${newValue.description}`);
                  setDiagnosisFormData(prev => ({ ...prev, cid: newValue.code }));
                } else {
                  setCidSearchText(newValue || '');
                }
              }}
              onInputChange={(_, newInputValue) => {
                setCidSearchText(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="CID"
                  placeholder="Digite pelo menos 3 letras para buscar..."
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: inputs.default.labelFontSize,
                      color: inputs.default.labelColor,
                      backgroundColor: inputs.default.labelBackground,
                      padding: inputs.default.labelPadding,
                      '&.Mui-focused': {
                        color: colors.primary,
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      minHeight: '56px',
                      '& fieldset': {
                        borderColor: inputs.default.borderColor,
                      },
                      '&:hover fieldset': {
                        borderColor: inputs.default.borderColor,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary,
                        boxShadow: `0 0 0 3px ${colors.primary}20`,
                      },
                    },
                  }}
                />
              )}
            />

            {/* Campo de Observações */}
            <TextField
              fullWidth
              multiline
              rows={4}
              value={diagnosisFormData.observations}
              onChange={(e) => setDiagnosisFormData(prev => ({ ...prev, observations: e.target.value }))}
              label="Observações"
              placeholder="Digite aqui observações sobre o diagnóstico..."
              InputLabelProps={{
                shrink: inputs.multiline.labelShrink,
                sx: {
                  fontSize: inputs.multiline.labelFontSize,
                  color: inputs.multiline.labelColor,
                  backgroundColor: inputs.multiline.labelBackground,
                  padding: inputs.multiline.labelPadding,
                  '&.Mui-focused': {
                    color: colors.primary,
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  position: inputs.multiline.position,
                  opacity: inputs.multiline.opacity,
                  alignItems: inputs.multiline.alignItems,
                  fontSize: inputs.multiline.fontSize,
                  minHeight: inputs.multiline.minHeight,
                  maxHeight: inputs.multiline.maxHeight,
                  overflow: inputs.multiline.overflow,
                  padding: 0,
                  '& fieldset': {
                    borderColor: inputs.multiline.borderColor,
                  },
                  '&:hover fieldset': {
                    borderColor: inputs.multiline.borderColor,
                  },
                  '& textarea': {
                    wordWrap: inputs.multiline.wordWrap,
                    whiteSpace: inputs.multiline.whiteSpace,
                    padding: inputs.multiline.inputPadding,
                    height: inputs.multiline.textareaHeight,
                    maxHeight: inputs.multiline.textareaMaxHeight,
                    overflow: `${inputs.multiline.textareaOverflow} !important`,
                    boxSizing: inputs.multiline.textareaBoxSizing,
                    '&::-webkit-scrollbar': {
                      width: inputs.multiline.scrollbarWidth,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: inputs.multiline.scrollbarTrackColor,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: inputs.multiline.scrollbarThumbColor,
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: inputs.multiline.scrollbarThumbHoverColor,
                      },
                    },
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '1.5rem', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCloseDiagnosisModal}
            variant="outlined"
            sx={{
              borderColor: colors.textSecondary,
              color: colors.textSecondary,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                borderColor: colors.text,
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                boxShadow: 'none',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveDiagnosis}
            variant="contained"
            disabled={!diagnosisFormData.cid}
            sx={{
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#029AAB',
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e',
              }
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Exclusão de Diagnóstico */}
      <Dialog
        open={isDeleteDiagnosisModalOpen}
        onClose={handleCloseDeleteDiagnosisModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.error,
            color: colors.white,
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1.4rem',
              fontWeight: typography.fontWeight.semibold,
              margin: 0
            }}
          >
            Confirmar Exclusão
          </Typography>
          <IconButton
            onClick={handleCloseDeleteDiagnosisModal}
            sx={{
              color: colors.white,
              padding: '0.25rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '2rem !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: colors.text, lineHeight: 1.6 }}>
              Tem certeza que deseja excluir o diagnóstico <strong>{currentDiagnosis?.cid} - {currentDiagnosis?.name}</strong>?
            </Typography>
            <Box sx={{ p: 1.5, backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#856404', lineHeight: 1.6 }}>
                <strong>Atenção:</strong> Esta ação não poderá ser desfeita.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '1.5rem', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCloseDeleteDiagnosisModal}
            variant="outlined"
            sx={{
              borderColor: colors.textSecondary,
              color: colors.textSecondary,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                borderColor: colors.text,
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                boxShadow: 'none',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteDiagnosis}
            variant="contained"
            sx={{
              backgroundColor: colors.error,
              color: colors.white,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#c82333',
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              }
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Inserção/Edição de Avaliação */}
      <Dialog
        open={isEvaluationModalOpen}
        onClose={handleCloseEvaluationModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1.4rem',
              fontWeight: typography.fontWeight.semibold,
              margin: 0
            }}
          >
            {currentEvaluation ? 'Editar Avaliação' : 'Nova Avaliação'}
          </Typography>
          <IconButton
            onClick={handleCloseEvaluationModal}
            sx={{
              color: colors.white,
              padding: '0.25rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Formulário */}
            <Autocomplete
              options={formList}
              value={evaluationFormData.form}
              onChange={(event, newValue) => {
                setEvaluationFormData(prev => ({ ...prev, form: newValue || '' }));
              }}
              disabled={!!currentEvaluation}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Formulário"
                  required
                  placeholder="Selecione um formulário"
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: inputs.default.labelFontSize,
                      color: inputs.default.labelColor,
                      backgroundColor: inputs.default.labelBackground,
                      padding: inputs.default.labelPadding,
                      '&.Mui-focused': {
                        color: inputs.default.focus.labelColor,
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      backgroundColor: currentEvaluation ? '#f5f5f5' : '#fff',
                      '& fieldset': {
                        borderColor: inputs.default.borderColor,
                      },
                      '&:hover fieldset': {
                        borderColor: inputs.default.hover.borderColor,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: inputs.default.focus.borderColor,
                        boxShadow: inputs.default.focus.boxShadow,
                      },
                    },
                  }}
                />
              )}
            />

            {/* Observações */}
            <TextField
              label="Observações"
              value={evaluationFormData.observations}
              onChange={(e) => setEvaluationFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Digite observações sobre a avaliação"
              multiline
              rows={4}
              InputLabelProps={{
                shrink: inputs.multiline.labelShrink,
                sx: {
                  fontSize: inputs.multiline.labelFontSize,
                  color: inputs.multiline.labelColor,
                  backgroundColor: inputs.multiline.labelBackground,
                  padding: inputs.multiline.labelPadding,
                  '&.Mui-focused': {
                    color: colors.primary,
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  position: inputs.multiline.position,
                  opacity: inputs.multiline.opacity,
                  alignItems: inputs.multiline.alignItems,
                  fontSize: inputs.multiline.fontSize,
                  minHeight: inputs.multiline.minHeight,
                  maxHeight: inputs.multiline.maxHeight,
                  overflow: inputs.multiline.overflow,
                  padding: 0,
                  '& fieldset': {
                    borderColor: inputs.multiline.borderColor,
                  },
                  '&:hover fieldset': {
                    borderColor: inputs.multiline.borderColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                  },
                  '& textarea': {
                    wordWrap: inputs.multiline.wordWrap,
                    whiteSpace: inputs.multiline.whiteSpace,
                    padding: inputs.multiline.inputPadding,
                    height: inputs.multiline.textareaHeight,
                    maxHeight: inputs.multiline.textareaMaxHeight,
                    overflow: `${inputs.multiline.textareaOverflow} !important`,
                    boxSizing: inputs.multiline.textareaBoxSizing,
                    '&::-webkit-scrollbar': {
                      width: inputs.multiline.scrollbarWidth,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: inputs.multiline.scrollbarTrackColor,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: inputs.multiline.scrollbarThumbColor,
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: inputs.multiline.scrollbarThumbHoverColor,
                      },
                    },
                  },
                },
              }}
            />

            {/* Prazo para preenchimento */}
            <TextField
              type="date"
              label="Prazo para Preenchimento"
              required
              value={evaluationFormData.deadline}
              onChange={(e) => setEvaluationFormData(prev => ({ ...prev, deadline: e.target.value }))}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: inputs.default.labelFontSize,
                  color: inputs.default.labelColor,
                  backgroundColor: inputs.default.labelBackground,
                  padding: inputs.default.labelPadding,
                  '&.Mui-focused': {
                    color: inputs.default.focus.labelColor,
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: inputs.default.height,
                  fontSize: inputs.default.fontSize,
                  '& fieldset': {
                    borderColor: inputs.default.borderColor,
                  },
                  '&:hover fieldset': {
                    borderColor: inputs.default.hover.borderColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: inputs.default.focus.borderColor,
                    boxShadow: inputs.default.focus.boxShadow,
                  },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: '1.5rem 2rem',
            borderTop: `1px solid ${colors.backgroundAlt}`,
            backgroundColor: colors.background,
            gap: '1rem',
          }}
        >
          <Button
            onClick={handleCloseEvaluationModal}
            variant="outlined"
            sx={{
              padding: '0.75rem 1.5rem',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              backgroundColor: colors.white,
              color: colors.textSecondary,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: colors.background,
                borderColor: '#adb5bd',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEvaluation}
            variant="contained"
            sx={{
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#029AAB',
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              }
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Evolução (Add/Edit/Delete) */}
      <EvolutionModal
        isOpen={isEvolutionModalOpen}
        onClose={handleCloseEvolutionModal}
        onSave={evolutionModalMode === 'edit' ? handleUpdateEvolution : handleSaveEvolution}
        editData={editingEvolution}
        mode={evolutionModalMode}
      />

      {/* Modal de Exclusão de Evolução */}
      <ConfirmModal
        isOpen={isDeleteEvolutionModalOpen}
        title="Excluir Evolução"
        message="Tem certeza que deseja excluir esta evolução?"
        warningMessage="Esta ação não poderá ser desfeita."
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmDeleteEvolution}
        onCancel={handleCloseDeleteEvolutionModal}
        type="danger"
      />

      {/* Modal de Exclusão de Avaliação */}
      <Dialog
        open={isDeleteEvaluationModalOpen}
        onClose={handleCloseDeleteEvaluationModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.error,
            color: colors.white,
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1.4rem',
              fontWeight: typography.fontWeight.semibold,
              margin: 0
            }}
          >
            Confirmar Exclusão
          </Typography>
          <IconButton
            onClick={handleCloseDeleteEvaluationModal}
            sx={{
              color: colors.white,
              padding: '0.25rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '2rem !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: colors.text, lineHeight: 1.6 }}>
              Tem certeza que deseja excluir a avaliação <strong>{currentEvaluation?.form}</strong>?
            </Typography>
            <Box sx={{ p: 1.5, backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#856404', lineHeight: 1.6 }}>
                <strong>Atenção:</strong> Esta ação não poderá ser desfeita.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '1.5rem', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCloseDeleteEvaluationModal}
            variant="outlined"
            sx={{
              borderColor: colors.textSecondary,
              color: colors.textSecondary,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                borderColor: colors.text,
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                boxShadow: 'none',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteEvaluation}
            variant="contained"
            sx={{
              backgroundColor: colors.error,
              color: colors.white,
              fontSize: '1rem',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#c82333',
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              }
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PatientRegister;