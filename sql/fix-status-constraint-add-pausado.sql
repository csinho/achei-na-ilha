-- =============================================
-- CORREÇÃO: Adicionar 'pausado' ao CHECK constraint de status
-- =============================================
-- Este script corrige o erro ao pausar anúncios manualmente
-- Problema: O CHECK constraint não permitia o valor 'pausado'
-- =============================================

BEGIN;

-- Remover o CHECK constraint antigo
ALTER TABLE anuncios DROP CONSTRAINT IF EXISTS anuncios_status_check;

-- Recriar com todos os valores permitidos incluindo 'pausado'
ALTER TABLE anuncios 
ADD CONSTRAINT anuncios_status_check 
    CHECK (status IN ('rascunho', 'pendente_pagamento', 'publicado', 'pausado', 'expirado', 'cancelado'));

-- Atualizar anúncios que estão com ativo = false mas status não é 'pausado' ou 'expirado'
-- para 'pausado' (se não expiraram) ou manter como estão
UPDATE anuncios 
SET status = 'pausado'
WHERE ativo = false 
  AND status NOT IN ('expirado', 'cancelado', 'rascunho')
  AND (data_fim_publicacao IS NULL OR data_fim_publicacao >= NOW());

COMMIT;

-- =============================================
-- VERIFICAÇÃO: Ver anúncios pausados
-- =============================================
-- SELECT id, titulo, status, ativo, data_fim_publicacao 
-- FROM anuncios 
-- WHERE status = 'pausado';

