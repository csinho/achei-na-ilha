-- ============================================
-- Script SQL para pausar automaticamente anúncios expirados
-- ============================================
-- Este script deve ser executado no Supabase SQL Editor
-- 
-- OPÇÃO 1: Função para executar manualmente ou via cron job
-- ============================================

-- Função que marca anúncios expirados automaticamente
-- IMPORTANTE: Dropar a função antiga primeiro se ela existir com tipo de retorno diferente
DROP FUNCTION IF EXISTS pausar_anuncios_expirados();

CREATE OR REPLACE FUNCTION pausar_anuncios_expirados()
RETURNS TABLE(anuncios_expirados INT, detalhes TEXT) AS $$
DECLARE
    anuncios_afetados INT := 0;
    detalhe TEXT;
BEGIN
    -- Atualizar anúncios que expiraram (data_fim_publicacao < agora)
    -- e que estão publicados (ativo = true e status = 'publicado')
    -- IMPORTANTE: Não processa anúncios já pausados manualmente (ativo = false e status = 'pausado')
    UPDATE anuncios
    SET 
        status = 'expirado',
        ativo = false,
        atualizado_em = NOW()
    WHERE 
        data_fim_publicacao IS NOT NULL
        AND data_fim_publicacao < NOW()
        AND ativo = true
        AND status = 'publicado';
    
    GET DIAGNOSTICS anuncios_afetados = ROW_COUNT;
    
    detalhe := 'Anúncios expirados automaticamente: ' || anuncios_afetados;
    
    RETURN QUERY SELECT anuncios_afetados, detalhe;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- OPÇÃO 2: Trigger automático (executa em tempo real)
-- ============================================

-- Função que será executada pelo trigger
CREATE OR REPLACE FUNCTION verificar_expiracao_anuncio()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se o anúncio expirou ao ser consultado ou atualizado
    -- IMPORTANTE: Não processa anúncios já pausados manualmente
    IF NEW.data_fim_publicacao IS NOT NULL 
       AND NEW.data_fim_publicacao < NOW() 
       AND NEW.ativo = true 
       AND NEW.status = 'publicado' THEN
        NEW.status := 'expirado';
        NEW.ativo := false;
        NEW.atualizado_em := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger que verifica antes de UPDATE
DROP TRIGGER IF EXISTS trigger_verificar_expiracao ON anuncios;
CREATE TRIGGER trigger_verificar_expiracao
    BEFORE UPDATE ON anuncios
    FOR EACH ROW
    EXECUTE FUNCTION verificar_expiracao_anuncio();

-- ============================================
-- OPÇÃO 3: Função para executar via pg_cron (agendamento automático)
-- ============================================
-- Nota: pg_cron precisa ser habilitado no Supabase
-- Para habilitar: vá em Database > Extensions > pg_cron

-- Agendar execução diária às 00:00 (meia-noite)
-- SELECT cron.schedule(
--     'pausar-anuncios-expirados',  -- nome do job
--     '0 0 * * *',                  -- executa todo dia à meia-noite (formato cron)
--     $$SELECT pausar_anuncios_expirados();$$
-- );

-- Para verificar jobs agendados:
-- SELECT * FROM cron.job;

-- Para remover o job:
-- SELECT cron.unschedule('pausar-anuncios-expirados');

-- ============================================
-- TESTE: Executar manualmente para testar
-- ============================================
-- SELECT * FROM pausar_anuncios_expirados();

-- ============================================
-- CONSULTA: Ver anúncios que serão pausados
-- ============================================
-- SELECT 
--     id,
--     titulo,
--     status,
--     ativo,
--     data_fim_publicacao,
--     NOW() as agora,
--     (data_fim_publicacao < NOW()) as expirado
-- FROM anuncios
-- WHERE 
--     data_fim_publicacao IS NOT NULL
--     AND data_fim_publicacao < NOW()
--     AND ativo = true
--     AND status = 'publicado';

