-- =============================================
-- ADICIONAR CREDENCIAIS DO CLOUDINARY ADMIN API
-- Necessárias para deletar imagens via Admin API
-- =============================================

-- Inserir ou atualizar configurações do Cloudinary Admin API
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria)
VALUES 
    ('cloudinary_api_key', '', 'string', 'API Key do Cloudinary para Admin API (deleção de imagens)', 'cloudinary'),
    ('cloudinary_api_secret', '', 'string', 'API Secret do Cloudinary para Admin API (deleção de imagens)', 'cloudinary')
ON CONFLICT (chave) 
DO UPDATE SET 
    descricao = EXCLUDED.descricao,
    categoria = EXCLUDED.categoria,
    atualizado_em = NOW();

-- Comentários
COMMENT ON COLUMN configuracoes.valor IS 'Para cloudinary_api_secret, o valor deve ser criptografado ou armazenado de forma segura';

