# Instruções: Auto-pausar Anúncios Expirados

Este documento explica como configurar o sistema para pausar automaticamente anúncios que expiraram.

## 📋 Visão Geral

O sistema possui **3 opções** para pausar anúncios expirados automaticamente:

1. **Função Manual**: Executar manualmente quando necessário
2. **Trigger Automático**: Pausa em tempo real quando o anúncio é consultado/atualizado
3. **Agendamento (pg_cron)**: Executa automaticamente em horários programados (ex: diariamente à meia-noite)

## 🚀 Como Aplicar

### Passo 1: Acessar o Supabase SQL Editor

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**

### Passo 2: Executar o Script

1. Abra o arquivo `auto-pausar-anuncios-expirados.sql`
2. Copie **todo o conteúdo** do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** ou pressione `Ctrl+Enter`

### Passo 3: Escolher a Opção Desejada

O script contém **3 opções**. Você pode usar uma ou todas:

#### ✅ OPÇÃO 1: Função Manual (Recomendado para começar)

Esta função pode ser executada manualmente quando necessário:

```sql
SELECT * FROM pausar_anuncios_expirados();
```

**Quando usar:**
- Para testar a funcionalidade
- Para executar manualmente quando necessário
- Para verificar quantos anúncios foram pausados

**Vantagens:**
- Simples e direto
- Retorna quantos anúncios foram pausados
- Não requer configuração adicional

**Desvantagens:**
- Precisa ser executado manualmente
- Não é automático

---

#### ✅ OPÇÃO 2: Trigger Automático (Tempo Real)

Esta opção pausa anúncios automaticamente quando eles são consultados ou atualizados.

**Quando usar:**
- Quando quer que a verificação aconteça em tempo real
- Quando não quer configurar agendamento

**Vantagens:**
- Automático e em tempo real
- Não requer agendamento
- Funciona a cada consulta/atualização

**Desvantagens:**
- Só verifica quando há interação com o anúncio
- Não verifica anúncios que não são consultados

**Nota:** O trigger já é criado automaticamente quando você executa o script completo.

---

#### ✅ OPÇÃO 3: Agendamento com pg_cron (Mais Completo)

Esta opção executa a função automaticamente em horários programados.

**Passo 1: Habilitar pg_cron**

1. No Supabase Dashboard, vá em **Database** → **Extensions**
2. Procure por **pg_cron**
3. Clique em **Enable**

**Passo 2: Agendar Execução**

Execute este comando no SQL Editor:

```sql
SELECT cron.schedule(
    'pausar-anuncios-expirados',  -- nome do job
    '0 0 * * *',                  -- executa todo dia à meia-noite
    $$SELECT pausar_anuncios_expirados();$$
);
```

**Formato do horário (cron):**
- `0 0 * * *` = Todo dia à meia-noite (00:00)
- `0 */6 * * *` = A cada 6 horas
- `0 0 * * 0` = Todo domingo à meia-noite
- `*/30 * * * *` = A cada 30 minutos

**Quando usar:**
- Quando quer verificação automática periódica
- Quando quer garantir que todos os anúncios sejam verificados regularmente

**Vantagens:**
- Totalmente automático
- Verifica todos os anúncios periodicamente
- Não depende de interação do usuário

**Desvantagens:**
- Requer habilitar extensão pg_cron
- Pode haver um pequeno delay (até 24h se configurado diariamente)

**Verificar jobs agendados:**
```sql
SELECT * FROM cron.job;
```

**Remover agendamento:**
```sql
SELECT cron.unschedule('pausar-anuncios-expirados');
```

---

## 🧪 Como Testar

### Teste 1: Verificar Anúncios que Serão Pausados

Execute esta consulta para ver quais anúncios serão pausados:

```sql
SELECT 
    id,
    titulo,
    status,
    ativo,
    data_fim_publicacao,
    NOW() as agora,
    (data_fim_publicacao < NOW()) as expirado
FROM anuncios
WHERE 
    data_fim_publicacao IS NOT NULL
    AND data_fim_publicacao < NOW()
    AND ativo = true
    AND (status = 'publicado' OR status IS NULL);
```

### Teste 2: Executar a Função Manualmente

```sql
SELECT * FROM pausar_anuncios_expirados();
```

Você verá algo como:
```
anuncios_pausados | detalhes
------------------|-------------------
5                 | Anúncios pausados: 5
```

### Teste 3: Verificar se Funcionou

```sql
SELECT 
    id,
    titulo,
    status,
    ativo,
    data_fim_publicacao
FROM anuncios
WHERE status = 'pausado';
```

---

## 📊 Monitoramento

### Consulta para Ver Anúncios Expirados (ainda não pausados)

```sql
SELECT 
    COUNT(*) as total_expirados_nao_pausados
FROM anuncios
WHERE 
    data_fim_publicacao IS NOT NULL
    AND data_fim_publicacao < NOW()
    AND ativo = true
    AND (status = 'publicado' OR status IS NULL);
```

### Consulta para Ver Estatísticas Gerais

```sql
SELECT 
    status,
    COUNT(*) as quantidade,
    COUNT(CASE WHEN data_fim_publicacao < NOW() THEN 1 END) as expirados
FROM anuncios
GROUP BY status;
```

---

## ⚠️ Importante

1. **Backup**: Sempre faça backup do banco antes de executar scripts SQL
2. **Teste Primeiro**: Teste em desenvolvimento antes de aplicar em produção
3. **Monitoramento**: Monitore os logs após aplicar para garantir que está funcionando
4. **RLS Policies**: Certifique-se de que as políticas RLS permitem a atualização

---

## 🔧 Troubleshooting

### Problema: "function pausar_anuncios_expirados() does not exist"

**Solução:** Execute o script completo novamente, garantindo que a função foi criada.

### Problema: "permission denied for schema cron"

**Solução:** A extensão pg_cron precisa ser habilitada. Vá em Database → Extensions e habilite.

### Problema: Anúncios não estão sendo pausados

**Solução:**
1. Verifique se `data_fim_publicacao` está preenchida
2. Verifique se a data já passou: `SELECT NOW(), data_fim_publicacao FROM anuncios LIMIT 1;`
3. Verifique se o status é 'publicado' ou NULL
4. Execute manualmente: `SELECT * FROM pausar_anuncios_expirados();`

---

## 📝 Notas

- A função `pausar_anuncios_expirados()` atualiza apenas anúncios que:
  - Têm `data_fim_publicacao` definida
  - A data já passou (`data_fim_publicacao < NOW()`)
  - Estão ativos (`ativo = true`)
  - Estão publicados (`status = 'publicado'` ou `status IS NULL`)

- Anúncios pausados têm:
  - `status = 'pausado'`
  - `ativo = false`
  - `atualizado_em = NOW()`

- Usuários podem reativar anúncios pausados através da interface (botão "Reativar")

