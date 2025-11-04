# 🔐 Correção de RLS (Row Level Security) - Supabase

## ❌ Problema Identificado
O erro `401 (Unauthorized)` e `new row violates row-level security policy for table "users"` indica que as políticas RLS não estão configuradas no Supabase.

## ✅ Solução

### Passo 1: Acessar o Supabase Dashboard
1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Acesse o projeto "Achei na Ilha"

### Passo 2: Executar Script SQL

**Opção A: Verificar Status Atual (Recomendado primeiro)**
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Copie e cole o conteúdo do arquivo `check-rls-status.sql`
4. Clique em **"Run"** para ver o status atual

**Opção B: Limpar e Recriar (Se houver duplicatas)**
1. Copie e cole o conteúdo do arquivo `fix-rls-clean.sql`
2. Clique em **"Run"** para limpar e recriar

**Opção C: Correção Inteligente (Se algumas políticas existem)**
1. Copie e cole o conteúdo do arquivo `fix-rls-smart.sql`
2. Clique em **"Run"** para criar apenas as que faltam

### Passo 3: Verificar se Funcionou
1. Volte para o arquivo `test-cadastro-flow.html`
2. Teste novamente o cadastro
3. Deve funcionar sem erros 401

## 📋 Scripts Disponíveis

### `fix-rls-quick.sql` - Correção Rápida
- ✅ Habilita RLS na tabela `users`
- ✅ Permite inserção de novos usuários
- ✅ Permite visualização do próprio perfil
- ✅ Permite atualização do próprio perfil

### `rls-policies.sql` - Políticas Completas
- ✅ Todas as políticas para todas as tabelas
- ✅ Segurança completa do sistema
- ✅ Recomendado para produção

## 🧪 Teste Após Correção

1. **Execute o script** `fix-rls-quick.sql` no Supabase
2. **Abra** `test-cadastro-flow.html`
3. **Teste o cadastro** com dados válidos
4. **Verifique** se o perfil foi criado na tabela `users`

## 🔍 Verificação Manual

Para verificar se as políticas foram criadas:

```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public';
```

Deve retornar 3 políticas:
- `Allow user registration`
- `Users can view own profile` 
- `Users can update own profile`

## ⚠️ Importante

- Execute apenas **UM** dos scripts (recomendo `fix-rls-quick.sql` primeiro)
- Se der erro, verifique se você tem permissões de administrador
- Após executar, teste imediatamente o cadastro
