import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Chip,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import AppointmentModal, { AppointmentData } from "../components/modals/AppointmentModal";
import { useNavigation } from "../contexts/RouterContext";
import { CalendarToday, Delete, FilterAltOff, EventNote, PersonAdd, List, Folder } from '@mui/icons-material';
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
}

interface ScheduleEvent {
  date: string;
  time: string;
  duration: number;
  patient: string;
  service: string;
  doctor: string;
  status: string;
}

interface LayoutEvent extends ScheduleEvent {
  width: string;
  left: string;
  zIndex: number;
  top: string;
  height: string;
}

const ProfessionalSchedule: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToPatientRegister, goToPatients } = useNavigation();

  const professionalsList = [
    'Dr. João Silva - Cardiologista',
    'Dra. Maria Santos - Pediatra',
    'Dr. Pedro Oliveira - Ortopedista',
    'Dra. Ana Costa - Dermatologista',
    'Dr. Carlos Ferreira - Neurologista',
    'Dra. Lucia Rodrigues - Ginecologista',
    'Dr. Rafael Almeida - Clínico Geral',
    'Dra. Fernanda Lima - Psiquiatra',
    'Dr. Roberto Souza - Oftalmologista',
    'Dra. Patricia Mendes - Endocrinologista',
    'Dr. André Castro - Urologista',
    'Dra. Beatriz Rocha - Reumatologista'
  ];

  // Valores iniciais dos filtros
  const getInitialFilters = () => ({
    team: '',
    startDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
    professionals: professionalsList,
    patients: []
  });

  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(professionalsList);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [hasFilterChanges, setHasFilterChanges] = useState(false);

  // Estados do calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('week');

  // Estados do modal de eventos
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<ScheduleEvent[]>([]);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);

  // Estado do evento selecionado para edição
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  // Estados do modal unificado de agendamento
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentModalMode, setAppointmentModalMode] = useState<'create' | 'edit'>('create');
  const [appointmentModalData, setAppointmentModalData] = useState<Partial<AppointmentData>>({});

  // Estados do modal de agenda do paciente
  const [isPatientScheduleModalOpen, setIsPatientScheduleModalOpen] = useState(false);
  const [patientScheduleEvents, setPatientScheduleEvents] = useState<ScheduleEvent[]>([]);


  // Estados dos filtros da agenda
  const [filters, setFilters] = useState(getInitialFilters());

  // Função para gerar eventos mockados até o final de 2025
  const generateMockEvents = (): ScheduleEvent[] => {
    const events: ScheduleEvent[] = [];
    const services = ['Avaliação', 'Retorno', 'Consulta', 'Terapia', 'Exame'];
    const statuses = ['confirmed', 'pending', 'attended', 'cancelled', 'no_show'];
    const patients = [
      'Maria Alice', 'João Santos', 'Ana Costa', 'Sofia Martins', 'Carlos Eduardo',
      'Pedro Oliveira', 'Amanda Silva', 'Roberto Mendes', 'Carla Mendes', 'Bruno Costa',
      'Lucas Almeida', 'Patricia Santos', 'Eduardo Lima', 'Fernanda Rocha', 'Isabel Santos',
      'Fernanda Lima', 'Carlos Alberto', 'João Silva', 'Rafael Costa', 'Ana Paula',
      'Carlos Henrique', 'Maria Santos', 'Beatriz Rocha', 'Diego Martins', 'Camila Souza',
      'Ricardo Lima', 'Juliana Costa', 'Paulo Henrique', 'Larissa Silva', 'André Oliveira',
      'Priscila Mendes', 'Gabriel Nunes', 'Tatiana Ferreira', 'Felipe Santos', 'Vanessa Lima',
      'Marina Silva', 'Roberto Silva', 'Cristiana Rocha', 'Eduardo Mendes', 'Marcos Santos',
      'Marilia Costa', 'Mariana Ferreira', 'Marcela Rodrigues'
    ];
    const durations = [30, 45, 60, 90];
    const hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                   '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

    // Gerar eventos de outubro até dezembro de 2025
    const startDate = new Date(2025, 9, 1); // Outubro (mês 9)
    const endDate = new Date(2025, 11, 31); // Dezembro (mês 11)

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getDay();

      // Gerar de 3 a 8 eventos por dia útil (segunda a sexta)
      // Fim de semana: 1 a 3 eventos
      const eventsPerDay = dayOfWeek === 0 || dayOfWeek === 6
        ? Math.floor(Math.random() * 3) + 1
        : Math.floor(Math.random() * 6) + 3;

      for (let i = 0; i < eventsPerDay; i++) {
        events.push({
          date: dateStr,
          time: hours[Math.floor(Math.random() * hours.length)],
          duration: durations[Math.floor(Math.random() * durations.length)],
          patient: patients[Math.floor(Math.random() * patients.length)],
          service: services[Math.floor(Math.random() * services.length)],
          doctor: professionalsList[Math.floor(Math.random() * professionalsList.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)]
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events;
  };

  // Dados de eventos de exemplo para setembro de 2025 (com duração)
  const septemberEvents = [
    { date: '2025-09-15', time: '09:00', duration: 60, patient: 'Maria Alice', service: 'Avaliação', doctor: 'Dra. Ana Costa', status: 'confirmed' },
    { date: '2025-09-15', time: '10:30', duration: 45, patient: 'João Santos', service: 'Retorno', doctor: 'Dr. Carlos Ferreira', status: 'pending' },
    { date: '2025-09-15', time: '14:00', duration: 30, patient: 'Ana Costa', service: 'Consulta', doctor: 'Dra. Maria Santos', status: 'cancelled' },
    { date: '2025-09-15', time: '15:30', duration: 90, patient: 'Sofia Martins', service: 'Terapia', doctor: 'Dr. Roberto Souza', status: 'confirmed' },
    { date: '2025-09-15', time: '16:45', duration: 30, patient: 'Carlos Eduardo', service: 'Exame', doctor: 'Dra. Lucia Rodrigues', status: 'attended' },

    // Agendamentos concorrentes - mesmo dia e horário para demonstrar conflitos
    { date: '2025-09-16', time: '08:30', duration: 60, patient: 'Pedro Oliveira', service: 'Exame', doctor: 'Dr. João Silva', status: 'attended' },
    { date: '2025-09-16', time: '08:30', duration: 45, patient: 'Amanda Silva', service: 'Consulta', doctor: 'Dra. Ana Costa', status: 'confirmed' },
    { date: '2025-09-16', time: '08:45', duration: 60, patient: 'Roberto Mendes', service: 'Terapia', doctor: 'Dr. Carlos Ferreira', status: 'pending' },

    { date: '2025-09-16', time: '11:00', duration: 90, patient: 'Carla Mendes', service: 'Terapia', doctor: 'Dra. Ana Costa', status: 'no_show' },
    { date: '2025-09-16', time: '11:15', duration: 60, patient: 'Bruno Costa', service: 'Avaliação', doctor: 'Dr. Rafael Almeida', status: 'confirmed' },

    { date: '2025-09-16', time: '15:30', duration: 45, patient: 'Lucas Almeida', service: 'Avaliação', doctor: 'Dr. Rafael Almeida', status: 'confirmed' },
    { date: '2025-09-16', time: '15:30', duration: 30, patient: 'Patricia Santos', service: 'Retorno', doctor: 'Dra. Maria Santos', status: 'attended' },
    { date: '2025-09-16', time: '15:45', duration: 30, patient: 'Eduardo Lima', service: 'Consulta', doctor: 'Dr. André Castro', status: 'cancelled' },
    { date: '2025-09-16', time: '16:00', duration: 60, patient: 'Fernanda Rocha', service: 'Terapia', doctor: 'Dra. Lucia Rodrigues', status: 'pending' },

    { date: '2025-09-16', time: '17:00', duration: 45, patient: 'Isabel Santos', service: 'Consulta', doctor: 'Dra. Patricia Mendes', status: 'pending' },

    { date: '2025-09-17', time: '09:15', duration: 45, patient: 'Fernanda Lima', service: 'Consulta', doctor: 'Dra. Patricia Mendes', status: 'pending' },
    { date: '2025-09-17', time: '09:15', duration: 30, patient: 'Carlos Alberto', service: 'Exame', doctor: 'Dr. Roberto Souza', status: 'confirmed' },

    { date: '2025-09-17', time: '10:30', duration: 60, patient: 'João Silva', service: 'Avaliação', doctor: 'Dr. Carlos Ferreira', status: 'confirmed' },
    { date: '2025-09-17', time: '13:45', duration: 30, patient: 'Rafael Costa', service: 'Retorno', doctor: 'Dr. André Castro', status: 'attended' },
    { date: '2025-09-17', time: '14:30', duration: 45, patient: 'Ana Paula', service: 'Terapia', doctor: 'Dra. Lucia Rodrigues', status: 'confirmed' },
    { date: '2025-09-17', time: '16:15', duration: 60, patient: 'Carlos Henrique', service: 'Consulta', doctor: 'Dr. João Silva', status: 'pending' },

    // Quarta-feira 18/09
    { date: '2025-09-18', time: '08:00', duration: 45, patient: 'Maria Santos', service: 'Retorno', doctor: 'Dra. Ana Costa', status: 'confirmed' },
    { date: '2025-09-18', time: '10:00', duration: 90, patient: 'Beatriz Rocha', service: 'Terapia', doctor: 'Dra. Lucia Rodrigues', status: 'cancelled' },
    { date: '2025-09-18', time: '11:30', duration: 30, patient: 'Diego Martins', service: 'Exame', doctor: 'Dr. Rafael Almeida', status: 'attended' },
    { date: '2025-09-18', time: '14:00', duration: 60, patient: 'Camila Souza', service: 'Avaliação', doctor: 'Dr. André Castro', status: 'confirmed' },
    { date: '2025-09-18', time: '15:30', duration: 45, patient: 'Ricardo Lima', service: 'Consulta', doctor: 'Dra. Maria Santos', status: 'pending' },

    // Quinta-feira 19/09
    { date: '2025-09-19', time: '09:00', duration: 60, patient: 'Juliana Costa', service: 'Terapia', doctor: 'Dra. Patricia Mendes', status: 'confirmed' },
    { date: '2025-09-19', time: '10:30', duration: 30, patient: 'Paulo Henrique', service: 'Retorno', doctor: 'Dr. Carlos Ferreira', status: 'attended' },
    { date: '2025-09-19', time: '13:00', duration: 45, patient: 'Larissa Silva', service: 'Consulta', doctor: 'Dra. Ana Costa', status: 'confirmed' },
    { date: '2025-09-19', time: '14:30', duration: 90, patient: 'André Oliveira', service: 'Avaliação', doctor: 'Dr. Roberto Souza', status: 'pending' },
    { date: '2025-09-19', time: '16:45', duration: 30, patient: 'Priscila Mendes', service: 'Exame', doctor: 'Dra. Lucia Rodrigues', status: 'confirmed' },

    // Sexta-feira 20/09 (hoje)
    { date: '2025-09-20', time: '08:00', duration: 60, patient: 'Gabriel Nunes', service: 'Avaliação', doctor: 'Dr. Roberto Souza', status: 'confirmed' },
    { date: '2025-09-20', time: '09:30', duration: 45, patient: 'Tatiana Ferreira', service: 'Consulta', doctor: 'Dra. Maria Santos', status: 'confirmed' },
    { date: '2025-09-20', time: '11:00', duration: 30, patient: 'Felipe Santos', service: 'Retorno', doctor: 'Dr. João Silva', status: 'pending' },
    { date: '2025-09-20', time: '14:15', duration: 60, patient: 'Vanessa Lima', service: 'Terapia', doctor: 'Dra. Patricia Mendes', status: 'confirmed' },
    { date: '2025-09-20', time: '16:00', duration: 45, patient: 'Marina Silva', service: 'Consulta', doctor: 'Dra. Beatriz Rocha', status: 'no_show' },
    { date: '2025-09-20', time: '22:00', duration: 60, patient: 'Carlos Noturno', service: 'Emergência', doctor: 'Dr. Roberto Souza', status: 'confirmed' },

    // Sábado 21/09
    { date: '2025-09-21', time: '08:30', duration: 45, patient: 'Roberto Silva', service: 'Exame', doctor: 'Dr. André Castro', status: 'confirmed' },
    { date: '2025-09-21', time: '10:15', duration: 60, patient: 'Cristiana Rocha', service: 'Avaliação', doctor: 'Dra. Ana Costa', status: 'pending' },
    { date: '2025-09-21', time: '14:00', duration: 30, patient: 'Eduardo Mendes', service: 'Retorno', doctor: 'Dr. Carlos Ferreira', status: 'confirmed' },
    { date: '2025-09-22', time: '09:30', duration: 30, patient: 'Marcos Santos', service: 'Exame', doctor: 'Dr. Pedro Oliveira', status: 'attended' },
    { date: '2025-09-23', time: '14:15', duration: 45, patient: 'Marilia Costa', service: 'Consulta', doctor: 'Dra. Ana Costa', status: 'confirmed' },
    { date: '2025-09-24', time: '11:45', duration: 60, patient: 'Mariana Ferreira', service: 'Avaliação', doctor: 'Dr. Carlos Ferreira', status: 'pending' },
    { date: '2025-09-25', time: '16:30', duration: 45, patient: 'Marcela Rodrigues', service: 'Retorno', doctor: 'Dra. Patricia Mendes', status: 'attended' }
  ];

  // Combinar todos os eventos (setembro + gerados)
  const allMockEvents = [...septemberEvents, ...generateMockEvents()];

  // Estados de controle
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<ScheduleEvent[]>(allMockEvents);

  const patientsList = [
    'Maria Silva Santos - CPF: 123.456.789-00 - Resp: João Santos',
    'Marilia Costa Oliveira - CPF: 987.654.321-00 - Resp: Ana Costa',
    'Mariana Beatriz Ferreira - CPF: 456.789.123-00 - Resp: Carlos Ferreira',
    'Marcela Paulo Rodrigues - CPF: 789.123.456-00 - Resp: Maria Rodrigues',
    'Marina Mendes Silva - CPF: 321.654.987-00 - Resp: Roberto Silva',
    'Marcos Santos Almeida - CPF: 654.321.789-00 - Resp: Patricia Almeida',
    'Marcia Lima Souza - CPF: 147.258.369-00 - Resp: André Souza',
    'Marcel Costa Pereira - CPF: 963.852.741-00 - Resp: Lucia Pereira',
    'Marta Rocha Martins - CPF: 852.741.963-00 - Resp: Diego Martins',
    'Mario Alves Nunes - CPF: 741.852.963-00 - Resp: Camila Nunes'
  ];

  useEffect(() => {
    document.title = "Clinic4Us - Agenda Profissional";

    // Verificar se há sessão ativa
    const sessionData = localStorage.getItem('clinic4us-user-session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setUserSession(session);
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        // Redirecionar para login se sessão inválida
        window.location.href = window.location.origin + '/?page=login&clinic=ninho';
      }
    } else {
      // Redirecionar para login se não há sessão
      window.location.href = window.location.origin + '/?page=login&clinic=ninho';
    }
  }, []);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPatientDropdownOpen) {
        setIsPatientDropdownOpen(false);
      }
    };

    if (isPatientDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isPatientDropdownOpen]);

  // Verificar se há mudanças nos filtros
  useEffect(() => {
    const initialFilters = getInitialFilters();

    const hasChanges =
      filters.team !== initialFilters.team ||
      filters.startDate !== initialFilters.startDate ||
      filters.endDate !== initialFilters.endDate ||
      selectedProfessionals.length !== initialFilters.professionals.length ||
      selectedProfessionals.some(p => !initialFilters.professionals.includes(p)) ||
      selectedPatients.length !== initialFilters.patients.length ||
      patientSearchTerm !== '';

    setHasFilterChanges(hasChanges);
  }, [filters, selectedProfessionals, selectedPatients, patientSearchTerm]);

  const handleRevalidateLogin = () => {
    // Limpar sessão
    localStorage.removeItem('clinic4us-user-session');
    localStorage.removeItem('clinic4us-remember-me');

    alert("Sessão encerrada. Redirecionando para login..");
    window.location.href = window.location.origin + '/?page=login&clinic=ninho';
  };

  const handleNotificationClick = () => {
    alert("Sistema de notificações - 27 notificações pendentes");
  };

  const handleUserClick = () => {
    alert("Menu do usuário:\n- Perfil\n- Configurações\n- Trocar senha\n- Logout");
  };

  const handleLogoClick = () => {
    // Redirecionar para dashboard
    const clinic = new URLSearchParams(window.location.search).get('clinic') || 'ninho';
    window.location.href = `${window.location.origin}/?page=dashboard&clinic=${clinic}`;
  };

  const handleNewPatientClick = () => {
    // Abrir página de cadastro de novo paciente em nova aba
    const registerUrl = `${window.location.origin}${window.location.pathname}?page=patient-register`;
    window.open(registerUrl, '_blank');
  };

  const handleProfessionalToggle = (professional: string) => {
    const newSelectedProfessionals = selectedProfessionals.includes(professional)
      ? selectedProfessionals.filter(p => p !== professional)
      : [...selectedProfessionals, professional];

    setSelectedProfessionals(newSelectedProfessionals);
    handleFilterChange('professionals', newSelectedProfessionals);
  };

  const handleSelectAllProfessionals = () => {
    const newSelectedProfessionals = selectedProfessionals.length === professionalsList.length
      ? []
      : [...professionalsList];

    setSelectedProfessionals(newSelectedProfessionals);
    handleFilterChange('professionals', newSelectedProfessionals);
  };

  const handlePatientToggle = (patient: string) => {
    const isCurrentlySelected = selectedPatients.includes(patient);

    const newSelectedPatients = selectedPatients.includes(patient) ? [] : [patient];

    setSelectedPatients(newSelectedPatients);

    // Fechar dropdown após seleção
    setIsPatientDropdownOpen(false);

    // Atualizar campo de busca
    setPatientSearchTerm(isCurrentlySelected ? '' : patient.split(' - ')[0]);

    // Atualizar filtros
    handleFilterChange('patients', newSelectedPatients);
  };


  const getFilteredPatients = () => {
    if (patientSearchTerm.length < 3) return [];
    return patientsList.filter(patient =>
      patient.toLowerCase().includes(patientSearchTerm.toLowerCase())
    );
  };

  const handlePatientSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPatientSearchTerm(value);

    // Se o campo for limpo, remover seleção
    if (value === '') {
      setSelectedPatients([]);
      handleFilterChange('patients', []);
    }

    setIsPatientDropdownOpen(value.length >= 3);
  };


  // Funções do calendário
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const getCalendarTitle = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };

    if (calendarView === 'day') {
      return currentDate.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (calendarView === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${startOfWeek.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
    }

    return currentDate.toLocaleDateString('pt-BR', options);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  // Funções do modal de eventos
  const openEventModal = (date: Date, events: ScheduleEvent[]) => {
    setSelectedDayDate(date);
    setSelectedDayEvents(events);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedDayEvents([]);
    setSelectedDayDate(null);
  };

  // Funções do modal unificado de agendamento
  const openEditModal = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    const startDate = event.date;
    const endDate = event.date;

    setAppointmentModalData({
      patient: event.patient,
      firstResponsible: 'Fernanda de Miranda Ferreira',
      secondResponsible: 'Bruno Tosati Pradella',
      professional: event.doctor,
      team: 'Equipe Ninho',
      serviceType: event.service,
      startDate: startDate,
      startTime: event.time,
      endDate: endDate,
      endTime: calculateEndTime(event.time),
      appointmentType: 'unique',
      recurrenceType: '',
      maxOccurrences: 1,
      unitValue: '',
      discount: '',
      totalUnit: '',
      totalValue: '',
      observations: ''
    });

    setAppointmentModalMode('edit');
    setIsAppointmentModalOpen(true);
    setIsEventModalOpen(false);
  };

  const openNewAppointmentModal = (date: Date, time?: string) => {
    const dateStr = date.toISOString().split('T')[0];

    setAppointmentModalData({
      patient: '',
      firstResponsible: '',
      secondResponsible: '',
      professional: '',
      team: '',
      serviceType: '',
      startDate: dateStr,
      startTime: time || '08:00',
      endDate: dateStr,
      endTime: time ? calculateEndTime(time) : '09:00',
      appointmentType: 'unique',
      recurrenceType: '',
      maxOccurrences: 1,
      unitValue: '',
      discount: '',
      totalUnit: '',
      totalValue: '',
      observations: ''
    });

    setAppointmentModalMode('create');
    setIsAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setSelectedEvent(null);
    setAppointmentModalData({});
  };

  const handleAppointmentSave = (data: AppointmentData) => {
    // Aqui implementar a lógica de salvar
    console.log('Salvando agendamento:', data);

    // Por enquanto, só fechar o modal
    closeAppointmentModal();
  };

  // Funções do modal de agenda do paciente
  const openPatientScheduleModal = () => {
    if (selectedPatients.length === 0) return;

    const selectedPatientName = selectedPatients[0].split(' - ')[0];

    // Filtrar eventos que contêm o nome do paciente selecionado
    const patientEvents = events.filter((event: ScheduleEvent) =>
      event.patient && event.patient.toLowerCase().includes(selectedPatientName.toLowerCase())
    );

    setPatientScheduleEvents(patientEvents);
    setIsPatientScheduleModalOpen(true);
  };

  const closePatientScheduleModal = () => {
    setIsPatientScheduleModalOpen(false);
    setPatientScheduleEvents([]);
  };

  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1; // Assumindo 1 hora de duração
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getMinDate = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return thirtyDaysAgo.toISOString().split('T')[0];
  };

  // Função para consultar a API da agenda (preparada para implementação futura)
  const fetchAgendaData = async (filterParams: any) => {
    setIsLoading(true);

    try {
      // TODO: Substituir por chamada real da API quando estiver disponível
      // const response = await fetch('/api/agenda/events', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   },
      //   body: JSON.stringify(filterParams)
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Erro ao buscar dados da agenda');
      // }
      //
      // const data = await response.json();
      // setEvents(data.events || []);

      // Simulação de delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Por enquanto, filtra os dados locais baseado nos filtros
      let filteredEvents = allMockEvents;

      // Filtrar por profissionais selecionados
      if (filterParams.professionals && filterParams.professionals.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          filterParams.professionals.some((prof: string) =>
            event.doctor.includes(prof.split(' - ')[0])
          )
        );
      }

      // Filtrar por período
      if (filterParams.startDate && filterParams.endDate) {
        filteredEvents = filteredEvents.filter(event =>
          event.date >= filterParams.startDate && event.date <= filterParams.endDate
        );
      }

      // Filtrar por pacientes selecionados
      if (filterParams.patients && filterParams.patients.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          filterParams.patients.some((patient: string) =>
            patient.toLowerCase().includes(event.patient.toLowerCase())
          )
        );
      }

      setEvents(filteredEvents);

    } catch (error) {
      console.error('Erro ao buscar dados da agenda:', error);
      // Em caso de erro, manter dados atuais
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para mudança nos filtros
  const handleFilterChange = async (field: string, value: any) => {
    const newFilters = { ...filters, [field]: value };

    // Atualizar campos específicos baseados no tipo de filtro
    if (field === 'professionals') {
      setSelectedProfessionals(value);
    } else if (field === 'patients') {
      setSelectedPatients(value);
    }

    setFilters(newFilters);

    // Consultar API com novos filtros
    await fetchAgendaData(newFilters);
  };

  // useEffect para carregar dados iniciais
  useEffect(() => {
    fetchAgendaData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas na montagem do componente

  // useEffect para pré-preencher paciente da URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const patientParam = urlParams.get('patient');

    if (patientParam) {
      // Decodificar o nome do paciente e pré-preencher o campo de busca
      const decodedPatientName = decodeURIComponent(patientParam);
      setPatientSearchTerm(decodedPatientName);
    }
  }, []);


  // Função para limpar todos os filtros
  const handleClearFilters = async () => {
    const initialFilters = getInitialFilters();

    setFilters(initialFilters);
    setSelectedProfessionals(initialFilters.professionals);
    setSelectedPatients(initialFilters.patients);
    setPatientSearchTerm('');
    setHasFilterChanges(false);

    // Fechar dropdowns
    setIsPatientDropdownOpen(false);

    await fetchAgendaData(initialFilters);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#007bff'; // Azul - Confirmado
      case 'cancelled': return '#dc3545'; // Vermelho - Cancelado
      case 'pending': return '#ffc107'; // Amarelo - Pendente Confirmação
      case 'attended': return '#28a745'; // Verde - Compareceu
      case 'no_show': return '#6c757d'; // Cinza - Faltou sem aviso
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'cancelled': return 'Cancelado';
      case 'pending': return 'Pendente Confirmação';
      case 'attended': return 'Compareceu';
      case 'no_show': return 'Faltou sem aviso';
      default: return 'Desconhecido';
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Funções auxiliares para a grade de horários
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    // Adicionar 23:00 como último slot
    slots.push('23:00');
    return slots;
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getEventPosition = (event: ScheduleEvent) => {
    const startMinutes = timeToMinutes(event.time);
    const startTime = 6 * 60; // 6:00 AM em minutos
    const endTime = 23 * 60; // 23:00 PM em minutos
    const totalMinutes = endTime - startTime;

    const top = ((startMinutes - startTime) / totalMinutes) * 100;
    const height = (event.duration / totalMinutes) * 100;

    return { top: `${top}%`, height: `${height}%` };
  };

  const getEventPositionPixels = (event: ScheduleEvent) => {
    const startMinutes = timeToMinutes(event.time);
    const startTime = 6 * 60; // 6:00 AM em minutos
    const minutesFromStart = startMinutes - startTime;

    // Cada slot de 30 minutos = 45px
    const pixelsPerMinute = 45 / 30;
    const top = minutesFromStart * pixelsPerMinute;
    const height = event.duration * pixelsPerMinute;

    return { top: `${top}px`, height: `${height}px` };
  };

  const getOverlappingEvents = (events: ScheduleEvent[], targetEvent: ScheduleEvent) => {
    const targetStart = timeToMinutes(targetEvent.time);
    const targetEnd = targetStart + targetEvent.duration;

    return events.filter(event => {
      if (event === targetEvent) return false;
      const eventStart = timeToMinutes(event.time);
      const eventEnd = eventStart + event.duration;

      return (eventStart < targetEnd && eventEnd > targetStart);
    });
  };

  const calculateEventLayout = (events: ScheduleEvent[]) => {
    // Primeiro, vamos criar grupos de eventos que realmente se sobrepõem no mesmo tempo
    const processed = new Set<number>();
    const result: LayoutEvent[] = [];

    for (let i = 0; i < events.length; i++) {
      if (processed.has(i)) continue;

      const currentEvent = events[i];
      const currentStart = timeToMinutes(currentEvent.time);
      const currentEnd = currentStart + currentEvent.duration;

      // Encontrar todos os eventos que se sobrepõem com este
      const overlappingGroup = [currentEvent];
      const overlappingIndices = [i];

      for (let j = 0; j < events.length; j++) {
        if (i === j || processed.has(j)) continue;

        const otherEvent = events[j];
        const otherStart = timeToMinutes(otherEvent.time);
        const otherEnd = otherStart + otherEvent.duration;

        // Verificar se há sobreposição real
        if (currentStart < otherEnd && currentEnd > otherStart) {
          overlappingGroup.push(otherEvent);
          overlappingIndices.push(j);
        }
      }

      // Marcar todos os eventos deste grupo como processados
      overlappingIndices.forEach(idx => processed.add(idx));

      // Ordenar o grupo por horário de início
      overlappingGroup.sort((a, b) => {
        const timeA = timeToMinutes(a.time);
        const timeB = timeToMinutes(b.time);
        if (timeA !== timeB) return timeA - timeB;
        return events.indexOf(a) - events.indexOf(b);
      });

      // Calcular posições para cada evento no grupo
      const groupSize = overlappingGroup.length;

      overlappingGroup.forEach((event, groupIndex) => {
        const width = 100 / groupSize;
        const left = groupIndex * width;

        result.push({
          ...event,
          ...getEventPosition(event),
          width: `${width - 0.5}%`,
          left: `${left}%`,
          zIndex: 10 + groupIndex
        });
      });
    }

    return result;
  };

  const calculateEventLayoutPixels = (events: ScheduleEvent[]) => {
    // Primeiro, vamos criar grupos de eventos que realmente se sobrepõem no mesmo tempo
    const processed = new Set<number>();
    const result: LayoutEvent[] = [];

    for (let i = 0; i < events.length; i++) {
      if (processed.has(i)) continue;

      const currentEvent = events[i];
      const currentStart = timeToMinutes(currentEvent.time);
      const currentEnd = currentStart + currentEvent.duration;

      // Encontrar todos os eventos que se sobrepõem com este
      const overlappingGroup = [currentEvent];
      const overlappingIndices = [i];

      for (let j = 0; j < events.length; j++) {
        if (i === j || processed.has(j)) continue;

        const otherEvent = events[j];
        const otherStart = timeToMinutes(otherEvent.time);
        const otherEnd = otherStart + otherEvent.duration;

        // Verificar se há sobreposição real
        if (currentStart < otherEnd && currentEnd > otherStart) {
          overlappingGroup.push(otherEvent);
          overlappingIndices.push(j);
        }
      }

      // Marcar todos os eventos deste grupo como processados
      overlappingIndices.forEach(idx => processed.add(idx));

      // Ordenar o grupo por horário de início
      overlappingGroup.sort((a, b) => {
        const timeA = timeToMinutes(a.time);
        const timeB = timeToMinutes(b.time);
        if (timeA !== timeB) return timeA - timeB;
        return events.indexOf(a) - events.indexOf(b);
      });

      // Calcular posições para cada evento no grupo
      const groupSize = overlappingGroup.length;

      overlappingGroup.forEach((event, groupIndex) => {
        const width = 100 / groupSize;
        const left = groupIndex * width;

        result.push({
          ...event,
          ...getEventPositionPixels(event),
          width: `${width - 0.5}%`,
          left: `${left}%`,
          zIndex: 10 + groupIndex
        });
      });
    }

    return result;
  };

  // Menu items dinâmicos baseados no perfil do usuário com navegação funcional
  const loggedMenuItems = userSession?.menuItems?.map(item => ({
    ...item,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      const clinic = new URLSearchParams(window.location.search).get('clinic') || 'ninho';

      switch (item.label) {
        case 'Dashboard':
          window.location.href = `${window.location.origin}/?page=dashboard&clinic=${clinic}`;
          break;
        case 'Agenda':
          window.location.href = `${window.location.origin}/?page=schedule&clinic=${clinic}`;
          break;
        case 'Pacientes':
          alert('Página de Pacientes em desenvolvimento');
          break;
        case 'Relatórios':
          alert('Página de Relatórios em desenvolvimento');
          break;
        case 'Financeiro':
          alert('Página Financeiro em desenvolvimento');
          break;
        case 'Usuários':
          alert('Página de Usuários em desenvolvimento');
          break;
        case 'Configurações':
          alert('Página de Configurações em desenvolvimento');
          break;
        default:
          console.log('Menu item clicked:', item.label);
      }
    }
  })) || [];

  if (!userSession) {
    return (
      <div className="login-page">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#03B4C6',
          fontSize: '1.2rem'
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* CSS para animação de loading */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <HeaderInternal
        showCTAButton={false}
        className="login-header"
        isLoggedIn={true}
        userEmail={userSession.email}
        userProfile={userSession.role}
        clinicName={userSession.clinicName}
        notificationCount={27}
        onRevalidateLogin={handleRevalidateLogin}
        onNotificationClick={handleNotificationClick}
        onUserClick={handleUserClick}
        onLogoClick={handleLogoClick}
      />

      <Box className="dashboard-main">
        <Container className="dashboard-container" maxWidth={false} disableGutters>
          <Box className="dashboard-content">
            {/* Título da Página */}
            <Box className="page-header-container">
              <Box className="page-header-content">
                <Typography variant="h4" className="page-header-title" sx={{ fontSize: '1.3rem', mb: 1 }}>
                  Agenda Profissional
                </Typography>
                <Typography variant="body2" className="page-header-description">
                  Gerencie sua agenda, visualize compromissos e organize horários de atendimento.
                </Typography>
              </Box>
              <FaqButton />
            </Box>

            {/* Filtros da Agenda */}
            <Paper
              className="schedule-filters"
              elevation={0}
              sx={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e9ecef',
                mb: 1
              }}
            >
              <Box
                className="schedule-filters-grid"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  mb: 3
                }}
              >
                {/* Equipe */}
                <Box>
                  <TextField
                    select
                    label="Equipe"
                    value={filters.team}
                    onChange={(e) => handleFilterChange('team', e.target.value)}
                    fullWidth
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    SelectProps={{
                      displayEmpty: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: '#ced4da',
                          legend: {
                            maxWidth: '100%',
                          },
                        },
                        '&:hover fieldset': {
                          borderColor: '#ced4da',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#03B4C6',
                          boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
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
                    }}
                  >
                    <MenuItem value="">Todas as equipes</MenuItem>
                    <MenuItem value="Equipe Ninho">Equipe Ninho</MenuItem>
                    <MenuItem value="Equipe Alpha">Equipe Alpha</MenuItem>
                    <MenuItem value="Equipe Beta">Equipe Beta</MenuItem>
                  </TextField>
                </Box>

                {/* Data inicial */}
                <Box>
                  <TextField
                    label="Data inicial"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    fullWidth
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: '#ced4da',
                          legend: {
                            maxWidth: '100%',
                          },
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
                    }}
                  />
                </Box>

                {/* Data final */}
                <Box>
                  <TextField
                    label="Data final"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    fullWidth
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: '#ced4da',
                          legend: {
                            maxWidth: '100%',
                          },
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
                    }}
                  />
                </Box>

                {/* Nome do Profissional */}
                <Box sx={{ minWidth: '250px' }}>
                  <FormControl fullWidth size="small">
                    <InputLabel
                      id="professional-select-label"
                      shrink
                      sx={{
                        fontSize: '0.95rem',
                        color: '#6c757d',
                        backgroundColor: 'white',
                        paddingLeft: '4px',
                        paddingRight: '4px',
                        '&.Mui-focused': {
                          color: '#03B4C6',
                        },
                      }}
                    >
                      Nome do Profissional
                    </InputLabel>
                    <Select
                      labelId="professional-select-label"
                      multiple
                      value={selectedProfessionals}
                      onChange={(e) => {
                        const value = e.target.value;
                        const filteredValue = typeof value === 'string' ? value.split(',') : value.filter((v: string) => v !== 'all');
                        setSelectedProfessionals(filteredValue);
                      }}
                      input={<OutlinedInput label="Nome do Profissional" notched />}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <span style={{ color: '#6c757d' }}>Selecione</span>;
                        }
                        if (selected.length === 1) {
                          return selected[0].split(' - ')[0];
                        }
                        return `${selected.length} selecionados`;
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                      sx={{
                        height: '40px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ced4da',
                          legend: {
                            maxWidth: '100%',
                          },
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
                      <MenuItem
                        value="all"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectAllProfessionals();
                        }}
                        sx={{
                          backgroundColor: '#f8f9fa !important',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          borderBottom: '1px solid #e9ecef',
                        }}
                      >
                        <Checkbox
                          checked={selectedProfessionals.length === professionalsList.length}
                          indeterminate={selectedProfessionals.length > 0 && selectedProfessionals.length < professionalsList.length}
                          sx={{
                            padding: '4px 8px 4px 4px',
                            '& .MuiSvgIcon-root': {
                              fontSize: '1.2rem',
                            },
                          }}
                        />
                        <ListItemText
                          primary={`Selecionar Todos (${professionalsList.length})`}
                          primaryTypographyProps={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        />
                      </MenuItem>
                      {professionalsList.map((professional) => (
                        <MenuItem
                          key={professional}
                          value={professional}
                          sx={{
                            fontSize: '0.85rem',
                            '&:hover': {
                              backgroundColor: '#f8f9fa',
                            },
                          }}
                        >
                          <Checkbox
                            checked={selectedProfessionals.includes(professional)}
                            sx={{
                              padding: '4px 8px 4px 4px',
                              '& .MuiSvgIcon-root': {
                                fontSize: '1.2rem',
                              },
                            }}
                          />
                          <ListItemText
                            primary={professional.split(' - ')[0]}
                            secondary={professional.split(' - ')[1]}
                            primaryTypographyProps={{
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              color: '#495057',
                            }}
                            secondaryTypographyProps={{
                              fontSize: '0.75rem',
                              color: '#6c757d',
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Busca paciente */}
                <div className="schedule-patient-search" style={{ gridColumn: 'span 2', position: 'relative', minWidth: '300px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      {/* Campo de busca */}
                      <TextField
                        label="Busca paciente cadastrado"
                        placeholder="Digite o nome do paciente..."
                        value={selectedPatients.length > 0 ? selectedPatients[0].split(' - ')[0] : patientSearchTerm}
                        onChange={handlePatientSearchChange}
                        onClick={(e) => e.stopPropagation()}
                        fullWidth
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: '40px',
                            fontSize: '1rem',
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#ced4da',
                              legend: {
                                maxWidth: '100%',
                              },
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
                            padding: '0.375rem 0.5rem',
                            color: '#495057',
                            fontWeight: selectedPatients.length > 0 ? '500' : 'normal',
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
                        }}
                      />

                      {/* Dropdown com resultados */}
                      {isPatientDropdownOpen && getFilteredPatients().length > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: 'calc(100% + 2px)',
                          left: 0,
                          right: 0,
                          background: 'white',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          zIndex: 1000,
                          maxHeight: '250px',
                          overflowY: 'auto'
                        }}>

                          {/* Lista de pacientes filtrados */}
                          {getFilteredPatients().map((patient, index) => (
                            <div
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePatientToggle(patient);
                              }}
                              style={{
                                padding: '0.75rem 0.5rem',
                                borderBottom: index < getFilteredPatients().length - 1 ? '1px solid #e9ecef' : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'background 0.2s',
                                fontSize: '0.85rem'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{
                                  fontWeight: '500',
                                  color: '#495057'
                                }}>
                                  {patient.split(' - ')[0]}
                                </span>
                                <span style={{
                                  fontSize: '0.75rem',
                                  color: '#6c757d',
                                  marginTop: '2px'
                                }}>
                                  {patient.split(' - ').slice(1).join(' - ')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openNewAppointmentModal(new Date())}
                        className="btn-add-schedule"
                        title="Agendar novo compromisso">
                        <CalendarToday />
                      </button>

                      <IconButton
                        onClick={handleClearFilters}
                        disabled={!hasFilterChanges || isLoading}
                        title="Limpar filtros"
                        sx={{
                          backgroundColor: '#6c757d',
                          color: 'white',
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
                          },
                        }}
                      >
                        <FilterAltOff fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Box>

              {/* Botões de ação */}
              <div className="schedule-filters-actions" style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={openPatientScheduleModal}
                  disabled={selectedPatients.length === 0}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedPatients.length === 0 ? '#adb5bd' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    cursor: selectedPatients.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: selectedPatients.length === 0 ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <EventNote fontSize="small" />
                  Agenda Paciente
                </button>
                <button
                  onClick={() => {
                    if (selectedPatients.length > 0) {
                      const patientId = selectedPatients[0].split(' - ')[0];
                      const registerUrl = `${window.location.origin}${window.location.pathname}?page=patient-register&id=${patientId}`;
                      window.open(registerUrl, '_blank');
                    }
                  }}
                  disabled={selectedPatients.length === 0}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedPatients.length === 0 ? '#adb5bd' : '#6f42c1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    cursor: selectedPatients.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: selectedPatients.length === 0 ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Folder fontSize="small" />
                  Cadastro do Paciente
                </button>
                <button
                  onClick={handleNewPatientClick}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <PersonAdd fontSize="small" />
                  Novo Paciente
                </button>
                <button
                  onClick={() => {
                    const patientsUrl = `${window.location.origin}${window.location.pathname}?page=patients`;
                    window.open(patientsUrl, '_blank');
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <List fontSize="small" />
                  Lista de pacientes
                </button>
              </div>
            </Paper>

            {/* Navegação do Calendário */}
            <div className="schedule-calendar-nav" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
              marginBottom: '1rem'
            }}>
              <div className="schedule-calendar-controls" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div className="schedule-calendar-nav-buttons" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={goToToday}
                    title="Ir para hoje"
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}>
                    Hoje
                  </button>
                  <button
                    onClick={goToPrevious}
                    title="Período anterior"
                    style={{
                      padding: '0.5rem',
                      background: '#495057',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                    ◀
                  </button>
                  <button
                    onClick={goToNext}
                    title="Próximo período"
                    style={{
                      padding: '0.5rem',
                      background: '#495057',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                    ▶
                  </button>
                </div>

                <h2 style={{
                  margin: '0',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  {getCalendarTitle()}
                </h2>

                <div className="schedule-calendar-view-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setCalendarView('month')}
                    title="Visualizar mês"
                    style={{
                      padding: '0.5rem 1rem',
                      background: calendarView === 'month' ? '#495057' : 'transparent',
                      color: calendarView === 'month' ? 'white' : '#495057',
                      border: calendarView === 'month' ? 'none' : '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}>
                    Mês
                  </button>
                  <button
                    onClick={() => setCalendarView('week')}
                    title="Visualizar semana"
                    style={{
                      padding: '0.5rem 1rem',
                      background: calendarView === 'week' ? '#495057' : 'transparent',
                      color: calendarView === 'week' ? 'white' : '#495057',
                      border: calendarView === 'week' ? 'none' : '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}>
                    Semana
                  </button>
                  <button
                    onClick={() => setCalendarView('day')}
                    title="Visualizar dia"
                    style={{
                      padding: '0.5rem 1rem',
                      background: calendarView === 'day' ? '#495057' : 'transparent',
                      color: calendarView === 'day' ? 'white' : '#495057',
                      border: calendarView === 'day' ? 'none' : '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}>
                    Dia
                  </button>
                </div>
              </div>
            </div>

            {/* Grade do Calendário */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Indicador de loading */}
              {isLoading && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                  fontSize: '1.1rem',
                  color: '#03B4C6',
                  fontWeight: '500'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #03B4C6',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Atualizando agenda...
                  </div>
                </div>
              )}
              {/* Visão Mensal */}
              {calendarView === 'month' && (
                <div className="schedule-month-view" style={{ width: '100%', overflow: 'hidden' }}>
                  <div className="schedule-month-grid" style={{ width: '100%' }}>
                    {/* Cabeçalho dos dias da semana */}
                    <div className="schedule-month-header" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, minmax(120px, 1fr))',
                      background: '#f8f9fa',
                      borderBottom: '1px solid #e9ecef'
                    }}>
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                        <div key={day} style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                          color: '#495057',
                          borderRight: '1px solid #e9ecef'
                        }}>
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Dias do mês */}
                    <div className="schedule-month-days-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, minmax(120px, 1fr))',
                      gridAutoRows: 'minmax(140px, auto)'
                    }}>
                      {getDaysInMonth().map((date, index) => {
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                        const isToday = date.toDateString() === new Date().toDateString();
                        const events = getEventsForDate(date);

                        return (
                          <div key={index} className="schedule-month-day" style={{
                            padding: '0.5rem',
                            borderRight: (index + 1) % 7 !== 0 ? '1px solid #e9ecef' : 'none',
                            borderBottom: '1px solid #e9ecef',
                            background: isCurrentMonth ? 'white' : '#f8f9fa',
                            position: 'relative',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                          }}
                        onClick={() => openNewAppointmentModal(date)}
                        onMouseEnter={(e) => {
                          if (isCurrentMonth) {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isCurrentMonth) {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}>
                            <div className="schedule-month-day-number" style={{
                              fontSize: '0.9rem',
                              fontWeight: isToday ? '700' : '500',
                              color: isToday ? '#03B4C6' : isCurrentMonth ? '#495057' : '#adb5bd',
                              marginBottom: '0.25rem'
                            }}>
                              {date.getDate()}
                            </div>

                            <div style={{
                              flex: 1,
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px'
                            }}>
                              {events.slice(0, 2).map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className="schedule-month-event"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(event);
                                  }}
                                  style={{
                                    background: getStatusColor(event.status),
                                    color: 'white',
                                    padding: '2px 4px',
                                    borderRadius: '2px',
                                    fontSize: '0.75rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'opacity 0.2s',
                                    lineHeight: '1.2'
                                  }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                              >
                                {event.time} {event.patient}
                              </div>
                            ))}
                            </div>

                          {events.length > 2 && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                openEventModal(date, events);
                              }}
                              style={{
                                color: '#495057',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                padding: '2px 4px',
                                marginTop: '2px',
                                fontWeight: '500'
                              }}
                            >
                              +{events.length - 2} mais
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Visão Semanal com Grade de Horários */}
              {calendarView === 'week' && (
                <div style={{ display: 'flex', height: '1635px' }}>
                  {/* Coluna de horários */}
                  <div style={{
                    width: '80px',
                    background: '#f8f9fa',
                    borderRight: '1px solid #e9ecef'
                  }}>
                    {/* Espaço para o cabeçalho dos dias */}
                    <div style={{ height: '60px', borderBottom: '1px solid #e9ecef' }}></div>

                    {/* Horários */}
                    {generateTimeSlots().map((time, index) => (
                      <div key={time} style={{
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        color: '#6c757d',
                        borderBottom: index % 2 === 1 ? '1px solid #e9ecef' : '1px solid #f1f3f4',
                        background: index % 2 === 0 ? '#f8f9fa' : 'white'
                      }}>
                        {index % 2 === 0 ? time : ''}
                      </div>
                    ))}
                  </div>

                  {/* Grade dos dias */}
                  <div style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)'
                  }}>
                    {getWeekDays().map((date, dayIndex) => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      const dayEvents = getEventsForDate(date);
                      const layoutEvents = calculateEventLayout(dayEvents);

                      return (
                        <div key={dayIndex} style={{
                          borderRight: dayIndex < 6 ? '1px solid #e9ecef' : 'none',
                          position: 'relative'
                        }}>
                          {/* Cabeçalho do dia */}
                          <div style={{
                            height: '60px',
                            background: isToday ? '#e3f2fd' : '#f8f9fa',
                            borderBottom: '1px solid #e9ecef',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.5rem'
                          }}>
                            <div style={{
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              color: isToday ? '#1976d2' : '#495057'
                            }}>
                              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][dayIndex]}
                            </div>
                            <div style={{
                              fontSize: '1rem',
                              fontWeight: isToday ? '700' : '500',
                              color: isToday ? '#1976d2' : '#495057'
                            }}>
                              {date.getDate()}
                            </div>
                          </div>

                          {/* Grade de horários para o dia */}
                          <div style={{ position: 'relative', height: '1575px' }}>
                            {/* Linhas de horário */}
                            {generateTimeSlots().map((time, timeIndex) => (
                              <div
                                key={time}
                                onClick={() => openNewAppointmentModal(date, time)}
                                style={{
                                  position: 'absolute',
                                  top: `${(timeIndex / generateTimeSlots().length) * 100}%`,
                                  left: 0,
                                  right: 0,
                                  height: '45px',
                                  borderBottom: timeIndex % 2 === 1 ? '1px solid #e9ecef' : '1px solid #f1f3f4',
                                  background: isToday && timeIndex % 2 === 0 ? '#fafafa' : 'transparent',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e3f2fd'}
                                onMouseLeave={(e) => e.currentTarget.style.background = isToday && timeIndex % 2 === 0 ? '#fafafa' : 'transparent'}
                              />
                            ))}

                            {/* Eventos posicionados */}
                            {layoutEvents.map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(event);
                                }}
                                style={{
                                  position: 'absolute',
                                  top: event.top,
                                  left: event.left,
                                  width: event.width,
                                  height: event.height,
                                  background: getStatusColor(event.status),
                                  color: 'white',
                                  borderRadius: '4px',
                                  padding: '4px 6px',
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  overflow: 'hidden',
                                  zIndex: event.zIndex,
                                  transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.02)';
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                                  e.currentTarget.style.zIndex = '100';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.boxShadow = 'none';
                                  e.currentTarget.style.zIndex = event.zIndex.toString();
                                }}
                                title={`${event.time} - ${event.patient}\n${event.service} - ${event.doctor}\nDuração: ${event.duration}min`}
                              >
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  marginBottom: '1px',
                                  fontSize: '0.8rem',
                                  gap: '4px'
                                }}>
                                  <span style={{ fontWeight: '600' }}>{event.time}</span>
                                  <span style={{
                                    fontWeight: '500',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>{event.patient}</span>
                                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>({event.duration}min)</span>
                                </div>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  fontSize: '0.75rem',
                                  opacity: 0.9,
                                  gap: '4px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  <span>{event.service}</span>
                                  <span>- {event.doctor.split(' ')[1] || event.doctor.split(' ')[0]}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Visão Diária com Grade de Horários */}
              {calendarView === 'day' && (
                <div style={{ padding: '1rem' }}>
                  {/* Cabeçalho do dia */}
                  <div style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{
                      margin: '0',
                      fontSize: '1.3rem',
                      color: '#495057',
                      fontWeight: '600'
                    }}>
                      {currentDate.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                  </div>

                  {/* Grade de horários diária */}
                  <div style={{ display: 'flex', height: '1635px', border: '1px solid #e9ecef', borderRadius: '8px', overflow: 'hidden' }}>
                    {/* Coluna de horários */}
                    <div style={{
                      width: '100px',
                      background: '#f8f9fa',
                      borderRight: '1px solid #e9ecef'
                    }}>
                      {generateTimeSlots().map((time, index) => (
                        <div key={time} style={{
                          height: '45px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          color: '#6c757d',
                          borderBottom: index % 2 === 1 ? '1px solid #e9ecef' : '1px solid #f1f3f4',
                          background: index % 2 === 0 ? '#f8f9fa' : 'white',
                          fontWeight: index % 2 === 0 ? '500' : '400'
                        }}>
                          {index % 2 === 0 ? time : ''}
                        </div>
                      ))}
                    </div>

                    {/* Área de eventos */}
                    <div style={{ flex: 1, position: 'relative', background: 'white' }}>
                      {/* Linhas de horário */}
                      {generateTimeSlots().map((time, timeIndex) => (
                        <div
                          key={time}
                          onClick={() => openNewAppointmentModal(currentDate, time)}
                          style={{
                            position: 'absolute',
                            top: `${timeIndex * 45}px`,
                            left: 0,
                            right: 0,
                            height: '45px',
                            borderBottom: timeIndex % 2 === 1 ? '1px solid #e9ecef' : '1px solid #f1f3f4',
                            background: timeIndex % 2 === 0 ? '#fafafa' : 'transparent',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#e3f2fd'}
                          onMouseLeave={(e) => e.currentTarget.style.background = timeIndex % 2 === 0 ? '#fafafa' : 'transparent'}
                        />
                      ))}

                      {/* Eventos posicionados */}
                      {(() => {
                        const dayEvents = getEventsForDate(currentDate);
                        const layoutEvents = calculateEventLayoutPixels(dayEvents);

                        if (layoutEvents.length === 0) {
                          return (
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              textAlign: 'center',
                              color: '#6c757d',
                              fontSize: '1.2rem'
                            }}>
                              Nenhum agendamento para este dia
                            </div>
                          );
                        }

                        return layoutEvents.map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(event);
                            }}
                            style={{
                              position: 'absolute',
                              top: event.top,
                              left: event.left,
                              width: event.width,
                              height: event.height,
                              background: getStatusColor(event.status),
                              color: 'white',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              border: '2px solid rgba(255,255,255,0.3)',
                              overflow: 'hidden',
                              zIndex: event.zIndex,
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.02)';
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                              e.currentTarget.style.zIndex = '100';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                              e.currentTarget.style.zIndex = event.zIndex.toString();
                            }}
                            title={`${event.time} - ${event.patient}\n${event.service} - ${event.doctor}\nDuração: ${event.duration}min\nStatus: ${getStatusText(event.status)}`}
                          >
{/* Layout otimizado: linha 1: hora + paciente + duração, linha 2: procedimento + profissional */}
                            {event.duration <= 30 ? (
                              // Layout compacto para eventos curtos
                              <>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  marginBottom: '2px',
                                  fontSize: '0.9rem',
                                  gap: '6px'
                                }}>
                                  <span style={{ fontWeight: '700' }}>{event.time}</span>
                                  <span style={{
                                    fontWeight: '600',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>{event.patient}</span>
                                  <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>({event.duration}min)</span>
                                </div>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  fontSize: '0.85rem',
                                  opacity: 0.95,
                                  gap: '6px'
                                }}>
                                  <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>{event.service}</span>
                                  <span style={{
                                    fontSize: '0.8rem',
                                    opacity: 0.9
                                  }}>- {event.doctor.split(' ')[1] || event.doctor.split(' ')[0]}</span>
                                </div>
                              </>
                            ) : event.duration <= 60 ? (
                              // Layout médio para eventos padrão
                              <>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  marginBottom: '3px',
                                  fontSize: '0.95rem',
                                  gap: '8px'
                                }}>
                                  <span style={{ fontWeight: '700' }}>{event.time}</span>
                                  <span style={{
                                    fontWeight: '600',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>{event.patient}</span>
                                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>({event.duration}min)</span>
                                </div>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  fontSize: '0.9rem',
                                  opacity: 0.95,
                                  gap: '8px'
                                }}>
                                  <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>{event.service}</span>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    opacity: 0.9
                                  }}>- {event.doctor.split(' - ')[0].split(' ').slice(0, 2).join(' ')}</span>
                                </div>
                              </>
                            ) : (
                              // Layout completo para eventos longos
                              <>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  marginBottom: '4px',
                                  fontSize: '0.9rem',
                                  gap: '10px'
                                }}>
                                  <span style={{ fontWeight: '700' }}>{event.time}</span>
                                  <span style={{
                                    fontWeight: '600',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.95rem'
                                  }}>{event.patient}</span>
                                  <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>({event.duration}min)</span>
                                </div>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  marginBottom: '3px',
                                  fontSize: '0.85rem',
                                  opacity: 0.95,
                                  gap: '10px'
                                }}>
                                  <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>{event.service}</span>
                                  <span style={{
                                    fontSize: '0.8rem',
                                    opacity: 0.9
                                  }}>- {event.doctor.split(' - ')[0].split(' ').slice(0, 2).join(' ')}</span>
                                </div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  opacity: 0.85,
                                  fontStyle: 'italic',
                                  textAlign: 'center',
                                  padding: '2px 6px',
                                  background: 'rgba(255,255,255,0.2)',
                                  borderRadius: '4px',
                                  marginTop: '2px'
                                }}>
                                  {getStatusText(event.status)}
                                </div>
                              </>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Box>
        </Container>
      </Box>

      {/* Modal de eventos do dia */}
      {isEventModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={closeEventModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #e9ecef',
              paddingBottom: '1rem'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#495057'
              }}>
                Agendamentos do dia{' '}
                {selectedDayDate?.toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
              <button
                onClick={closeEventModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Lista de eventos */}
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {selectedDayEvents
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((event, index) => (
                <div
                  key={index}
                  onClick={() => openEditModal(event)}
                  style={{
                    background: 'white',
                    border: `1px solid ${getStatusColor(event.status)}`,
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${getStatusColor(event.status)}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      {event.time} - {event.patient}
                    </div>
                    <span style={{
                      background: getStatusColor(event.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {getStatusText(event.status)}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.95rem',
                    color: '#6c757d',
                    marginBottom: '0.25rem'
                  }}>
                    <strong>Serviço:</strong> {event.service}
                  </div>

                  <div style={{
                    fontSize: '0.95rem',
                    color: '#6c757d'
                  }}>
                    <strong>Profissional:</strong> {event.doctor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Modal unificado de agendamento */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={closeAppointmentModal}
        onSave={handleAppointmentSave}
        mode={appointmentModalMode}
        initialData={appointmentModalData}
        title={appointmentModalMode === 'create' ? 'Agendamento' : 'Editar Agendamento'}
        patientsList={patientsList}
      />

      {/* Modal de agenda do paciente */}
      {isPatientScheduleModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={closePatientScheduleModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #e9ecef',
              paddingBottom: '1rem'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#495057'
              }}>
                Agenda do Paciente: {selectedPatients.length > 0 ? selectedPatients[0].split(' - ')[0] : ''}
              </h3>
              <button
                onClick={closePatientScheduleModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Lista de agendamentos do paciente */}
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {patientScheduleEvents.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6c757d',
                  fontSize: '1.1rem'
                }}>
                  Nenhum agendamento encontrado para este paciente.
                </div>
              ) : (
                patientScheduleEvents
                  .sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (dateA.getTime() === dateB.getTime()) {
                      return a.time.localeCompare(b.time);
                    }
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((event, index) => (
                    <div
                      key={index}
                      onClick={() => openEditModal(event)}
                      style={{
                        background: 'white',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#28a745';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e9ecef';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#495057'
                        }}>
                          {event.time} - {calculateEndTime(event.time)}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#6c757d',
                          fontWeight: '500'
                        }}>
                          {new Date(event.date).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      <div style={{
                        fontSize: '0.95rem',
                        color: '#6c757d',
                        marginBottom: '0.25rem'
                      }}>
                        <strong>Serviço:</strong> {event.service}
                      </div>

                      <div style={{
                        fontSize: '0.95rem',
                        color: '#6c757d'
                      }}>
                        <strong>Profissional:</strong> {event.doctor}
                      </div>
                    </div>
                  ))
              )}
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

export default ProfessionalSchedule;