import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Print } from '@mui/icons-material';
import { colors, typography, spacing, buttons, shadows } from '../theme/designSystem';

interface TherapyPlanPrintProps {
  plan: any;
  patient: {
    name: string;
    birthDate: string;
    responsible: string;
  };
}

const TherapyPlanPrint: React.FC<TherapyPlanPrintProps> = ({ plan, patient }) => {
  const handlePrint = () => {
    window.print();
  };

  // TODO: Buscar do banco de dados
  // Dados mockados da empresa/clínica
  const clinicData = {
    name: 'INSTITUTO NINHO',
    shortName: 'INSTITUTO\nNINHO',
    address: 'R: Monsenhor Nuno de Faria Paiva, 177',
    addressLine2: 'Mogi das Cruzes - SP',
    phone: '+55 11 4990707',
    email: 'atendimento@ninhoinstituto.com.br',
    cnpj: '44.694.160/0001-79',
    logo: null // URL da logo se disponível
  };

  // TODO: Buscar do banco de dados
  // Dados mockados do plano terapêutico
  const therapyPlanData = {
    patient: {
      name: patient.name || 'Paciente Teste',
      birthDate: patient.birthDate || '15/08/2023',
      responsible: patient.responsible || 'Pacitente Teste Responsável 1'
    },
    plan: {
      title: plan.title || 'Plano teste',
      justification: plan.justification || 'Plano testePlano testePlano teste',
      responsible: 'Hilton Cassahara - Diretoria',
      startDate: plan.startDate || '01/09/2024',
      endDate: plan.endDate || '30/09/2024',
      scoreInitial: 4,
      scoreTarget: 5,
      metric: 'Escala de avaliação funcional'
    },
    emissionDate: new Date().toLocaleDateString('pt-BR')
  };

  // TODO: Buscar do banco de dados
  // Dados mockados para o gráfico de evolução (escala 0-10)
  const evolutionData = [
    { date: '01/09/2024', score: 4 },
    { date: '15/09/2024', score: 5 },
    { date: '01/10/2024', score: 6 },
    { date: '15/10/2024', score: 7 },
    { date: '01/11/2024', score: 8 }
  ];

  // TODO: Buscar do banco de dados
  // Dados mockados da tabela de evolução (histórico de sessões)
  const evolutionHistory = [
    {
      id: '1',
      date: '09/09/2023',
      professional: 'Hilton Cassahara - Diretoria',
      specialty: 'Fonoaudiologia',
      docProf: '',
      evaluation: 4, // Avaliação de 0 a 10
      scoreGAS: 'Não atendeu', // "Atendeu" ou "Não atendeu"
      evolution: 'asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste',
      conductOrientation: 'orientação asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste asfas teste'
    },
    {
      id: '2',
      date: '09/09/2023',
      professional: 'Hilton Cassahara - Diretoria',
      specialty: 'Fonoaudiologia',
      docProf: '',
      evaluation: 5,
      scoreGAS: 'Atendeu',
      evolution: 'sdsad saf',
      conductOrientation: 'safasdfas'
    },
    {
      id: '3',
      date: '09/09/2023',
      professional: 'Hilton Cassahara - Diretoria',
      specialty: 'Fonoaudiologia',
      docProf: '',
      evaluation: 6,
      scoreGAS: 'Atendeu',
      evolution: 'cbdfb',
      conductOrientation: 'sd dg ds'
    },
    {
      id: '4',
      date: '14/04/2024',
      professional: 'Hilton Cassahara - Diretoria',
      specialty: 'Fonoaudiologia',
      docProf: '',
      evaluation: 7,
      scoreGAS: 'Atendeu',
      evolution: 'sadfsa',
      conductOrientation: 'sdfsaf'
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: spacing.xl,
      '@media print': {
        padding: 0,
        backgroundColor: colors.white
      }
    }}>
      {/* Botão de impressão - oculto na impressão */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: spacing.md,
        '@media print': {
          display: 'none'
        }
      }}>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={handlePrint}
          sx={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: buttons.primary.padding,
            fontSize: buttons.primary.fontSize,
            fontWeight: buttons.primary.fontWeight,
            textTransform: buttons.primary.textTransform,
            borderRadius: buttons.primary.borderRadius,
            boxShadow: buttons.primary.boxShadow,
            '&:hover': {
              backgroundColor: colors.primaryHover,
              boxShadow: buttons.primary.hover.boxShadow
            }
          }}
        >
          Imprimir
        </Button>
      </Box>

      {/* Conteúdo para impressão */}
      <Paper sx={{
        maxWidth: '210mm',
        margin: '0 auto',
        padding: '20mm',
        backgroundColor: colors.white,
        minHeight: '297mm',
        boxShadow: shadows.base,
        borderRadius: '12px',
        '@media print': {
          boxShadow: shadows.none,
          margin: 0,
          maxWidth: 'none',
          padding: '15mm',
          borderRadius: 0
        }
      }}>
        {/* Cabeçalho */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: spacing.xl,
          pb: spacing.md,
          borderBottom: `2px solid ${colors.backgroundAlt}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Box sx={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `3px solid ${colors.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primaryLight
            }}>
              <Typography sx={{
                color: colors.primary,
                fontWeight: typography.fontWeight.bold,
                fontSize: typography.fontSize.xs,
                textAlign: 'center',
                lineHeight: typography.lineHeight.tight,
                whiteSpace: 'pre-line'
              }}>
                {clinicData.shortName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              mb: 0.5,
              color: colors.textPrimary
            }}>
              {clinicData.name}
            </Typography>
            <Typography sx={{
              fontSize: typography.fontSize.xs,
              color: colors.textSecondary
            }}>
              {clinicData.address}
            </Typography>
            <Typography sx={{
              fontSize: typography.fontSize.xs,
              color: colors.textSecondary
            }}>
              CNPJ: {clinicData.cnpj}
            </Typography>
          </Box>
        </Box>

        {/* Título */}
        <Typography sx={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold,
          textAlign: 'center',
          mb: spacing.lg,
          color: colors.textPrimary
        }}>
          Plano Terapêutico - Data de emissão: {therapyPlanData.emissionDate}
        </Typography>

        {/* Informações do Paciente */}
        <Box sx={{ mb: spacing.lg }}>
          <Box sx={{ display: 'flex', gap: spacing.xl, mb: spacing.sm }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Paciente:</strong> {therapyPlanData.patient.name}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Data nasc.:</strong> {therapyPlanData.patient.birthDate}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
            <strong>Responsável:</strong> {therapyPlanData.patient.responsible}
          </Typography>
        </Box>

        {/* Informações do Plano */}
        <Box sx={{ mb: spacing.lg, pb: spacing.md, borderBottom: `1px solid ${colors.border}` }}>
          <Typography sx={{ fontSize: typography.fontSize.sm, mb: spacing.sm, color: colors.textPrimary }}>
            <strong>Plano terapêutico:</strong> {therapyPlanData.plan.title}
          </Typography>
          <Typography sx={{ fontSize: typography.fontSize.sm, mb: spacing.sm, color: colors.textPrimary }}>
            <strong>Justificativa:</strong> {therapyPlanData.plan.justification}
          </Typography>
          <Typography sx={{ fontSize: typography.fontSize.sm, mb: spacing.md, color: colors.textPrimary }}>
            <strong>Responsável pelo plano:</strong> {therapyPlanData.plan.responsible}
          </Typography>
          <Box sx={{ display: 'flex', gap: spacing.xl, mb: spacing.sm }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Início:</strong> {therapyPlanData.plan.startDate}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Final:</strong> {therapyPlanData.plan.endDate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: spacing.xl, mb: spacing.sm }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Score inicial:</strong> {therapyPlanData.plan.scoreInitial}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Meta final:</strong> {therapyPlanData.plan.scoreTarget}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
            <strong>Métrica:</strong> {therapyPlanData.plan.metric}
          </Typography>
        </Box>

        {/* Gráfico de evolução */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700 }}>
              Gráfico de evolução:
            </Typography>
            {/* Legenda */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{
                  width: '20px',
                  height: '3px',
                  backgroundColor: '#0066cc'
                }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                  Evolução
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: '#28a745',
                  borderTop: '2px dashed #28a745'
                }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                  Meta
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{
            width: '100%',
            height: '250px',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            position: 'relative',
            backgroundColor: '#ffffff',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {/* Eixo Y */}
            <Box sx={{
              position: 'absolute',
              left: 20,
              top: 20,
              bottom: 50,
              width: '35px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              py: 1
            }}>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((value) => (
                <Typography key={value} sx={{
                  fontSize: '0.7rem',
                  textAlign: 'right',
                  pr: 0.5,
                  lineHeight: 1,
                  color: '#6c757d',
                  fontWeight: 500
                }}>
                  {value}
                </Typography>
              ))}
            </Box>

            {/* Área do gráfico */}
            <Box sx={{
              position: 'absolute',
              left: 60,
              right: 30,
              top: 25,
              bottom: 50
            }}>
              {/* Linhas horizontais de grade */}
              {[0, 2, 4, 6, 8, 10].map((value) => {
                const yPos = ((10 - value) / 10) * 100;
                return (
                  <Box
                    key={value}
                    sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: `${yPos}%`,
                      height: '1px',
                      backgroundColor: value === 0 ? '#495057' : '#e9ecef'
                    }}
                  />
                );
              })}

              {/* SVG com gradiente e sombra */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                <defs>
                  {/* Gradiente para área sob a linha */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066cc" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0066cc" stopOpacity="0.05" />
                  </linearGradient>

                  {/* Filtro de sombra */}
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/>
                    <feOffset dx="0" dy="0.5" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Área preenchida sob a linha */}
                <polygon
                  points={`
                    0,100
                    ${evolutionData.map((item, index) => {
                      const x = (index / (evolutionData.length - 1)) * 100;
                      const y = ((10 - item.score) / 10) * 100;
                      return `${x},${y}`;
                    }).join(' ')}
                    100,100
                  `}
                  fill="url(#areaGradient)"
                />

                {/* Linha de meta (score 5) */}
                <line
                  x1="0"
                  y1="50"
                  x2="100"
                  y2="50"
                  stroke="#28a745"
                  strokeWidth="0.6"
                  strokeDasharray="3,3"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.8"
                />

                {/* Linha conectando os pontos */}
                <polyline
                  points={evolutionData.map((item, index) => {
                    const x = (index / (evolutionData.length - 1)) * 100;
                    const y = ((10 - item.score) / 10) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#0066cc"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#shadow)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Pontos de dados */}
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
              >
                <defs>
                  <filter id="pointShadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/>
                  </filter>
                </defs>
                {evolutionData.map((item, index) => {
                  const xPercent = (index / (evolutionData.length - 1)) * 100;
                  const yPercent = ((10 - item.score) / 10) * 100;
                  return (
                    <g key={index}>
                      {/* Círculo externo (borda) */}
                      <circle
                        cx={`${xPercent}%`}
                        cy={`${yPercent}%`}
                        r="6"
                        fill="#ffffff"
                        filter="url(#pointShadow)"
                      />
                      {/* Círculo interno */}
                      <circle
                        cx={`${xPercent}%`}
                        cy={`${yPercent}%`}
                        r="4"
                        fill="#0066cc"
                      />
                    </g>
                  );
                })}
              </svg>
            </Box>

            {/* Eixo X */}
            <Box sx={{
              position: 'absolute',
              left: 60,
              right: 30,
              bottom: 20,
              height: '25px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              pt: 1
            }}>
              {evolutionData.map((item, index) => (
                <Typography key={index} sx={{
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  color: '#6c757d',
                  fontWeight: 500
                }}>
                  {item.date}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Tabela de evolução */}
        <Box sx={{ mb: 4 }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#e0e0e0' }}>
                <th style={{
                  padding: '8px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600
                }}>Data</th>
                <th style={{
                  padding: '8px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600
                }}>Evolução</th>
              </tr>
            </thead>
            <tbody>
              {evolutionHistory.map((record, index) => (
                <tr key={record.id}>
                  <td style={{
                    padding: '12px 8px',
                    border: '1px solid #ccc',
                    verticalAlign: 'top',
                    width: '120px'
                  }}>
                    {record.date}
                  </td>
                  <td style={{
                    padding: '12px 8px',
                    border: '1px solid #ccc'
                  }}>
                    <Box>
                      <Typography sx={{ fontSize: typography.fontSize.xs, mb: spacing.sm, color: colors.textPrimary }}>
                        <strong>Profissional:</strong> {record.professional}
                        <span style={{ marginLeft: '2rem' }}><strong>Especialidade:</strong> {record.specialty}</span>
                        {record.docProf && <span style={{ marginLeft: '2rem' }}><strong>Doc. Prof.:</strong> {record.docProf}</span>}
                      </Typography>
                      <Typography sx={{ fontSize: typography.fontSize.xs, mb: spacing.sm, color: colors.textPrimary }}>
                        <strong>Avaliação:</strong> {record.evaluation}
                        <span style={{ marginLeft: '2rem' }}><strong>Score GAS:</strong> {record.scoreGAS}</span>
                      </Typography>
                      <Typography sx={{ fontSize: typography.fontSize.xs, mb: spacing.sm, color: colors.textPrimary }}>
                        <strong>Evolução:</strong> {record.evolution}
                      </Typography>
                      <Typography sx={{ fontSize: typography.fontSize.xs, color: colors.textPrimary }}>
                        <strong>Orientação de conduta:</strong> {record.conductOrientation}
                      </Typography>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Rodapé */}
        <Box sx={{
          mt: spacing.xl,
          pt: spacing.md,
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'center'
        }}>
          <Typography sx={{
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary,
            mb: spacing.xs
          }}>
            {clinicData.address}, {clinicData.addressLine2}
          </Typography>
          <Typography sx={{
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary,
            mb: spacing.xs
          }}>
            Telefone: {clinicData.phone}
          </Typography>
          <Typography sx={{
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary
          }}>
            E-mail: {clinicData.email}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TherapyPlanPrint;
