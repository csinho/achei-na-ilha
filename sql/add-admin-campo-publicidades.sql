-- =============================================
-- ADICIONAR CAMPO 'admin' NA TABELA PUBLICIDADES
-- =============================================

-- Verifica se a coluna 'admin' já existe na tabela 'publicidades'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'publicidades' AND column_name = 'admin') THEN
        ALTER TABLE publicidades ADD COLUMN admin BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna "admin" adicionada à tabela "publicidades".';
    ELSE
        RAISE NOTICE 'Coluna "admin" já existe na tabela "publicidades". Nenhuma alteração realizada.';
    END IF;
END $$;

-- Criar índice para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_publicidades_admin ON publicidades(admin);

-- Comentário na coluna
COMMENT ON COLUMN publicidades.admin IS 'Indica se a publicidade é do sistema (admin). Publicidades admin são criadas automaticamente como visíveis e aprovadas, sem necessidade de pagamento.';

