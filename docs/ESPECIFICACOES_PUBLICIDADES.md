# Especificações de Tamanhos para Publicidades - Achei na Ilha

Este documento descreve as especificações técnicas e dimensões ideais para todos os tipos de publicidades disponíveis no sistema.

---

## 📐 Índice

1. [Banner Principal (Slider Central)](#banner-principal-slider-central)
2. [Banners Laterais Flutuantes](#banners-laterais-flutuantes)
3. [Formato de Arquivos](#formato-de-arquivos)
4. [Boas Práticas](#boas-práticas)

---

## 🎯 Banner Principal (Slider Central)

### Localização
- **Posição**: Entre a barra de busca e a área de filtros/listagem de anúncios
- **Contexto**: Aparece na página de busca (`busca.html`)

### Dimensões Técnicas

| Especificação | Valor |
|--------------|-------|
| **Largura Máxima** | 1280px |
| **Altura Máxima** | 720px |
| **Proporção (Aspect Ratio)** | 1280:420 (aproximadamente 3.05:1) |
| **Largura Real** | 100% do container (adaptável, máximo 1280px) |
| **Altura Real** | Calculada automaticamente pela proporção |
| **Formato** | Horizontal (landscape) |

### Características Visuais

- **Bordas**: Arredondadas (8px)
- **Sombra**: `box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)`
- **Background**: `#f5f5f5` (cinza claro)
- **Object-fit**: `cover` (imagem preenche todo o espaço)

### Dimensões Recomendadas para Imagens

Para obter a melhor qualidade visual, as imagens devem ser criadas com as seguintes dimensões:

- **Largura Ideal**: 1280px
- **Altura Ideal**: 420px
- **Proporção**: 1280:420 ou 3.05:1

**Exemplo de dimensões que funcionam bem:**
- 1280 × 420px (ideal)
- 1920 × 630px (HD, será redimensionado)
- 2560 × 840px (4K, será redimensionado)

### Funcionalidades

- ✅ **Slider Automático**: Troca a cada 5 segundos
- ✅ **Navegação Manual**: Setas laterais (← →) e indicadores (dots)
- ✅ **Pausa no Hover**: Pausa quando o mouse está sobre o banner
- ✅ **Links Externos**: Abre em nova aba (`target="_blank"`)

### Responsividade

- **Desktop**: Largura máxima de 1280px
- **Tablet**: Adapta-se proporcionalmente
- **Mobile**: Adapta-se proporcionalmente, botões de navegação menores (30px)

---

## 📱 Banners Laterais Flutuantes

### Localização
- **Posição**: Laterais esquerda e direita da página
- **Comportamento**: Fixos (sticky), não rolam com a página
- **Visibilidade**: Apenas em telas maiores que 1400px de largura

### Dimensões Técnicas

| Especificação | Valor |
|--------------|-------|
| **Largura Fixa** | 200px |
| **Proporção (Aspect Ratio)** | 9:16 (formato retrato/vertical) |
| **Altura Mínima** | 400px |
| **Posição Horizontal** | 80px das bordas laterais |
| **Posição Vertical** | Centro da tela (50% do viewport) |
| **Z-index** | 100 (sobre outros elementos) |

### Características Visuais

- **Bordas**: Arredondadas (8px)
- **Background**: Branco
- **Object-fit**: `cover` (imagem preenche todo o espaço)
- **Sombra**: Não aplicada (removida para design mais limpo)

### Dimensões Recomendadas para Imagens

Para obter a melhor qualidade visual, as imagens devem ser criadas com as seguintes dimensões:

- **Largura Ideal**: 200px
- **Altura Ideal**: 355px (baseado na proporção 9:16)
- **Proporção**: 9:16 (formato retrato)

**Cálculo da altura:**
- Proporção 9:16 = largura × (16/9)
- 200px × (16/9) = 355.56px ≈ 355px

**Exemplo de dimensões que funcionam bem:**
- 200 × 355px (ideal)
- 400 × 711px (2x, para retina displays)
- 600 × 1067px (3x, para alta resolução)

### Funcionalidades

- ✅ **Slider Automático**: Troca a cada 4-6 segundos (intervalo aleatório)
- **Navegação Manual**: Indicadores (dots) clicáveis
- ✅ **Pausa no Hover**: Pausa quando o mouse está sobre o banner
- ✅ **Links Externos**: Abre em nova aba (`target="_blank"`)
- ✅ **Posição Fixa**: Permanece visível durante o scroll da página

### Responsividade

- **Desktop (>1400px)**: Visível, fixo nas laterais
- **Tablet/Mobile (<1400px)**: Oculto automaticamente

### Posicionamento

```
┌─────────────────────────────────────────────┐
│  [80px] [200px]    Conteúdo    [200px] [80px]│
│         ┌─────┐                ┌─────┐       │
│         │  L  │                │  R  │       │
│         │  E  │                │  I  │       │
│         │  F  │                │  G  │       │
│         │  T  │                │  H  │       │
│         └─────┘                └─────┘       │
└─────────────────────────────────────────────┘
```

---

## 📁 Formato de Arquivos

### Formatos Suportados

- **Imagens**: JPG, PNG, WebP
- **Recomendado**: JPG (para fotos) ou PNG (para gráficos com transparência)
- **WebP**: Suportado, oferece melhor compressão

### Tamanho de Arquivo

Para garantir bom desempenho:

- **Banner Principal**: Máximo 500KB
- **Banners Laterais**: Máximo 200KB
- **Compressão**: Use ferramentas de otimização de imagem antes de fazer upload

### Qualidade de Imagem

- **Resolução**: 72-96 DPI (suficiente para web)
- **Qualidade JPG**: 80-85% (equilíbrio entre qualidade e tamanho)
- **PNG**: Use PNG-8 quando possível (menor que PNG-24)

---

## ✅ Boas Práticas

### Design de Banners

1. **Área Segura**: Mantenha texto importante a pelo menos 20px das bordas
2. **Legibilidade**: Use fontes grandes e contrastantes
3. **Call-to-Action**: Destaque botões ou links claramente
4. **Branding**: Inclua logo e cores da marca quando aplicável

### Banner Principal

- ✅ Use imagens horizontais de alta qualidade
- ✅ Texto deve ser legível mesmo em telas menores
- ✅ Evite colocar informações importantes nas bordas (setas e dots cobrem parte da imagem)
- ✅ Teste em diferentes tamanhos de tela

### Banners Laterais

- ✅ Use formato vertical (retrato)
- ✅ Texto deve ser legível em formato estreito
- ✅ Evite muitos detalhes (espaço limitado)
- ✅ Foque em mensagem clara e direta
- ✅ Teste legibilidade em diferentes resoluções

### Performance

- ✅ Otimize imagens antes do upload
- ✅ Use WebP quando possível
- ✅ Mantenha tamanhos de arquivo baixos
- ✅ Teste velocidade de carregamento

### Acessibilidade

- ✅ Sempre inclua texto alternativo (`alt`) nas imagens
- ✅ Use contraste adequado (WCAG AA mínimo)
- ✅ Evite textos muito pequenos
- ✅ Teste com leitores de tela

---

## 📊 Resumo de Dimensões

### Banner Principal

```
┌─────────────────────────────────────────┐
│                                         │
│        1280 × 420px (ideal)            │
│         Proporção: 3.05:1              │
│                                         │
└─────────────────────────────────────────┘
```

### Banner Lateral

```
┌─────┐
│     │
│     │ 200px
│     │
│     │ × 355px
│     │
│     │ (ideal)
│     │
│     │ Proporção: 9:16
│     │
└─────┘
```

---

## 🔧 Configuração Técnica

### CSS Aplicado

**Banner Principal:**
```css
.main-banner-slider {
    max-width: 1280px;
    aspect-ratio: 1280 / 420;
    max-height: 720px;
}
```

**Banner Lateral:**
```css
.side-ad-container {
    width: 200px;
}

.side-ad-slides {
    aspect-ratio: 9/16;
    min-height: 400px;
}
```

### JavaScript

- **Slider Principal**: Intervalo de 5000ms (5 segundos)
- **Slider Lateral**: Intervalo aleatório entre 4000-6000ms (4-6 segundos)
- **Pausa no Hover**: Ativada para todos os sliders

---

## 📝 Notas Importantes

1. **Responsividade**: O sistema usa `aspect-ratio` CSS para manter proporções automaticamente
2. **Object-fit**: Todas as imagens usam `cover`, então imagens maiores serão cortadas para preencher o espaço
3. **Links Externos**: Todos os links abrem em nova aba com `target="_blank" rel="noopener noreferrer"`
4. **Visibilidade**: Banners laterais são ocultos automaticamente em telas menores que 1400px
5. **Performance**: Imagens são carregadas sob demanda e otimizadas pelo navegador

---

## 📞 Suporte

Para dúvidas sobre especificações ou problemas técnicos, consulte a documentação do sistema ou entre em contato com a equipe de desenvolvimento.

---

**Última atualização**: Janeiro 2025  
**Versão do documento**: 1.0

