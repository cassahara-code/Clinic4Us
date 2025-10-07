# TextField Styles - Guia de Uso

Este arquivo documenta o padrão de estilos para campos TextField do Material-UI no sistema Clinic4Us.

## Problema Resolvido

Anteriormente, cada modal tinha sua própria implementação de estilos para campos multiline, resultando em:
- Código duplicado
- Inconsistências visuais
- Dificuldade de manutenção
- Comportamentos diferentes entre campos similares

## Solução

Criamos funções reutilizáveis em `src/theme/textFieldStyles.ts` que fornecem estilos padronizados baseados no Design System.

## Funções Disponíveis

### 1. `getDefaultTextFieldSx()`

Para campos TextField simples (não multiline).

**Exemplo de uso:**
```tsx
import { getDefaultTextFieldSx, getDefaultInputLabelProps } from '../../theme/textFieldStyles';

<TextField
  label="Nome"
  fullWidth
  value={formData.name}
  onChange={handleInputChange}
  InputLabelProps={getDefaultInputLabelProps()}
  sx={getDefaultTextFieldSx()}
/>
```

### 2. `getMultilineTextFieldSx()`

Para campos TextField multiline (textarea).

**Exemplo de uso:**
```tsx
import { getMultilineTextFieldSx, getMultilineInputLabelProps } from '../../theme/textFieldStyles';

<TextField
  fullWidth
  multiline
  rows={3}
  label="Descrição"
  value={formData.description}
  onChange={handleInputChange}
  InputLabelProps={getMultilineInputLabelProps()}
  sx={getMultilineTextFieldSx()}
/>
```

### 3. `getMultilineWithAdornmentSx()`

Para campos TextField multiline com ícones (InputAdornment).

**Exemplo de uso:**
```tsx
import { getMultilineWithAdornmentSx, getMultilineInputLabelProps } from '../../theme/textFieldStyles';

<TextField
  fullWidth
  multiline
  rows={8}
  label="Evolução Terapêutica"
  value={formData.evolution}
  onChange={handleInputChange}
  InputLabelProps={getMultilineInputLabelProps()}
  sx={getMultilineWithAdornmentSx()}
  InputProps={{
    endAdornment: (
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton size="small">
          <Mic />
        </IconButton>
      </Box>
    )
  }}
/>
```

### 4. `getDefaultInputLabelProps()`

Props padrão para labels de campos simples.

### 5. `getMultilineInputLabelProps()`

Props padrão para labels de campos multiline.

## Características dos Estilos

### Campos Simples
- Altura fixa: 40px
- Fonte: 1rem (16px)
- Label: 0.95rem com shrink automático
- Bordas e cores conforme Design System

### Campos Multiline
- Altura mínima e máxima configuradas
- Scroll customizado com scrollbar estilizada
- Word wrap e white space adequados
- Padding interno correto
- Label posicionada corretamente

## Migrando Código Existente

### Antes:
```tsx
<TextField
  multiline
  rows={3}
  InputLabelProps={{ shrink: true }}
  sx={{
    '& .MuiOutlinedInput-root': {
      position: inputs.multiline.position,
      alignItems: inputs.multiline.alignItems,
      // ... muitas linhas de código ...
    }
  }}
/>
```

### Depois:
```tsx
import { getMultilineTextFieldSx, getMultilineInputLabelProps } from '../../theme/textFieldStyles';

<TextField
  multiline
  rows={3}
  InputLabelProps={getMultilineInputLabelProps()}
  sx={getMultilineTextFieldSx()}
/>
```

## Benefícios

1. **Consistência**: Todos os campos multiline se comportam da mesma forma
2. **Manutenção**: Alterações feitas em um só lugar
3. **Legibilidade**: Código mais limpo e fácil de entender
4. **Performance**: Estilos otimizados e testados
5. **Design System**: Integração completa com o design system

## Quando NÃO Usar

Se você precisa de um comportamento muito específico que difere do padrão, você pode:
1. Usar as funções base e adicionar estilos customizados
2. Criar sua própria implementação (use com moderação)

**Exemplo de customização:**
```tsx
<TextField
  multiline
  rows={3}
  InputLabelProps={getMultilineInputLabelProps()}
  sx={{
    ...getMultilineTextFieldSx(),
    // Customizações adicionais
    '& .MuiOutlinedInput-root': {
      ...getMultilineTextFieldSx()['& .MuiOutlinedInput-root'],
      backgroundColor: '#f0f0f0'
    }
  }}
/>
```

## Referência

- Design System: `src/theme/designSystem.ts`
- Estilos TextField: `src/theme/textFieldStyles.ts`
- Exemplo completo: `src/components/modals/PlanModal.tsx` (campo Descrição)
- Exemplo com adornment: `src/components/modals/EvolutionModal.tsx` (campos de evolução)
