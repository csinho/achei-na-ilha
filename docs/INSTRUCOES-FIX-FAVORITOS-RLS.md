# Instruções para Corrigir Políticas RLS da Tabela Favoritos

## Problema
O erro 406 (Not Acceptable) está ocorrendo porque existe uma política RLS chamada "public" na tabela `favoritos` que permite tudo (`using true`), causando conflito com as políticas específicas.

## Solução

### Passo 1: Executar o Script SQL

Execute o script `sql/fix-favoritos-rls.sql` no Supabase SQL Editor:

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `sql/fix-favoritos-rls.sql`
4. Execute o script

### Passo 2: Verificar as Políticas

Após executar o script, verifique se as políticas foram criadas corretamente:

```sql
SELECT * FROM pg_policies WHERE tablename = 'favoritos';
```

Você deve ver 3 políticas:
- `Users can view own favorites` (SELECT)
- `Users can create favorites` (INSERT)
- `Users can delete own favorites` (DELETE)

### Passo 3: Remover a Política "public" Manualmente (se necessário)

Se a política "public" ainda existir após executar o script, remova-a manualmente:

1. No Supabase Dashboard, vá em **Authentication** > **Policies**
2. Selecione a tabela `favoritos`
3. Encontre a política chamada "public"
4. Clique nos três pontos (...) e selecione **Delete**

## O que o Script Faz

1. Remove a política problemática "public"
2. Remove políticas antigas que podem estar causando conflito
3. Cria 3 políticas corretas:
   - **SELECT**: Usuários podem ver apenas seus próprios favoritos
   - **INSERT**: Usuários podem criar favoritos apenas para si mesmos
   - **DELETE**: Usuários podem deletar apenas seus próprios favoritos

## Após a Correção

Após executar o script, o erro 406 deve desaparecer e o sistema de favoritos deve funcionar corretamente.

