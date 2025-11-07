-- =============================================
-- ADICIONAR CAMPO 'anuncio_gratuito' NA TABELA ANUNCIOS
-- Para controlar anúncios gratuitos (1 por mês por usuário)
-- =============================================

-- Verifica se a coluna 'anuncio_gratuito' já existe na tabela 'anuncios'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anuncios' AND column_name = 'anuncio_gratuito') THEN
        ALTER TABLE anuncios ADD COLUMN anuncio_gratuito BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna "anuncio_gratuito" adicionada à tabela "anuncios".';
    ELSE
        RAISE NOTICE 'Coluna "anuncio_gratuito" já existe na tabela "anuncios". Nenhuma alteração realizada.';
    END IF;
END $$;

-- Criar índice para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_anuncios_gratuito ON anuncios(anuncio_gratuito);
CREATE INDEX IF NOT EXISTS idx_anuncios_usuario_gratuito ON anuncios(usuario_id, anuncio_gratuito, criado_em);

-- Comentário na coluna
COMMENT ON COLUMN anuncios.anuncio_gratuito IS 'Indica se o anúncio foi criado gratuitamente (1 por mês por usuário). Anúncios gratuitos não podem ter destaque.';

-- Adicionar constraint para garantir que anúncios gratuitos não tenham destaque
-- (será validado no código, mas adicionamos comentário aqui)
COMMENT ON COLUMN anuncios.em_destaque IS 'Anúncios gratuitos (anuncio_gratuito = true) não podem ter em_destaque = true';

