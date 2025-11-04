-- =============================================
-- AUTO-PAUSAR PUBLICIDADES EXPIRADAS
-- Sistema automático para pausar publicidades quando expiram
-- =============================================

-- =============================================
-- FUNÇÃO PARA ATUALIZAR STATUS DE PUBLICIDADES EXPIRADAS
-- =============================================

CREATE OR REPLACE FUNCTION pausar_publicidades_expiradas()
RETURNS TABLE(publicidades_pausadas INT, detalhes TEXT) AS $$
DECLARE
    publicidades_afetadas INT := 0;
    detalhe TEXT;
BEGIN
    -- Pausar publicidades que expiraram (data_fim_publicacao < agora)
    -- e que estão aprovadas e visíveis
    UPDATE publicidades
    SET 
        visivel = false,
        atualizado_em = NOW()
    WHERE 
        aprovada = true
        AND visivel = true
        AND data_fim_publicacao IS NOT NULL
        AND data_fim_publicacao < NOW();
    
    GET DIAGNOSTICS publicidades_afetadas = ROW_COUNT;
    
    detalhe := 'Publicidades expiradas pausadas automaticamente: ' || publicidades_afetadas;
    
    RETURN QUERY SELECT publicidades_afetadas, detalhe;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGER AUTOMÁTICO (executa em tempo real)
-- =============================================

-- Função que será executada pelo trigger
CREATE OR REPLACE FUNCTION verificar_expiracao_publicidade()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se a publicidade expirou ao ser consultada ou atualizada
    IF NEW.data_fim_publicacao IS NOT NULL 
       AND NEW.data_fim_publicacao < NOW() 
       AND NEW.aprovada = true 
       AND NEW.visivel = true THEN
        NEW.visivel := false;
        NEW.atualizado_em := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger que verifica antes de UPDATE
DROP TRIGGER IF EXISTS trigger_verificar_expiracao_publicidade ON publicidades;
CREATE TRIGGER trigger_verificar_expiracao_publicidade
    BEFORE UPDATE ON publicidades
    FOR EACH ROW
    EXECUTE FUNCTION verificar_expiracao_publicidade();

-- =============================================
-- AGENDAMENTO AUTOMÁTICO (pg_cron)
-- =============================================
-- Nota: pg_cron precisa ser habilitado no Supabase
-- Para habilitar: vá em Database > Extensions > pg_cron
--
-- Agendar execução a cada hora para verificar publicidades expiradas
-- SELECT cron.schedule(
--     'pausar-publicidades-expiradas',  -- nome do job
--     '0 * * * *',                     -- executa todo hora (formato cron)
--     $$SELECT pausar_publicidades_expiradas();$$
-- );
--
-- Para verificar jobs agendados:
-- SELECT * FROM cron.job;
--
-- Para remover o job:
-- SELECT cron.unschedule('pausar-publicidades-expiradas');

-- =============================================
-- TESTE: Executar manualmente para testar
-- =============================================
-- SELECT * FROM pausar_publicidades_expiradas();

-- =============================================
-- CONSULTA: Ver publicidades que serão pausadas
-- =============================================
-- SELECT 
--     id,
--     titulo,
--     aprovada,
--     visivel,
--     data_fim_publicacao,
--     NOW() as agora,
--     (data_fim_publicacao < NOW()) as expirado
-- FROM publicidades
-- WHERE 
--     aprovada = true
--     AND visivel = true
--     AND data_fim_publicacao IS NOT NULL
--     AND data_fim_publicacao < NOW();

