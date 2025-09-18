# Header Component

Componente de cabeçalho reutilizável para todas as páginas do sistema CLINIC4US.

## Uso

```tsx
import Header from '../components/Header';

// Uso básico (landing page)
<Header
  onContactClick={handleContactClick}
  onTrialClick={handleTrialClick}
  showNavigation={true}
  variant="landing"
/>

// Uso para dashboard/páginas internas
<Header
  showNavigation={false}
  variant="dashboard"
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `onContactClick` | `(e?: React.MouseEvent, subject?: string) => void` | - | Função chamada ao clicar em "Contato" |
| `onTrialClick` | `(e?: React.MouseEvent) => void` | - | Função chamada ao clicar em "Teste Grátis" |
| `showNavigation` | `boolean` | `true` | Se deve mostrar o menu de navegação |
| `variant` | `'landing' \| 'dashboard'` | `'landing'` | Variante visual do header |

## Variantes

### Landing
- Header transparente com blur
- Menu de navegação completo
- Botão "Teste Grátis"

### Dashboard
- Header sólido branco
- Sem menu de navegação (apenas logo)
- Ideal para páginas internas do sistema

## Recursos

- ✅ Responsive (menu mobile automático)
- ✅ Navegação suave por ancoras
- ✅ Logo clicável (volta ao topo)
- ✅ Menu hamburger para mobile
- ✅ Overlay de menu mobile
- ✅ Animações suaves
- ✅ TypeScript
- ✅ Acessibilidade (ARIA labels)

## Estrutura de Arquivos

```
Header/
├── Header.tsx       # Componente principal
├── Header.css       # Estilos
├── index.ts         # Export padrão
└── README.md        # Esta documentação
```