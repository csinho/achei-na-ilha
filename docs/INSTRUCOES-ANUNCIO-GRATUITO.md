# Instruções: Sistema de Anúncios Gratuitos

## Visão Geral

O sistema agora permite que cada usuário publique **1 anúncio gratuito por mês**. Após isso, todos os anúncios precisam ser pagos. Anúncios gratuitos não podem ter destaque.

## Configuração do Banco de Dados

### 1. Executar SQL

Execute o seguinte script SQL no Supabase:

```sql
-- Arquivo: sql/add-anuncio-gratuito.sql
```

Este script adiciona o campo `anuncio_gratuito` (BOOLEAN) na tabela `anuncios`.

## Funcionalidades Implementadas

### 1. Verificação de Anúncio Gratuito

- **Função**: `verificarAnuncioGratuitoDisponivel()`
- **Localização**: `pages/property/novo-anuncio.html`
- **Funcionamento**:
  - Verifica quantos anúncios gratuitos o usuário já criou no mês atual
  - Retorna `true` se o usuário ainda tem direito (0 anúncios gratuitos no mês)
  - Retorna `false` se já utilizou o anúncio gratuito do mês

### 2. Publicação Gratuita

- **Função**: `publicarAnuncioGratuito()`
- **Localização**: `pages/property/novo-anuncio.html`
- **Funcionamento**:
  - Verifica se o usuário tem direito
  - Cria anúncio com:
    - `anuncio_gratuito: true`
    - `em_destaque: false` (anúncios gratuitos não podem ter destaque)
    - `status: 'publicado'`
    - `ativo: true`
    - `data_fim_publicacao: agora + 30 dias`
    - `valor_pagamento: 0.00`
    - `forma_pagamento: 'gratuito'`

### 3. Interface do Usuário

#### `novo-anuncio.html`
- **Banner Informativo**: Exibido quando o usuário tem direito a anúncio gratuito
- **Botão "🎁 Publicar Gratuitamente"**: Aparece quando há direito disponível
- **Mensagem**: "Você tem direito a **1 anúncio gratuito por mês**. Este anúncio será publicado imediatamente, sem necessidade de pagamento. Anúncios gratuitos não podem ter destaque."

#### `index.html`
- **Card de Destaque**: Adicionado na seção "Por que escolher o Achei na Ilha?"
- **Mensagem**: "**1 Anúncio Gratuito por Mês** - Todo usuário tem direito a 1 anúncio gratuito por mês. Publique seu imóvel sem custos!"

### 4. Anúncios em Destaque

#### Ordenação
- Anúncios em destaque aparecem **sempre no topo** da listagem
- Dentro dos anúncios em destaque, ordenados por data de criação (mais recente primeiro)
- Anúncios sem destaque aparecem depois, também ordenados por data

#### Visual
- **Borda dourada**: `border: 3px solid #FFD700`
- **Efeito pulsante**: Animação `pulse-gold` que faz o card "pulsar" suavemente
- **Badge "⭐ DESTAQUE"**: Aparece no canto superior direito do card
- **Sombra dourada**: Efeito de brilho ao redor do card

#### CSS
```css
.listing-card-destaque {
    border: 3px solid #FFD700 !important;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    animation: pulse-gold 2s ease-in-out infinite;
    position: relative;
}

@keyframes pulse-gold {
    0%, 100% {
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15);
        border-color: #FFD700;
    }
    50% {
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 6px 16px rgba(0, 0, 0, 0.2);
        border-color: #FFA500;
    }
}

.listing-card-destaque::before {
    content: '⭐ DESTAQUE';
    position: absolute;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    font-size: 10px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 4px;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
}
```

## Regras de Negócio

1. **1 anúncio gratuito por mês por usuário**
   - Contagem baseada no mês calendário (1º ao último dia do mês)
   - Reset automático no início de cada mês

2. **Anúncios gratuitos não podem ter destaque**
   - Campo `em_destaque` sempre `false` para anúncios gratuitos
   - Validação no código garante isso

3. **Anúncios gratuitos têm 30 dias de publicação**
   - `data_fim_publicacao: agora + 30 dias`
   - Após 30 dias, o anúncio expira normalmente

4. **Anúncios pagos sempre têm `anuncio_gratuito: false`**
   - Garantido no fluxo de pagamento

## Arquivos Modificados

### Backend (SQL)
- `sql/add-anuncio-gratuito.sql`: Adiciona campo `anuncio_gratuito`

### Frontend
- `pages/property/novo-anuncio.html`:
  - Função `verificarAnuncioGratuitoDisponivel()`
  - Função `atualizarInfoAnuncioGratuito()`
  - Função `publicarAnuncioGratuito()`
  - Banner informativo e botão de publicação gratuita
  - Chamada a `atualizarInfoAnuncioGratuito()` no `load`

- `pages/property/busca.html`:
  - Ordenação de anúncios (destaque primeiro)
  - CSS para anúncios em destaque (borda dourada e pulsação)
  - Badge "⭐ DESTAQUE" nos cards
  - Inclusão de `em_destaque` no mapeamento

- `pages/payment/pagamento.html`:
  - Campo `anuncio_gratuito: false` em anúncios pagos

- `index.html`:
  - Card informativo sobre anúncio gratuito na seção de features

## Fluxo de Uso

### Para Usuário com Direito a Anúncio Gratuito

1. Acessa `novo-anuncio.html`
2. Preenche o formulário
3. Vê o banner informativo e o botão "🎁 Publicar Gratuitamente"
4. Clica em "🎁 Publicar Gratuitamente"
5. Anúncio é publicado imediatamente (30 dias)
6. Redirecionado para `meus-anuncios.html`

### Para Usuário sem Direito a Anúncio Gratuito

1. Acessa `novo-anuncio.html`
2. Preenche o formulário
3. Não vê o banner nem o botão gratuito
4. Clica em "🚀 Publicar Anúncio"
5. Redirecionado para `pagamento.html`
6. Realiza pagamento
7. Anúncio é publicado após confirmação do pagamento

## Testes Recomendados

1. ✅ Criar 1 anúncio gratuito no mês atual
2. ✅ Tentar criar 2º anúncio gratuito no mesmo mês (deve falhar)
3. ✅ Verificar que anúncio gratuito não pode ter destaque
4. ✅ Verificar ordenação (destaque primeiro)
5. ✅ Verificar visual dos cards em destaque (borda dourada e pulsação)
6. ✅ Verificar reset no início do novo mês

