import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Print } from '@mui/icons-material';
import { colors, typography, spacing, buttons, shadows } from '../theme/designSystem';

interface TherapyPlan {
  id: string;
  number: number;
  title: string;
  responsibles: string;
  priority: string;
  startDate: string;
  endDate: string;
  scoreInitial: number;
  scoreLatest: number;
  scoreAverage: number;
  status: string;
  progress: number;
}

interface PeriodReportPrintProps {
  patient: {
    name: string;
    birthDate: string;
    responsible: string;
  };
  period: {
    id: string;
    startDate: string;
    endDate: string;
  };
  plans: TherapyPlan[];
}

const PeriodReportPrint: React.FC<PeriodReportPrintProps> = ({ patient, period, plans }) => {
  // Função para formatar datas de YYYY-MM-DD para DD/MM/YYYY
  const formatDateToBR = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Mock data - TODO: Replace with actual database query
  const clinicData = {
    name: 'INSTITUTO NINHO',
    address: 'Azenedo Marinho Fornagioli, 1170',
    cnpj: 'CNPJ: 44.694.160/0001-79',
    phone: '+55 11 4990707',
    email: 'atendimento@ninhoinstituto.com.br',
    fullAddress: 'R: Monsenhor Nuno de Faria Paiva, 177, Mogilar - Mogi das Cruzes - SP',
    logo: null
  };

  const reportData = {
    emissionDate: new Date().toLocaleDateString('pt-BR'),
    patient: {
      name: patient.name || 'Paciente Teste',
      birthDate: patient.birthDate || '15/08/2023',
      responsible: patient.responsible || 'Pacitente Teste Responsável 1'
    },
    period: {
      id: period.id || 'Período 02',
      startDate: period.startDate || '01/01/2025',
      endDate: period.endDate || '30/06/2025'
    },
    currentStatus: 'Considera o score das últimas evoluções registradas no período',
    plans: plans || []
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        padding: '2rem',
        '@media print': {
          padding: '0',
          backgroundColor: '#fff'
        }
      }}
    >
      {/* Print Button - Hide on print */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: spacing.md,
          '@media print': {
            display: 'none'
          }
        }}
      >
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

      {/* Print Content */}
      <Paper
        sx={{
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
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: spacing.xl,
            pb: spacing.md,
            borderBottom: `2px solid ${colors.backgroundAlt}`
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `2px solid ${colors.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primaryLight
            }}
          >
            <Typography
              sx={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.bold,
                color: colors.primary,
                textAlign: 'center',
                lineHeight: 1.2,
                whiteSpace: 'pre-line'
              }}
            >
              {clinicData.name.split(' ').join('\n')}
            </Typography>
          </Box>

          {/* Clinic Info */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
                color: colors.textPrimary,
                mb: spacing.xs
              }}
            >
              {clinicData.name}
            </Typography>
            <Typography
              sx={{
                fontSize: typography.fontSize.xs,
                color: colors.textSecondary,
                lineHeight: 1.6
              }}
            >
              {clinicData.address}
              <br />
              {clinicData.cnpj}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: spacing.xl }}>
          <Typography
            sx={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.textPrimary,
              mb: spacing.xs
            }}
          >
            Plano Terapêutico - Data de emissão: {reportData.emissionDate}
          </Typography>
        </Box>

        {/* Patient Information */}
        <Box sx={{ mb: spacing.xl }}>
          <Box sx={{ display: 'flex', gap: '2rem', mb: spacing.sm }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Paciente:</strong> {reportData.patient.name}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Data nasc.:</strong> {reportData.patient.birthDate}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary, mb: spacing.md }}>
            <strong>Responsável:</strong> {reportData.patient.responsible}
          </Typography>

          <Box sx={{ display: 'flex', gap: '2rem', mb: spacing.md }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Início:</strong> {reportData.period.startDate}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Final:</strong> {reportData.period.endDate}
            </Typography>
          </Box>

          <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
            <strong>Panorama atual:</strong> {reportData.currentStatus}
          </Typography>
        </Box>

        {/* Radar Chart - Spider Web */}
        <Box
          sx={{
            height: '550px',
            backgroundColor: colors.background,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: '3rem',
            padding: spacing.lg,
            paddingBottom: '50px',
            position: 'relative'
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 400"
            style={{ maxWidth: '500px', maxHeight: '500px' }}
          >
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
                <stop offset="100%" stopColor={colors.primary} stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="radarGradientAverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF9800" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FF9800" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Center point */}
            <g transform="translate(200, 200)">
              {/* Draw concentric circles (scale lines) */}
              {[2, 4, 6, 8, 10].map((scale) => {
                const radius = (scale / 10) * 150;
                return (
                  <circle
                    key={scale}
                    cx="0"
                    cy="0"
                    r={radius}
                    fill="none"
                    stroke="#cccccc"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                );
              })}

              {/* Draw axes for each plan */}
              {reportData.plans.map((plan, index) => {
                const angle = (index * 2 * Math.PI) / reportData.plans.length - Math.PI / 2;
                const x = Math.cos(angle) * 160;
                const y = Math.sin(angle) * 160;
                return (
                  <line
                    key={plan.id}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke="#999999"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                );
              })}

              {/* Draw average score polygon */}
              <polygon
                points={reportData.plans.map((plan, index) => {
                  const angle = (index * 2 * Math.PI) / reportData.plans.length - Math.PI / 2;
                  const radius = (plan.scoreAverage / 10) * 150;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return `${x},${y}`;
                }).join(' ')}
                fill="url(#radarGradientAverage)"
                stroke="#FF9800"
                strokeWidth="2.5"
                strokeDasharray="5,5"
              />

              {/* Draw average score points */}
              {reportData.plans.map((plan, index) => {
                const angle = (index * 2 * Math.PI) / reportData.plans.length - Math.PI / 2;
                const radius = (plan.scoreAverage / 10) * 150;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <circle
                    key={`avg-${plan.id}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#FF9800"
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Draw latest score polygon */}
              <polygon
                points={reportData.plans.map((plan, index) => {
                  const angle = (index * 2 * Math.PI) / reportData.plans.length - Math.PI / 2;
                  const radius = (plan.scoreLatest / 10) * 150;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return `${x},${y}`;
                }).join(' ')}
                fill="url(#radarGradient)"
                stroke={colors.primary}
                strokeWidth="3"
              />

              {/* Draw latest score points */}
              {reportData.plans.map((plan, index) => {
                const angle = (index * 2 * Math.PI) / reportData.plans.length - Math.PI / 2;
                const radius = (plan.scoreLatest / 10) * 150;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <circle
                    key={plan.id}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={colors.primary}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Draw labels */}
              {reportData.plans.map((plan, index) => {
                const angle = (index * 2 * Math.PI) / reportData.plans.length - Math.PI / 2;
                const labelRadius = 180;
                const x = Math.cos(angle) * labelRadius;
                const y = Math.sin(angle) * labelRadius;

                // Adjust text anchor based on position
                let textAnchor: 'start' | 'middle' | 'end' = 'middle';
                if (x > 10) textAnchor = 'start';
                if (x < -10) textAnchor = 'end';

                return (
                  <text
                    key={plan.id}
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    fontSize="11"
                    fill={colors.textPrimary}
                    fontWeight="700"
                    dominantBaseline="middle"
                  >
                    #{plan.number}
                  </text>
                );
              })}

              {/* Scale labels - positioned on multiple axes to avoid overlap */}
              <text x="5" y="-165" textAnchor="start" fontSize="10" fill={colors.textMuted} fontWeight="600">10</text>
              <text x="5" y="-125" textAnchor="start" fontSize="10" fill={colors.textMuted}>8</text>
              <text x="5" y="-85" textAnchor="start" fontSize="10" fill={colors.textMuted}>6</text>
              <text x="5" y="-45" textAnchor="start" fontSize="10" fill={colors.textMuted}>4</text>
              <text x="5" y="-5" textAnchor="start" fontSize="10" fill={colors.textMuted}>2</text>
            </g>
          </svg>

          {/* Legend below chart */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: 'white',
              padding: '6px 16px',
              borderRadius: '4px',
              border: `1px solid ${colors.border}`,
              fontSize: typography.fontSize.xs,
              boxShadow: shadows.sm,
              whiteSpace: 'nowrap'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box
                sx={{
                  width: '18px',
                  height: '3px',
                  backgroundColor: colors.primary,
                  borderRadius: '2px'
                }}
              />
              <Typography sx={{ fontSize: '10px', color: colors.textSecondary, whiteSpace: 'nowrap' }}>
                Último Score
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box
                sx={{
                  width: '18px',
                  height: '0px',
                  borderTop: '2px dashed #FF9800'
                }}
              />
              <Typography sx={{ fontSize: '10px', color: colors.textSecondary, whiteSpace: 'nowrap' }}>
                Score Médio
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '10px', color: colors.textMuted, whiteSpace: 'nowrap' }}>
              (Escala: 0-10)
            </Typography>
          </Box>
        </Box>

        {/* Plans Table */}
        <Box sx={{ mb: spacing.xl }}>
          {/* Legend */}
          <Box sx={{ mb: spacing.sm, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: '9px', color: colors.textSecondary, fontStyle: 'italic' }}>
              * Exec.: Percentual de execução e sessões realizadas/previstas
            </Typography>
          </Box>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: typography.fontSize.xs
            }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.background }}>
                <th style={{
                  padding: '6px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '30px'
                }}>#</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px'
                }}>Título/Responsáveis</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '90px'
                }}>Início/Final</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '55px'
                }}>Score Inic.</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '55px'
                }}>Último Score</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '55px'
                }}>Score Médio</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '70px'
                }}>Status</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '65px'
                }}>Exec.</th>
              </tr>
            </thead>
            <tbody>
              {reportData.plans.map((plan) => (
                <tr key={plan.id}>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    fontSize: '9px'
                  }}>
                    {plan.number}
                  </td>
                  <td style={{
                    padding: '6px 8px',
                    border: '1px solid #ccc'
                  }}>
                    <Typography sx={{ fontSize: '9px', fontWeight: 600, mb: '2px', lineHeight: 1.3 }}>
                      {plan.title}
                    </Typography>
                    <Typography sx={{ fontSize: '8px', color: colors.textSecondary, lineHeight: 1.3 }}>
                      {plan.responsibles}
                    </Typography>
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    fontSize: '9px',
                    lineHeight: 1.4
                  }}>
                    {formatDateToBR(plan.startDate)}
                    <br />
                    {formatDateToBR(plan.endDate)}
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    fontSize: '9px'
                  }}>
                    {plan.scoreInitial}
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    fontSize: '9px'
                  }}>
                    {plan.scoreLatest}
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    fontSize: '9px'
                  }}>
                    {plan.scoreAverage.toFixed(1)}
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    fontSize: '9px'
                  }}>
                    {plan.status}
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    fontSize: '9px',
                    lineHeight: 1.4
                  }}>
                    {plan.progress.toFixed(0)}%
                    <br />
                    <span style={{ fontSize: '8px', color: colors.textSecondary }}>
                      {Math.round((plan.progress / 100) * 10)}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: spacing.xl,
            pt: spacing.md,
            borderTop: `1px solid ${colors.border}`,
            textAlign: 'center'
          }}
        >
          <Typography sx={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
            {clinicData.fullAddress}
          </Typography>
          <Typography sx={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
            Telefone: {clinicData.phone}
          </Typography>
          <Typography sx={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
            E-mail: {clinicData.email}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PeriodReportPrint;
