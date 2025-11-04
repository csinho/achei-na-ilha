# Instruções: Correção do Erro ao Pausar Anúncio

## Problema Identificado

Ao clicar em "Pausar" anúncio, ocorre o erro:
```
new row for relation "anuncios" violates check constraint "anuncios_status_check"
```

## Causa

O CHECK constraint da coluna `status` na tabela `anuncios` não inclui o valor `'pausado'` na lista de valores permitidos.

## Solução

### 1. Executar o Script SQL de Correção

Execute o arquivo `sql/fix-status-constraint-add-pausado.sql` no Supabase SQL Editor:

```sql
-- Remove o constraint antigo e recria com 'pausado' incluído
ALTER TABLE anuncios DROP CONSTRAINT IF EXISTS anuncios_status_check;
ALTER TABLE anuncios 
ADD CONSTRAINT anuncios_status_check 
    CHECK (status IN ('rascunho', 'pendente_pagamento', 'publicado', 'pausado', 'expirado', 'cancelado'));
```

### 2. Comportamento Implementado

#### Quando o usuário pausa manualmente:
- ✅ `status` muda para `'pausado'`
- ✅ `ativo` muda para `false`
- ✅ **`data_fim_publicacao` é preservada** (não é alterada)
- ✅ O anúncio não aparece mais nas buscas públicas

#### Quando o SQL automático executa:
- ✅ Verifica apenas anúncios com `ativo = true` e `status = 'publicado'`
- ✅ Anúncios pausados manualmente (`ativo = false` e `status = 'pausado'`) **não são processados**
- ✅ Anúncios expirados automaticamente recebem `status = 'expirado'` (diferente de 'pausado')

#### Quando reativar um anúncio pausado:
- ✅ A `data_fim_publicacao` original é mantida
- ✅ O anúncio volta a ser visível se ainda não expirou

### 3. Diferença entre Status

- **`'pausado'`**: Anúncio pausado manualmente pelo usuário (pode ser reativado)
- **`'expirado'`**: Anúncio que expirou automaticamente pela data de expiração

### 4. Arquivos Modificados

1. **`sql/fix-status-constraint-add-pausado.sql`**: Script para corrigir o constraint
2. **`sql/auto-pausar-anuncios-expirados.sql`**: Atualizado para usar `'expirado'` em vez de `'pausado'` no auto-processamento
3. **`pages/user/meus-anuncios.html`**: Função `pausarAnuncio()` já preserva `data_fim_publicacao`

## Resumo

- ✅ Problema resolvido: Constraint atualizado para aceitar `'pausado'`
- ✅ Data de expiração preservada quando pausa manualmente
- ✅ SQL automático não conflita com pausa manual
- ✅ Sistema diferencia entre pausa manual (`'pausado'`) e expiração automática (`'expirado'`)

