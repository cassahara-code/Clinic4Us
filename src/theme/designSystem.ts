/**
 * CLINIC4US - DESIGN SYSTEM
 *
 * Este arquivo define os padrões de design do sistema para garantir
 * consistência visual em todas as páginas e componentes.
 *
 * Baseado na análise do Dashboard.tsx e componentes existentes.
 */

// ============================================================================
// CORES DO SISTEMA
// ============================================================================

export const colors = {
  // Cores primárias
  primary: '#03B4C6',
  primaryHover: '#029AAB',
  primaryLight: '#f0f9fa',

  // Cores de status
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#2196f3',

  // Cores de ação adicional
  add: '#48bb78',
  addHover: '#38a169',

  // Cores de ação
  whatsapp: '#25D366',
  whatsappHover: '#1da851',
  email: '#ff9800',
  emailHover: '#f57c00',
  folder: '#03a9f4',
  folderHover: '#0288d1',

  // Cores de fundo
  background: '#f8f9fa',
  backgroundAlt: '#e9ecef',
  white: '#ffffff',

  // Cores de texto
  text: '#495057', // Alias para textPrimary
  textPrimary: '#495057',
  textSecondary: '#6c757d',
  textMuted: '#868e96',

  // Cores de borda
  border: '#ced4da',
  borderHover: '#adb5bd',

  // Cores dos cards dashboard
  cardBlue: '#4263eb',
  cardGreen: '#28a745',
  cardOrange: '#fd7e14',
  cardPink: '#e91e63',
} as const;

// ============================================================================
// TIPOGRAFIA
// ============================================================================

export const typography = {
  // Tamanhos de fonte
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px - Títulos de cards do dashboard
    xl: '1.25rem',      // 20px - Títulos de blocos principais
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
  },

  // Pesos de fonte
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Altura de linha
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ============================================================================
// ESPAÇAMENTO
// ============================================================================

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// ============================================================================
// BOTÕES
// ============================================================================

export const buttons = {
  // Botão primário (principal)
  primary: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: '0.5rem 1rem',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'none' as const,
    borderRadius: '8px',
    boxShadow: 'none',
    height: '36px',
    hover: {
      backgroundColor: colors.primaryHover,
      boxShadow: 'none',
    },
  },

  // Botão secundário
  secondary: {
    backgroundColor: colors.textSecondary,
    color: colors.white,
    padding: '0.5rem 1rem',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'none' as const,
    borderRadius: '8px',
    boxShadow: 'none',
    height: '36px',
    hover: {
      backgroundColor: '#5a6268',
      boxShadow: 'none',
    },
  },

  // Botão de ícone
  icon: {
    width: '40px',
    height: '40px',
    padding: '0.5rem',
  },

  // Botão adicionar (+) - Verde
  add: {
    backgroundColor: colors.add,
    color: colors.white,
    width: '40px',
    height: '40px',
    borderRadius: '6px',
    hover: {
      backgroundColor: colors.addHover,
    },
  },

  // Botão pequeno (small)
  small: {
    padding: '0.375rem 0.75rem',
    fontSize: typography.fontSize.xs,
    height: '32px',
  },

  // Botão grande (large)
  large: {
    padding: '0.75rem 1.5rem',
    fontSize: typography.fontSize.base,
    height: '48px',
  },
} as const;

// ============================================================================
// CAMPOS DE ENTRADA (INPUTS)
// ============================================================================

export const inputs = {
  // TextField padrão (Material-UI)
  default: {
    height: '40px',
    fontSize: typography.fontSize.base,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: '4px',
    padding: '0.375rem 0.5rem',
    textColor: colors.textPrimary,
    placeholderColor: colors.textSecondary,

    // Label sempre visível
    labelShrink: true,
    labelFontSize: '0.95rem',
    labelColor: colors.textSecondary,
    labelBackground: colors.white,
    labelPadding: '0 4px',

    // Estados
    hover: {
      borderColor: colors.border,
    },
    focus: {
      borderColor: colors.primary,
      boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
      labelColor: colors.primary,
    },
    error: {
      borderColor: colors.error,
      boxShadow: '0 0 0 3px rgba(220, 53, 69, 0.1)',
    },

    // Fieldset legend (para label funcionar corretamente)
    legendMaxWidth: '100%',
  },

  // Select padrão (Material-UI TextField com select)
  select: {
    minWidth: '120px',
    height: '40px',
    fontSize: typography.fontSize.base,
    backgroundColor: colors.white,
    borderColor: colors.border,
    padding: '0.375rem 0.5rem',
    textColor: colors.textPrimary,

    // Label sempre visível (mesmo padrão do TextField)
    labelShrink: true,
    labelFontSize: '0.95rem',
    labelColor: colors.textSecondary,
    labelBackground: colors.white,
    labelPadding: '0 4px',
  },

  // Textarea
  textarea: {
    fontSize: typography.fontSize.base,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: '4px',
    padding: '0.5rem',
    minHeight: '100px',

    // Label sempre visível
    labelShrink: true,
    labelFontSize: '0.95rem',
    labelColor: colors.textSecondary,
    labelBackground: colors.white,
    labelPadding: '0 4px',
  },

  // Multiline (TextField com multiline)
  multiline: {
    fontSize: typography.fontSize.base,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: '4px',
    minHeight: '80px',

    // Propriedades específicas para evitar quebra e expansão transparente
    alignItems: 'flex-start',
    wordWrap: 'break-word' as const,
    whiteSpace: 'pre-wrap' as const,

    // Prevenir overlay/expansão
    position: 'relative' as const,
    opacity: 1,

    // Controle de altura fixa com scroll interno
    maxHeight: '120px',
    overflow: 'hidden' as const,

    // Propriedades do textarea interno
    textareaHeight: '100%' as const,
    textareaMaxHeight: '100%' as const,
    textareaOverflow: 'auto' as const,
    textareaBoxSizing: 'border-box' as const,

    // Scrollbar customizada
    scrollbarWidth: '8px',
    scrollbarTrackColor: colors.background,
    scrollbarThumbColor: colors.border,
    scrollbarThumbHoverColor: colors.borderHover,

    // Label sempre visível
    labelShrink: true,
    labelFontSize: '0.95rem',
    labelColor: colors.textSecondary,
    labelBackground: colors.white,
    labelPadding: '0 4px',

    // Padding interno
    inputPadding: '8.5px 14px',
  },
} as const;

// ============================================================================
// CARDS
// ============================================================================

export const cards = {
  // Card padrão
  default: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: spacing.lg,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${colors.backgroundAlt}`,

    // Altura dos cards do dashboard
    dashboardHeight: '350px',
    minHeight: '350px',
    maxHeight: '350px',
  },

  // Ícone do card
  icon: {
    width: '48px',
    height: '48px',
    minWidth: '48px',
    minHeight: '48px',
    borderRadius: '50%',
    iconSize: '20px',
    marginRight: spacing.md,
  },

  // Título do card
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
} as const;

// ============================================================================
// TABELAS
// ============================================================================

export const tables = {
  // Container da tabela
  container: {
    backgroundColor: colors.white,
    borderRadius: '8px',
    boxShadow: 'none',
    border: 'none',
  },

  // Layout da tabela
  layout: {
    tableLayout: 'fixed' as const,
  },

  // Cabeçalho da tabela
  header: {
    backgroundColor: colors.background,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },

  // Células da tabela
  cell: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.backgroundAlt}`,
  },

  // Larguras de coluna padrão
  columnWidths: {
    date: '120px',        // Para datas (dd/mm/yyyy)
    age: '80px',          // Para idade/números pequenos
    actions: '180px',     // Para 3 botões de ação
    checkbox: '50px',     // Para checkboxes
    auto: 'auto',         // Para nome/texto longo
  },
} as const;

// ============================================================================
// PAGINAÇÃO
// ============================================================================

export const pagination = {
  // Container de paginação
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: '8px',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    border: 'none',
    boxShadow: 'none',
  },

  // Componente Pagination do MUI
  component: {
    size: 'small' as const,
    showFirstButton: true,
    showLastButton: true,
    itemColor: colors.textPrimary,
    selectedBackgroundColor: colors.primary,
    selectedColor: colors.white,
    selectedHoverColor: colors.primaryHover,
  },

  // Select de itens por página
  itemsPerPage: {
    options: [5, 10, 15, 20, 25, 50],
    default: 10,
  },
} as const;

// ============================================================================
// ÍCONES DE AÇÃO
// ============================================================================

export const actionIcons = {
  // WhatsApp
  whatsapp: {
    backgroundColor: colors.whatsapp,
    color: colors.white,
    hoverBackgroundColor: colors.whatsappHover,
    size: 'small' as const,
  },

  // Email
  email: {
    backgroundColor: colors.email,
    color: colors.white,
    hoverBackgroundColor: colors.emailHover,
    size: 'small' as const,
  },

  // Pasta/Gerenciar
  folder: {
    backgroundColor: colors.folder,
    color: colors.white,
    hoverBackgroundColor: colors.folderHover,
    size: 'small' as const,
  },

  // Editar
  edit: {
    backgroundColor: colors.info,
    color: colors.white,
    hoverBackgroundColor: '#1976d2',
    size: 'small' as const,
  },

  // Deletar
  delete: {
    backgroundColor: colors.error,
    color: colors.white,
    hoverBackgroundColor: '#c82333',
    size: 'small' as const,
  },
} as const;

// ============================================================================
// FORMULÁRIOS
// ============================================================================

export const forms = {
  // Espaçamento entre campos
  fieldSpacing: spacing.md,

  // Labels
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: '0.5rem',
  },

  // Helper text
  helperText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: '0.25rem',
  },

  // Error text
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: '0.25rem',
  },
} as const;

// ============================================================================
// MODAIS
// ============================================================================

export const modals = {
  // Container do modal
  container: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: spacing.xl,
    maxWidth: '600px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },

  // Título do modal
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Backdrop
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

// ============================================================================
// FILTROS
// ============================================================================

export const filters = {
  // Container de filtros
  container: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: '8px',
    marginBottom: spacing.md,
    display: 'flex',
    gap: spacing.md,
    flexWrap: 'wrap' as const,
    alignItems: 'flex-end',
  },

  // Botão de limpar filtros
  clearButton: {
    backgroundColor: colors.textSecondary,
    color: colors.white,
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    hoverBackgroundColor: '#5a6268',
    disabledBackgroundColor: colors.backgroundAlt,
    disabledColor: colors.borderHover,
    disabledOpacity: 0.6,
  },
} as const;

// ============================================================================
// CABEÇALHO DE PÁGINA
// ============================================================================

export const pageHeader = {
  // Título da página
  title: {
    fontSize: '1.3rem',
    marginBottom: spacing.sm, // 8px de espaçamento após título
  },

  // Descrição da página
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
} as const;

// ============================================================================
// BREAKPOINTS (RESPONSIVIDADE)
// ============================================================================

export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
} as const;

// ============================================================================
// ANIMAÇÕES E TRANSIÇÕES
// ============================================================================

export const transitions = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',

  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

// ============================================================================
// SOMBRAS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 2px 12px rgba(0, 0, 0, 0.08)',
  md: '0 4px 16px rgba(0, 0, 0, 0.12)',
  lg: '0 10px 40px rgba(0, 0, 0, 0.15)',
  xl: '0 20px 60px rgba(0, 0, 0, 0.2)',

  // Sombra de foco
  focus: '0 0 0 3px rgba(3, 180, 198, 0.1)',
  focusError: '0 0 0 3px rgba(220, 53, 69, 0.1)',
} as const;

// ============================================================================
// EXPORTAÇÃO CONSOLIDADA
// ============================================================================

export const designSystem = {
  colors,
  typography,
  spacing,
  buttons,
  inputs,
  cards,
  tables,
  pagination,
  actionIcons,
  forms,
  modals,
  filters,
  pageHeader,
  breakpoints,
  transitions,
  shadows,
} as const;

export default designSystem;
