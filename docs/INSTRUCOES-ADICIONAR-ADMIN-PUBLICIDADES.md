# Instruções: Adicionar Campo Admin na Tabela Publicidades

## Objetivo
Adicionar um campo `admin` na tabela `publicidades` para diferenciar publicidades do sistema (admin) das publicidades pagas (anunciantes).

## Comportamento

### Publicidades Admin (`admin = true`)
- São criadas automaticamente como **visíveis** e **aprovadas**
- **Não precisam de pagamento** para ficar ativas
- Aparecem **apenas na página inicial** (`index.html`)
- São publicidades do sistema para promoções, campanhas, etc.

### Publicidades Pagas (`admin = false`)
- São criadas como **não visíveis** e **não aprovadas**
- **Precisam de pagamento** para ficar visíveis e aprovadas
- Aparecem **apenas na página de busca** (`busca.html`)
- São publicidades de anunciantes que pagam pelo serviço

## Passos para Aplicar

1. **Execute o SQL no Supabase:**
   ```sql
   -- Arquivo: sql/add-admin-campo-publicidades.sql
   ```
   
   Ou execute diretamente:
   ```sql
   ALTER TABLE publicidades ADD COLUMN IF NOT EXISTS admin BOOLEAN DEFAULT false;
   CREATE INDEX IF NOT EXISTS idx_publicidades_admin ON publicidades(admin);
   ```

2. **Verificar se a coluna foi criada:**
   ```sql
   SELECT column_name, data_type, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'publicidades' AND column_name = 'admin';
   ```

3. **Atualizar publicidades existentes (opcional):**
   Se você quiser marcar publicidades existentes como admin:
   ```sql
   UPDATE publicidades 
   SET admin = true, aprovada = true, visivel = true 
   WHERE id IN (1, 2, 3); -- IDs das publicidades que devem ser admin
   ```

## Funcionalidades Implementadas

### No Admin Panel (`admin.html`)
- Checkbox "Publicidade do Sistema (Admin)" no formulário de criação
- Se marcado, a publicidade é criada automaticamente como visível e aprovada
- Mensagem de sucesso diferenciada para publicidades admin

### No Index (`index.html`)
- Filtra apenas publicidades com `admin = true`
- Exibe no slider de publicidades

### Na Busca (`busca.html`)
- Filtra apenas publicidades com `admin = false`
- Exibe no slider de publicidades (mesmo layout do index)

## Observações

- Publicidades admin não aparecem na página de busca
- Publicidades pagas não aparecem na página inicial
- O campo `admin` é `BOOLEAN` com valor padrão `false`
- Foi criado um índice para melhorar performance nas consultas

