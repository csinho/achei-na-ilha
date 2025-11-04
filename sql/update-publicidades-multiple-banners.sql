-- =============================================
-- ATUALIZAÇÃO DA TABELA PUBLICIDADES
-- Suporte para múltiplos banners (principal e laterais)
-- =============================================

-- Adicionar coluna para armazenar banners principais (JSONB)
ALTER TABLE publicidades 
ADD COLUMN IF NOT EXISTS banners_principais JSONB DEFAULT '[]'::jsonb;

-- Adicionar coluna para armazenar banners laterais (JSONB)
ALTER TABLE publicidades 
ADD COLUMN IF NOT EXISTS banners_laterais JSONB DEFAULT '[]'::jsonb;

-- Comentários nas colunas
COMMENT ON COLUMN publicidades.banners_principais IS 'Array JSON de banners principais (máximo 3). Formato: [{"imagem": "url", "link": "url", "ativo": true}, ...]';
COMMENT ON COLUMN publicidades.banners_laterais IS 'Array JSON de banners laterais (máximo 5). Formato: [{"imagem": "url", "link": "url", "ativo": true}, ...]';

-- Índice GIN para melhor performance em queries JSONB
CREATE INDEX IF NOT EXISTS idx_publicidades_banners_principais ON publicidades USING GIN (banners_principais);
CREATE INDEX IF NOT EXISTS idx_publicidades_banners_laterais ON publicidades USING GIN (banners_laterais);

-- Migrar dados existentes (se houver imagem_url, criar um banner principal)
UPDATE publicidades 
SET banners_principais = jsonb_build_array(
    jsonb_build_object(
        'imagem', COALESCE(imagem_url, ''),
        'link', COALESCE(link_externo, ''),
        'ativo', true
    )
)
WHERE imagem_url IS NOT NULL 
  AND imagem_url != ''
  AND (banners_principais IS NULL OR banners_principais = '[]'::jsonb);

-- Manter a coluna imagem_url por compatibilidade (pode ser removida depois se necessário)
-- ALTER TABLE publicidades DROP COLUMN imagem_url; -- Descomente se quiser remover

-- =============================================
-- RLS POLICIES (se necessário)
-- =============================================

-- Habilitar RLS na tabela (se ainda não estiver habilitado)
ALTER TABLE publicidades ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver (para evitar conflitos)
DROP POLICY IF EXISTS "Publicidades aprovadas são visíveis publicamente" ON publicidades;
DROP POLICY IF EXISTS "Admins podem ver todas as publicidades" ON publicidades;
DROP POLICY IF EXISTS "Admins podem gerenciar publicidades" ON publicidades;
DROP POLICY IF EXISTS "Permitir leitura pública de publicidades" ON publicidades;
DROP POLICY IF EXISTS "Permitir inserção de publicidades" ON publicidades;

-- Permitir leitura pública de publicidades aprovadas e visíveis (para usuários anônimos)
CREATE POLICY "Permitir leitura pública de publicidades"
ON publicidades
FOR SELECT
USING (aprovada = true AND visivel = true);

-- Permitir inserção de publicidades (qualquer usuário autenticado ou anônimo com RLS desabilitado)
-- Como não temos auth.uid() para admin na tabela admin, vamos permitir inserção para todos
-- A verificação de admin será feita no código da aplicação
CREATE POLICY "Permitir inserção de publicidades"
ON publicidades
FOR INSERT
WITH CHECK (true);

-- Permitir atualização de publicidades (qualquer um pode atualizar, mas a validação será no código)
CREATE POLICY "Permitir atualização de publicidades"
ON publicidades
FOR UPDATE
USING (true);

-- Permitir deleção de publicidades
CREATE POLICY "Permitir deleção de publicidades"
ON publicidades
FOR DELETE
USING (true);

-- =============================================
-- NOTAS
-- =============================================
-- A estrutura JSONB permite flexibilidade para armazenar:
-- - banners_principais: até 3 banners (1280x420px)
-- - banners_laterais: até 5 banners (200x355px)
-- 
-- Cada banner tem a estrutura:
-- {
--   "imagem": "https://...",
--   "link": "https://...",
--   "ativo": true
-- }
--
-- O campo link_externo na tabela será usado como link padrão para todos os banners
-- ou pode ser usado individualmente por banner no JSONB

