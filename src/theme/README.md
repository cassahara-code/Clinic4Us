# 🎨 Clinic4Us - Design System

Este diretório contém o sistema de design da aplicação Clinic4Us, estabelecendo padrões visuais e funcionais para todos os componentes.

## 📁 Estrutura

- `designSystem.ts` - Arquivo principal com todas as definições de padrões

## 🎯 Objetivo

Garantir consistência visual e funcional em todas as páginas, facilitando:
- Desenvolvimento mais rápido
- Manutenção simplificada
- Experiência do usuário uniforme
- Acessibilidade padronizada

## 📖 Como Usar

### 1. Importar o Design System

```typescript
import { designSystem } from '@/theme/designSystem';
// ou importações específicas:
import { colors, buttons, inputs } from '@/theme/designSystem';
```

### 2. Exemplos de Uso

#### 🎨 Cores

```typescript
// Usar cores do sistema
sx={{
  backgroundColor: colors.primary,
  color: colors.white,
  '&:hover': {
    backgroundColor: colors.primaryHover,
  },
}}
```

#### 🔘 Botões

```typescript
// Botão primário padrão
<Button
  variant="contained"
  sx={{
    backgroundColor: buttons.primary.backgroundColor,
    color: buttons.primary.color,
    padding: buttons.primary.padding,
    fontSize: buttons.primary.fontSize,
    fontWeight: buttons.primary.fontWeight,
    textTransform: buttons.primary.textTransform,
    borderRadius: buttons.primary.borderRadius,
    boxShadow: buttons.primary.boxShadow,
    height: buttons.primary.height,
    '&:hover': {
      backgroundColor: buttons.primary.hover.backgroundColor,
      boxShadow: buttons.primary.hover.boxShadow,
    },
  }}
>
  Botão Primário
</Button>

// Botão secundário
<Button
  variant="contained"
  sx={{
    backgroundColor: buttons.secondary.backgroundColor,
    // ... usar buttons.secondary
  }}
>
  Botão Secundário
</Button>
```

#### 📝 Campos de Entrada

```typescript
// TextField padrão
<TextField
  variant="outlined"
  fullWidth
  sx={{
    '& .MuiOutlinedInput-root': {
      height: inputs.default.height,
      fontSize: inputs.default.fontSize,
      backgroundColor: inputs.default.backgroundColor,
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
    '& .MuiOutlinedInput-input': {
      padding: inputs.default.padding,
      color: inputs.default.textColor,
    },
  }}
/>
```

#### 📊 Tabelas

```typescript
// Table com larguras fixas
<Table sx={{ tableLayout: tables.layout.tableLayout }}>
  <colgroup>
    <col style={{ width: tables.columnWidths.date }} />
    <col style={{ width: tables.columnWidths.age }} />
    <col style={{ width: tables.columnWidths.auto }} />
    <col style={{ width: tables.columnWidths.actions }} />
  </colgroup>
  {/* ... */}
</Table>
```

#### 🎴 Cards

```typescript
// Card padrão do dashboard
<Paper
  elevation={0}
  sx={{
    backgroundColor: cards.default.backgroundColor,
    borderRadius: cards.default.borderRadius,
    padding: cards.default.padding,
    boxShadow: cards.default.boxShadow,
    border: cards.default.border,
    height: cards.default.dashboardHeight,
  }}
>
  {/* conteúdo */}
</Paper>
```

#### 🔍 Paginação

```typescript
// Pagination padrão
<Pagination
  count={totalPages}
  page={currentPage}
  onChange={handlePageChange}
  size={pagination.component.size}
  showFirstButton={pagination.component.showFirstButton}
  showLastButton={pagination.component.showLastButton}
  sx={{
    '& .MuiPaginationItem-root': {
      color: pagination.component.itemColor,
      '&.Mui-selected': {
        backgroundColor: pagination.component.selectedBackgroundColor,
        color: pagination.component.selectedColor,
        '&:hover': {
          backgroundColor: pagination.component.selectedHoverColor,
        },
      },
    },
  }}
/>
```

#### 🎯 Ícones de Ação

```typescript
// Botão WhatsApp
<IconButton
  size={actionIcons.whatsapp.size}
  sx={{
    bgcolor: actionIcons.whatsapp.backgroundColor,
    color: actionIcons.whatsapp.color,
    '&:hover': {
      bgcolor: actionIcons.whatsapp.hoverBackgroundColor,
    },
  }}
>
  <WhatsApp fontSize="small" />
</IconButton>

// Botão Email
<IconButton
  size={actionIcons.email.size}
  sx={{
    bgcolor: actionIcons.email.backgroundColor,
    color: actionIcons.email.color,
    '&:hover': {
      bgcolor: actionIcons.email.hoverBackgroundColor,
    },
  }}
>
  <Email fontSize="small" />
</IconButton>
```

## 📏 Padrões Definidos

### Cores
- **Primárias**: Primary (#03B4C6), Primary Hover (#029AAB)
- **Status**: Success, Warning, Error, Info
- **Ação**: WhatsApp, Email, Folder
- **Texto**: Primary, Secondary, Muted
- **Bordas**: Border, Border Hover

### Tipografia
- **Tamanhos**: xs (12px) até 3xl (30px)
- **Pesos**: Normal (400), Medium (500), Semibold (600), Bold (700)
- **Altura de linha**: Tight, Normal, Relaxed

### Botões
- **Primário**: Altura 36px, padding 0.5rem 1rem
- **Secundário**: Mesmas dimensões, cores diferentes
- **Ícone**: 40x40px
- **Small**: 32px altura
- **Large**: 48px altura

### Campos de Entrada
- **Altura padrão**: 40px
- **Padding**: 0.375rem 0.5rem
- **Border radius**: 4px
- **Estados**: Hover, Focus, Error

### Tabelas
- **Layout**: Fixed
- **Larguras de coluna**: Date (120px), Age (80px), Actions (180px)
- **Border**: 1px solid backgroundAlt

### Paginação
- **Itens por página**: [5, 10, 15, 20, 25, 50]
- **Default**: 10 itens
- **Componente**: Small size, com botões First/Last

### Cards
- **Altura dashboard**: 350px fixo
- **Border radius**: 12px
- **Padding**: 1.5rem
- **Shadow**: 0 2px 12px rgba(0, 0, 0, 0.08)
- **Ícone**: 48x48px circular

## 🚀 Próximos Passos

1. **Criar componentes reutilizáveis** baseados no Design System:
   - `<PrimaryButton>`, `<SecondaryButton>`
   - `<StandardTextField>`, `<StandardSelect>`
   - `<DataTable>` com paginação integrada
   - `<ActionIconButton>` com variantes (whatsapp, email, etc)
   - `<DashboardCard>` padronizado
   - `<StandardPagination>`

2. **Migrar páginas existentes** para usar o Design System

3. **Documentar variações** conforme necessário

## 📝 Notas Importantes

- **Sempre use os valores do Design System** ao invés de hardcoded values
- **Consulte este arquivo** antes de criar novos componentes
- **Atualize o Design System** quando novos padrões forem estabelecidos
- **Mantenha consistência** em todas as páginas

## 🔄 Versionamento

- **v1.0.0** - Versão inicial baseada no Dashboard.tsx (03/10/2025)

---

Desenvolvido para o projeto Clinic4Us 🏥
