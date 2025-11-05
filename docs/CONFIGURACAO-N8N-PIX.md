# Configuração do n8n para PushinPay PIX

## 📋 Problema: CORS

A API do PushinPay não permite requisições diretas do frontend devido a políticas CORS. Por isso, precisamos usar o **n8n como proxy intermediário**.

## 🔧 Solução: Endpoints no n8n

Precisamos criar **2 workflows** no n8n:

### 1. Workflow: Criar PIX (`/webhook/criar-pix`)

Este workflow recebe os dados do frontend e faz a requisição ao PushinPay.

#### Estrutura do Workflow:

1. **Webhook Trigger**
   - Method: `POST`
   - Path: `/webhook/criar-pix`

2. **Function Node** (Processar dados)
   ```javascript
   const input = $input.item.json;
   const apiKey = input.api_key;
   const value = input.value; // Valor em centavos
   const anuncioId = input.anuncio_id; // ID do anúncio para salvar no banco
   
   // Webhook URL simples (sem parâmetros, pois vamos buscar pelo transaction_id no banco)
   const webhookUrl = 'https://hooks.upcaodigital.com.br/webhook/acheinailha';

   return {
     api_key: apiKey,
     value: value,
     webhook_url: webhookUrl,
     anuncio_id: anuncioId // Passar para salvar no banco após criar PIX
   };
   ```

3. **HTTP Request Node** (Criar PIX no PushinPay)
   - Method: `POST`
   - URL: `https://api.pushinpay.com.br/api/pix/cashIn`
   - Headers:
     ```json
     {
       "Authorization": "Bearer {{ $json.api_key }}",
       "Accept": "application/json",
       "Content-Type": "application/json"
     }
     ```
   - Body:
     ```json
     {
       "value": {{ $json.value }},
       "webhook_url": "{{ $json.webhook_url }}",
       "split_rules": []
     }
     ```

4. **Function Node** (Formatar resposta e salvar transaction_id no banco)
   ```javascript
   const response = $input.item.json;
   const anuncioId = $('Function Node').item.json.anuncio_id;
   const transactionId = response.id;
   
   // Salvar transaction_id no banco de dados (Supabase)
   // Usar HTTP Request para Supabase ou Supabase Node
   // UPDATE anuncios SET transacao_id = transactionId WHERE id = anuncioId
   
   // Estrutura esperada da resposta PushinPay:
   // {
   //   "id": "A048D601-B4AC-42E6-9618-EDBDEF670D81",
   //   "qr_code": "00020101021226810014br.gov.bcb.pix...",
   //   "status": "created",
   //   "value": 500,
   //   "qr_code_base64": "data:image/png;base64,..."
   // }
   
   return {
     data: {
       id: response.id,
       transaction_id: response.id,
       qr_code: response.qr_code,
       qr_code_base64: response.qr_code_base64 || null,
       status: response.status || 'created',
       value: response.value,
       created_at: response.created_at || new Date().toISOString()
     },
     success: true,
     anuncio_id: anuncioId // Para salvar no banco
   };
   ```
   
   **Nota**: Após retornar, você pode adicionar um **Supabase Node** ou **HTTP Request** para salvar o `transaction_id` no banco:
   ```sql
   UPDATE anuncios 
   SET transacao_id = '{{ $json.data.id }}'
   WHERE id = '{{ $json.anuncio_id }}'
   ```

5. **Respond to Webhook Node**
   - Response Data: `{{ $json }}`

---

### 2. Workflow: Verificar PIX (`/webhook/verificar-pix`)

Este workflow verifica o status de uma transação PIX.

#### Estrutura do Workflow:

1. **Webhook Trigger**
   - Method: `POST`
   - Path: `/webhook/verificar-pix`

2. **Function Node** (Processar dados)
   ```javascript
   const input = $input.item.json;
   const apiKey = input.api_key;
   const transactionId = input.transaction_id || input.pix_id;

   return {
     api_key: apiKey,
     transaction_id: transactionId
   };
   ```

3. **HTTP Request Node** (Consultar transação no PushinPay)
   - Method: `GET`
   - URL: `https://api.pushinpay.com.br/api/transactions/{{ $json.transaction_id }}`
   - Headers:
     ```json
     {
       "Authorization": "Bearer {{ $json.api_key }}",
       "Accept": "application/json",
       "Content-Type": "application/json"
     }
     ```

4. **Function Node** (Formatar resposta)
   ```javascript
   const response = $input.item.json;
   
   // A resposta pode ter diferentes campos de status
   // Adaptar conforme a estrutura real da resposta
   // Estrutura esperada da resposta PushinPay:
   // {
   //   "id": "A048D601-B4AC-42E6-9618-EDBDEF670D81",
   //   "status": "paid",
   //   "value": "500",
   //   "description": "Pagamento PIX",
   //   "payment_type": "pix",
   //   "created_at": "2025-11-05T12:48:05.257000Z",
   //   "updated_at": "2025-11-05T12:53:28.700000Z",
   //   "end_to_end_id": "E60701190202511051250DY5AY84R8P4",
   //   "payer_name": "EMERSON",
   //   "payer_national_registration": "038******39"
   // }
   
   return {
     data: {
       id: response.id,
       transaction_id: response.id,
       status: response.status, // "created", "paid", etc.
       value: parseFloat(response.value) || response.value,
       payment_type: response.payment_type,
       end_to_end_id: response.end_to_end_id,
       payer_name: response.payer_name,
       payer_national_registration: response.payer_national_registration,
       created_at: response.created_at,
       updated_at: response.updated_at
     },
     success: true
   };
   ```

5. **Respond to Webhook Node**
   - Response Data: `{{ $json }}`

---

## 📝 URLs dos Endpoints

Após criar os workflows no n8n, você receberá URLs como:

- **Criar PIX**: `https://hooks.upcaodigital.com.br/webhook/criar-pix`
- **Verificar PIX**: `https://hooks.upcaodigital.com.br/webhook/verificar-pix`
- **Webhook Confirmação**: `https://hooks.upcaodigital.com.br/webhook/acheinailha` (já configurado)

---

## 🔄 Fluxo Completo

```
Frontend → n8n (/webhook/criar-pix) → PushinPay API → n8n → Frontend
                                                              ↓
                                                          Recebe QR Code
                                                              ↓
Frontend → n8n (/webhook/verificar-pix) → PushinPay API → n8n → Frontend
                                                              ↓
                                                          Status do PIX
                                                              ↓
PushinPay → n8n (/webhook/acheinailha) [webhook automático quando pagamento confirmado]
    ↓
n8n recebe webhook com body.id (transaction_id)
    ↓
n8n busca no banco: SELECT * FROM anuncios WHERE transacao_id = body.id
    ↓
n8n atualiza anúncio: UPDATE anuncios SET status = 'publicado', ativo = true WHERE id = ...
```

---

## ⚠️ Importante

1. **Verificar URL da API PushinPay**: A URL pode ser diferente. Verificar na documentação oficial
2. **Estrutura da Resposta**: Ajustar conforme a resposta real da API
3. **Tratamento de Erros**: Adicionar tratamento de erros nos workflows
4. **Segurança**: A API key será enviada através do n8n, que deve estar protegido

---

## 🧪 Teste

1. Criar os workflows no n8n
2. Testar criação de PIX via Postman/Insomnia
3. Verificar se QR Code é retornado
4. Testar verificação de status
5. Testar no frontend

---

## 📞 Suporte

Se a URL da API ou estrutura mudar, ajustar:
- URLs nos workflows do n8n
- Código no frontend se necessário

