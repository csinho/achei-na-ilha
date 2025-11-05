# Configuração do Webhook PushinPay no n8n

## 📋 Visão Geral

Quando um PIX é pago, o PushinPay envia automaticamente um webhook para o endpoint configurado. Este documento explica como configurar o workflow no n8n para processar esse webhook.

## 🔄 Fluxo do Webhook

```
PushinPay → n8n (/webhook/acheinailha) → Buscar anúncio no banco → Atualizar status
```

## 📦 Estrutura do Webhook Recebido

O PushinPay envia os dados via `application/x-www-form-urlencoded` no body:

```json
{
  "headers": {
    "host": "hooks.upcaodigital.com.br",
    "content-type": "application/x-www-form-urlencoded",
    ...
  },
  "body": {
    "id": "A048D601-B4AC-42E6-9618-EDBDEF670D81",
    "value": "500",
    "status": "paid",
    "end_to_end_id": "E60701190202511051250DY5AY84R8P4",
    "payer_name": "EMERSON DE SOUSA SILVA",
    "payer_national_registration": "03882674539"
  }
}
```

## 🔧 Workflow no n8n

### 1. Webhook Trigger

- **Method**: `POST`
- **Path**: `/webhook/acheinailha`
- **Response Mode**: `Response Node` (para responder ao PushinPay)

### 2. Function Node (Processar dados do webhook)

```javascript
const webhookData = $input.item.json.body;
const transactionId = webhookData.id;
const status = webhookData.status;
const value = webhookData.value;

// Validar se é um pagamento confirmado
if (status !== 'paid') {
  return {
    processed: false,
    message: 'Status não é "paid"',
    status: status
  };
}

return {
  transaction_id: transactionId,
  status: status,
  value: parseFloat(value) || value,
  end_to_end_id: webhookData.end_to_end_id,
  payer_name: webhookData.payer_name,
  payer_national_registration: webhookData.payer_national_registration,
  processed: true
};
```

### 3. Supabase Node (Buscar anúncio pelo transaction_id)

**Operação**: `Execute Query`

**Query SQL**:
```sql
SELECT 
  id,
  user_id,
  titulo,
  status,
  transacao_id,
  data_fim_publicacao,
  dias_publicacao
FROM anuncios
WHERE transacao_id = '{{ $json.transaction_id }}'
LIMIT 1;
```

### 4. IF Node (Verificar se anúncio foi encontrado)

- **Condição**: `{{ $json.data.length > 0 }}`
- **Se verdadeiro**: Continuar processamento
- **Se falso**: Retornar erro

### 5. Function Node (Calcular data de expiração)

```javascript
const anuncio = $input.item.json.data[0];
const diasPublicacao = anuncio.dias_publicacao || 7; // Default 7 dias
const now = new Date();
const dataFim = new Date(now);
dataFim.setDate(dataFim.getDate() + diasPublicacao);

return {
  anuncio_id: anuncio.id,
  user_id: anuncio.user_id,
  data_fim_publicacao: dataFim.toISOString(),
  transaction_data: $('Function Node').item.json
};
```

### 6. Supabase Node (Atualizar anúncio)

**Operação**: `Update`

**Table**: `anuncios`

**Update Key**: `id = {{ $json.anuncio_id }}`

**Fields to Update**:
```json
{
  "status": "publicado",
  "ativo": true,
  "data_inicio_publicacao": "{{ $now }}",
  "data_fim_publicacao": "{{ $json.data_fim_publicacao }}"
}
```

### 7. Respond to Webhook Node

**Response Code**: `200`

**Response Data**:
```json
{
  "success": true,
  "message": "Anúncio atualizado com sucesso",
  "anuncio_id": "{{ $('Function Node').item.json.anuncio_id }}",
  "transaction_id": "{{ $('Function Node').item.json.transaction_data.transaction_id }}"
}
```

## ⚠️ Tratamento de Erros

### Erro: Anúncio não encontrado

Se o `transaction_id` não for encontrado no banco:

1. **Log do erro** (usar `Set Node` para salvar logs)
2. **Retornar 200** para o PushinPay (para não ficar reenviando)
3. **Notificar administrador** (opcional)

### Erro: Status não é "paid"

Se o status não for "paid", simplesmente retornar 200 sem processar.

## 🔐 Segurança

1. **Validar origem**: Verificar se o webhook vem realmente do PushinPay
2. **Validar dados**: Verificar se `transaction_id` e `status` existem
3. **Idempotência**: Garantir que o mesmo pagamento não seja processado duas vezes

## 📝 Exemplo de Resposta ao PushinPay

```json
{
  "success": true,
  "message": "Webhook processado com sucesso"
}
```

## 🧪 Teste

1. Criar um PIX de teste
2. Pagar o PIX
3. Verificar se o webhook foi recebido no n8n
4. Verificar se o anúncio foi atualizado no banco
5. Verificar logs de erro (se houver)

---

**Nota**: Este workflow deve estar sempre ativo e respondendo rapidamente (dentro de 5 segundos) para evitar timeout do PushinPay.

