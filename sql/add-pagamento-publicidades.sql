-- =============================================
-- ADICIONAR CAMPOS DE PAGAMENTO NA TABELA PUBLICIDADES
-- Sistema de pagamento por período de publicação
-- =============================================

-- Adicionar campos de pagamento e publicação (similar aos anúncios)
ALTER TABLE publicidades 
ADD COLUMN IF NOT EXISTS dias_publicacao INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS valor_pagamento DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS data_inicio_publicacao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_fim_publicacao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS forma_pagamento TEXT,
ADD COLUMN IF NOT EXISTS transacao_id TEXT;

-- Comentários nas colunas
COMMENT ON COLUMN publicidades.dias_publicacao IS 'Número de dias de publicação contratados';
COMMENT ON COLUMN publicidades.valor_pagamento IS 'Valor pago pela publicidade';
COMMENT ON COLUMN publicidades.data_inicio_publicacao IS 'Data de início da publicação';
COMMENT ON COLUMN publicidades.data_fim_publicacao IS 'Data de fim da publicação (expiração)';
COMMENT ON COLUMN publicidades.forma_pagamento IS 'Forma de pagamento (pix, cartao, etc)';
COMMENT ON COLUMN publicidades.transacao_id IS 'ID da transação no gateway de pagamento';

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_publicidades_data_fim ON publicidades(data_fim_publicacao);
CREATE INDEX IF NOT EXISTS idx_publicidades_aprovada ON publicidades(aprovada);
CREATE INDEX IF NOT EXISTS idx_publicidades_visivel ON publicidades(visivel);

-- =============================================
-- FUNÇÃO PARA ATUALIZAR STATUS DE PUBLICIDADES EXPIRADAS
-- =============================================

CREATE OR REPLACE FUNCTION verificar_publicidades_expiradas()
RETURNS void AS $$
BEGIN
    -- Desativar publicidades cuja data de publicação expirou
    UPDATE publicidades
    SET visivel = false,
        atualizado_em = NOW()
    WHERE aprovada = true
      AND visivel = true
      AND data_fim_publicacao IS NOT NULL
      AND data_fim_publicacao < NOW();
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- NOTAS
-- =============================================
-- A função verificar_publicidades_expiradas() deve ser chamada periodicamente
-- (via pg_cron ou Edge Functions) para desativar publicidades expiradas automaticamente
--
-- Valor padrão: R$ 59,90 / mês (30 dias)
-- Preço por dia: R$ 1,997 (59.90 / 30)
-- Mínimo: 7 dias
-- Máximo: 30 dias

