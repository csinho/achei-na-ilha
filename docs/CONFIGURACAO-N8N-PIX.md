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
   const pixData = input.pix_data;

   return {
     api_key: apiKey,
     pix_data: pixData
   };
   ```

3. **HTTP Request Node** (Criar PIX no PushinPay)
   - Method: `POST`
   - URL: `https://api.pushinpay.com.br/pix/qrcode` (ou URL correta da API)
   - Headers:
     ```json
     {
       "Authorization": "Bearer {{ $json.api_key }}",
       "Content-Type": "application/json"
     }
     ```
   - Body:
     ```json
     {{ $json.pix_data }}
     ```

4. **Function Node** (Formatar resposta)
   ```javascript
   const response = $input.item.json;
   
   return {
     data: response,
     success: true
   };
   ```

5. **Respond to Webhook Node**
   - Response Data: `{{ $json }}`

---

### 2. Workflow: Verificar PIX (`/webhook/verificar-pix`)

Este workflow verifica o status de um PIX.

#### Estrutura do Workflow:

1. **Webhook Trigger**
   - Method: `POST`
   - Path: `/webhook/verificar-pix`

2. **Function Node** (Processar dados)
   ```javascript
   const input = $input.item.json;
   const apiKey = input.api_key;
   const pixId = input.pix_id;

   return {
     api_key: apiKey,
     pix_id: pixId
   };
   ```

3. **HTTP Request Node** (Consultar PIX no PushinPay)
   - Method: `GET`
   - URL: `https://api.pushinpay.com.br/pix/{{ $json.pix_id }}` (ou URL correta)
   - Headers:
     ```json
     {
       "Authorization": "Bearer {{ $json.api_key }}",
       "Content-Type": "application/json"
     }
     ```

4. **Function Node** (Formatar resposta)
   ```javascript
   const response = $input.item.json;
   
   return {
     data: response,
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
PushinPay → n8n (/webhook/acheinailha) → Processa pagamento → Atualiza banco
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

