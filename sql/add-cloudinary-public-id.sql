-- =============================================
-- ADICIONAR CAMPO 'cloudinary_public_id' NAS TABELAS
-- Para permitir deleção de imagens no Cloudinary
-- =============================================

-- Adicionar campo na tabela imagens_anuncio
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'imagens_anuncio' AND column_name = 'cloudinary_public_id') THEN
        ALTER TABLE imagens_anuncio ADD COLUMN cloudinary_public_id TEXT;
        RAISE NOTICE 'Coluna "cloudinary_public_id" adicionada à tabela "imagens_anuncio".';
    ELSE
        RAISE NOTICE 'Coluna "cloudinary_public_id" já existe na tabela "imagens_anuncio".';
    END IF;
END $$;

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_imagens_anuncio_cloudinary_public_id ON imagens_anuncio(cloudinary_public_id);

-- Comentário na coluna
COMMENT ON COLUMN imagens_anuncio.cloudinary_public_id IS 'Public ID da imagem no Cloudinary, usado para deleção via Admin API';

-- =============================================
-- NOTA: Para publicidades, o cloudinary_public_id será armazenado
-- dentro do JSONB banners_principais como:
-- {"imagem": "url", "link": "url", "ativo": true, "cloudinary_public_id": "id"}
-- Não é necessário adicionar coluna separada para publicidades
-- =============================================

