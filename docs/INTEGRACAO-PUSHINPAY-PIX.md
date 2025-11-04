# Integração com PushinPay PIX - Sistema de Pagamento

## 📋 Visão Geral

Este documento descreve a integração do sistema de pagamento de anúncios com o **PushinPay PIX**, permitindo que usuários paguem via PIX com QR Code exibido diretamente na tela.

## 🔄 Fluxo de Pagamento

### 1. Usuário Escolhe Dias e Gera PIX
- Usuário seleciona quantidade de dias (mínimo 3 dias)
- Opcionalmente marca "em destaque" (+ R$ 8,90)
- Sistema calcula valor total dinamicamente
- Usuário clica em "Gerar PIX"

### 2. Sistema Cria Anúncio (se necessário)
- Se o anúncio ainda não existe no banco, é criado com status `pendente_pagamento`
- O anúncio fica com `ativo: false` até o pagamento ser confirmado

### 3. Sistema Cria PIX no PushinPay
- Faz requisição POST para API do PushinPay para criar QR Code PIX
- Envia dados:
  - **value**: Valor em centavos
  - **description**: Descrição do pagamento
  - **metadata**: Dados customizados incluindo **anuncio_id**

### 4. Exibição do QR Code na Tela
- Sistema recebe código PIX da API
- Gera QR Code visual usando biblioteca QRCode.js
- Exibe na tela:
  - QR Code para escanear
  - Código PIX "Copia e Cola"
  - Valor do pagamento
  - Status do pagamento

### 5. Verificação Automática de Pagamento
- Sistema verifica status do PIX a cada 3 segundos
- Polling automático até confirmação ou timeout (15 minutos)

### 6. Pagamento Confirmado
- Quando pagamento é detectado:
  - Para verificação automática
  - Atualiza status visual para "✅ Pagamento confirmado!"
  - Dispara webhook para n8n com todos os dados
  - Redireciona usuário para "Meus Anúncios"

### 7. Webhook para n8n
- Sistema envia POST para: `https://hooks.upcaodigital.com.br/webhook/acheinailha`
- Webhook contém todos os dados da transação incluindo `metadata.anuncio_id`

## 📦 Estrutura de Dados

### Dados Enviados para Criar PIX

```json
{
  "value": 9990,  // Valor em centavos (R$ 99,90)
  "description": "Anúncio - 10 dias",
  "metadata": {
    "anuncio_id": "uuid-do-anuncio",
    "dias_publicacao": 10,
    "valor_total": 99.90,
    "valor_base": 99.00,
    "valor_destaque": 0.90,
    "em_destaque": false,
    "forma_pagamento": "pix",
    "user_id": "uuid-do-usuario",
    "tipo": "anuncio"
  }
}
```

### Resposta Esperada da API PushinPay

```json
{
  "id": "pix-id-da-transacao",
  "qr_code": "00020126580014BR.GOV.BCB.PIX...",
  "status": "pending",
  "value": 9990,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Estrutura do Webhook Enviado para n8n

```json
{
  "event": "payment.paid",
  "tipo": "pix",
  "data": {
    "id": "pix-id-da-transacao",
    "anuncio_id": "uuid-do-anuncio",
    "amount": 99.90,
    "status": "paid",
    "payment_method": "pix",
    "metadata": {
      "anuncio_id": "uuid-do-anuncio",
      "dias_publicacao": 10,
      "valor_total": 99.90,
      "valor_base": 99.00,
      "valor_destaque": 0.90,
      "em_destaque": false,
      "forma_pagamento": "pix",
      "user_id": "uuid-do-usuario",
      "tipo": "anuncio"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## 🔧 Configuração

### Variáveis de Configuração

```javascript
const PUSHINPAY_API_KEY = 'a04770e3-1bbf-4913-bf47-3fc05a440873|1tPtzIVtY6njf5LIgJ2GDK8zME2pQ8DNwZAe6reA91526390';
const PUSHINPAY_API_URL = 'https://api.pushinpay.com.br'; // ⚠️ Verificar URL exata na documentação
const N8N_WEBHOOK_URL = 'https://hooks.upcaodigital.com.br/webhook/acheinailha';
```

### Endpoints da API

**Criar PIX:**
- `POST /pix/qrcode` (ou endpoint equivalente conforme documentação)
- Headers: `Authorization: Bearer {API_KEY}`

**Consultar PIX:**
- `GET /pix/{pix_id}` (ou endpoint equivalente)
- Headers: `Authorization: Bearer {API_KEY}`

⚠️ **IMPORTANTE**: Verificar documentação oficial do PushinPay para confirmar:
- URL base da API
- Nomes exatos dos endpoints
- Estrutura da requisição/resposta
- Nomes dos campos (pode ser `qr_code`, `qrcode`, `pix_code`, etc.)

## 🎨 Interface do Usuário

### Elementos da Interface

1. **Seção de Cálculo** (sempre visível):
   - Input de dias
   - Checkbox de destaque
   - Botão "Gerar PIX"

2. **Seção PIX** (aparece após gerar):
   - QR Code visual (300x300px)
   - Campo "Copia e Cola" com botão para copiar
   - Informações do pagamento (valor, status)
   - Botão "Cancelar Pagamento"

### Status Visual

- **Aguardando**: ⏳ Laranja - "Aguardando pagamento..."
- **Confirmado**: ✅ Verde - "Pagamento confirmado!"
- **Expirado**: ⏰ Vermelho - "Tempo esgotado. Gere um novo PIX."

## 🔄 Verificação de Pagamento

### Polling Automático

- **Frequência**: A cada 3 segundos
- **Timeout**: 15 minutos
- **Status verificados**: `paid`, `pago`, `approved`, `aprovado`

### Quando Pagamento é Confirmado

1. Para o polling
2. Atualiza interface visual
3. Envia webhook para n8n
4. Aguarda 2 segundos
5. Redireciona para "Meus Anúncios"

## 🔐 Segurança

### Token de API
- Token armazenado no código (⚠️ Mover para variável de ambiente em produção)
- Usado em todas as requisições via header `Authorization: Bearer {TOKEN}`

### Validação
- Verifica se resposta contém QR Code antes de exibir
- Valida estrutura dos dados retornados
- Trata erros de API graciosamente

## 📝 Campos no Banco de Dados

### Tabela: `anuncios`

Campos atualizados quando PIX é gerado:
- `transacao_id`: ID do PIX retornado pela API
- `status`: `'pendente_pagamento'`

Campos que devem ser atualizados pelo n8n quando pagamento confirmado:
- `status`: `'publicado'`
- `ativo`: `true`
- `dias_publicacao`: Quantidade de dias contratados
- `valor_pagamento`: Valor total pago
- `forma_pagamento`: `'pix'`
- `em_destaque`: Boolean
- `data_inicio_publicacao`: Data/hora atual
- `data_fim_publicacao`: Data/hora atual + dias contratados
- `data_fim_destaque`: Data/hora atual + 3 dias (se em_destaque = true)

## 🔧 Configuração no n8n

### Passo 1: Criar Webhook
1. No n8n, crie um novo workflow
2. Adicione um nó **Webhook** como trigger
3. Configure:
   - **Method**: POST
   - **Path**: `/webhook/acheinailha`
   - **Response Mode**: Respond When Last Node Finishes

### Passo 2: Processar Webhook
1. Adicione um nó **Function** ou **Code** para extrair dados:
   ```javascript
   const webhookData = $input.item.json;
   const event = webhookData.event; // "payment.paid"
   const transactionData = webhookData.data;
   const metadata = transactionData.metadata;
   const anuncioId = metadata.anuncio_id;
   const status = transactionData.status;

   return {
     anuncio_id: anuncioId,
     transaction_id: transactionData.id,
     status: status,
     amount: transactionData.amount,
     payment_method: transactionData.payment_method,
     dias_publicacao: metadata.dias_publicacao,
     valor_total: metadata.valor_total,
     em_destaque: metadata.em_destaque,
     data_pagamento: transactionData.created_at
   };
   ```

### Passo 3: Atualizar Banco de Dados
1. Adicione nó **Supabase** ou **PostgreSQL**
2. Configure UPDATE na tabela `anuncios`:
   - **WHERE**: `id = {{ $json.anuncio_id }}`
   - **SET**:
     - `status = 'publicado'`
     - `ativo = true`
     - `transacao_id = {{ $json.transaction_id }}`
     - `dias_publicacao = {{ $json.dias_publicacao }}`
     - `valor_pagamento = {{ $json.valor_total }}`
     - `forma_pagamento = 'pix'`
     - `em_destaque = {{ $json.em_destaque }}`
     - `data_inicio_publicacao = NOW()`
     - `data_fim_publicacao = NOW() + INTERVAL '{{ $json.dias_publicacao }} days'`
     - Se `em_destaque = true`: `data_fim_destaque = NOW() + INTERVAL '3 days'`

## 🧪 Testes

### Teste 1: Gerar PIX
1. Criar anúncio
2. Ir para página de pagamento
3. Selecionar dias e gerar PIX
4. Verificar se QR Code aparece
5. Verificar se código PIX está correto

### Teste 2: Verificação de Pagamento
1. Gerar PIX
2. Simular pagamento na API do PushinPay (sandbox)
3. Verificar se status muda automaticamente
4. Verificar se webhook é enviado

### Teste 3: Copiar Código PIX
1. Gerar PIX
2. Clicar em "Copiar"
3. Verificar se código é copiado corretamente
4. Verificar feedback visual

## 🚨 Tratamento de Erros

### Erros Possíveis:

1. **API do PushinPay indisponível**
   - Mostrar mensagem de erro ao usuário
   - Não criar anúncio se ainda não existir

2. **QR Code não retornado**
   - Validar resposta antes de exibir
   - Mostrar erro específico

3. **Erro ao verificar status**
   - Continuar tentando (não bloquear)
   - Logar erro no console

4. **Timeout de 15 minutos**
   - Parar verificação
   - Permitir gerar novo PIX

5. **Erro ao enviar webhook**
   - Logar erro mas não bloquear fluxo
   - O n8n pode receber webhook diretamente do PushinPay se configurado

## 📊 Status do Anúncio

### Fluxo de Status:
1. **Criação**: `status = 'rascunho'` ou `'pendente_pagamento'`, `ativo = false`
2. **PIX Gerado**: `status = 'pendente_pagamento'`, `transacao_id` salvo
3. **Pagamento Confirmado** (via webhook): `status = 'publicado'`, `ativo = true`

## 🔄 Bibliotecas Utilizadas

- **QRCode.js**: `https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js`
  - Usado para gerar QR Code visual do código PIX

## ⚠️ Observações Importantes

1. **URL da API**: A URL base pode precisar ser ajustada conforme documentação oficial do PushinPay
2. **Endpoints**: Verificar nomes exatos dos endpoints na documentação
3. **Campos da Resposta**: Verificar nomes exatos dos campos (pode variar)
4. **Status do Pagamento**: Verificar valores exatos de status na documentação
5. **Sandbox**: Verificar se há ambiente de sandbox para testes

## 📞 Próximos Passos

1. ✅ Integração com PushinPay implementada
2. ⏳ Verificar documentação oficial para confirmar URLs e endpoints
3. ⏳ Testar em ambiente sandbox (se disponível)
4. ⏳ Configurar workflow no n8n
5. ⏳ Testar fluxo completo de pagamento
6. ⏳ Mover token de API para variável de ambiente

