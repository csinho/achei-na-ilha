-- =============================================
-- MIGRAÇÃO: Sistema de Pagamento por Anúncio
-- Projeto: Achei na Ilha
-- Data: 2024
-- =============================================
-- 
-- Este script adapta o banco de dados para o novo modelo:
-- - Remove distinção entre "visitante" e "anunciante" (todos são anunciantes)
-- - Adiciona campos para pagamento por anúncio
-- - Cria tabela de pagamentos
-- =============================================

BEGIN;

-- =============================================
-- 1. ATUALIZAR TABELA USERS
-- =============================================

-- Atualizar todos os usuários existentes para 'anunciante'
UPDATE users 
SET tipo_usuario = 'anunciante' 
WHERE tipo_usuario = 'visitante';

-- Remover restrição CHECK antiga e criar nova (apenas 'anunciante')
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tipo_usuario_check;
ALTER TABLE users ADD CONSTRAINT users_tipo_usuario_check 
    CHECK (tipo_usuario = 'anunciante');

-- Tornar plano_ativo_id opcional (não é mais obrigatório)
ALTER TABLE users ALTER COLUMN plano_ativo_id DROP NOT NULL;

-- Remover índice relacionado ao tipo de usuário (não é mais necessário)
DROP INDEX IF EXISTS idx_users_tipo;

-- =============================================
-- 2. ADICIONAR CAMPOS NA TABELA ANUNCIOS
-- =============================================

-- Adicionar campo de status do anúncio
ALTER TABLE anuncios 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'rascunho' 
    CHECK (status IN ('rascunho', 'pendente_pagamento', 'publicado', 'expirado', 'cancelado'));

-- Adicionar campos de pagamento e publicação
ALTER TABLE anuncios 
ADD COLUMN IF NOT EXISTS dias_publicacao INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS valor_pagamento DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS em_destaque BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_inicio_publicacao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_fim_publicacao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_fim_destaque TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS forma_pagamento TEXT,
ADD COLUMN IF NOT EXISTS transacao_id TEXT;

-- Atualizar anúncios existentes para status 'publicado' (se estavam ativos)
UPDATE anuncios 
SET status = 'publicado' 
WHERE ativo = true AND status IS NULL;

UPDATE anuncios 
SET status = 'expirado' 
WHERE ativo = false AND status IS NULL;

-- =============================================
-- 3. CRIAR TABELA DE PAGAMENTOS
-- =============================================

CREATE TABLE IF NOT EXISTS pagamentos_anuncio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    valor_total DECIMAL(10,2) NOT NULL,
    valor_publicacao DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_destaque DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    dias_publicacao INTEGER NOT NULL,
    dias_destaque INTEGER DEFAULT 0,
    forma_pagamento TEXT NOT NULL CHECK (forma_pagamento IN ('pix', 'cartao_credito', 'cartao_debito', 'boleto')),
    status_pagamento TEXT NOT NULL DEFAULT 'pendente' 
        CHECK (status_pagamento IN ('pendente', 'processando', 'aprovado', 'rejeitado', 'cancelado', 'reembolsado')),
    transacao_id TEXT,
    gateway_pagamento TEXT,
    dados_pagamento JSONB,
    aprovado_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para pagamentos
CREATE INDEX IF NOT EXISTS idx_pagamentos_anuncio ON pagamentos_anuncio(anuncio_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_usuario ON pagamentos_anuncio(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos_anuncio(status_pagamento);
CREATE INDEX IF NOT EXISTS idx_pagamentos_transacao ON pagamentos_anuncio(transacao_id);

-- Trigger para atualizar updated_at na tabela pagamentos
CREATE TRIGGER update_pagamentos_updated_at 
    BEFORE UPDATE ON pagamentos_anuncio
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. ATUALIZAR TABELA COMENTARIOS
-- =============================================

-- Renomear visitante_id para usuario_id (já que todos são anunciantes)
ALTER TABLE comentarios 
    RENAME COLUMN visitante_id TO usuario_id;

-- Atualizar índice
DROP INDEX IF EXISTS idx_comentarios_visitante;
CREATE INDEX IF NOT EXISTS idx_comentarios_usuario ON comentarios(usuario_id);

-- Atualizar política RLS
DROP POLICY IF EXISTS "Users can insert own comentarios" ON comentarios;
CREATE POLICY "Users can insert own comentarios" ON comentarios
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- =============================================
-- 5. ATUALIZAR TABELA LIKES
-- =============================================

-- Renomear visitante_id para usuario_id
ALTER TABLE likes 
    RENAME COLUMN visitante_id TO usuario_id;

-- Remover constraint UNIQUE antiga se existir
ALTER TABLE likes 
    DROP CONSTRAINT IF EXISTS likes_anuncio_id_visitante_id_key;

-- Criar nova constraint UNIQUE
ALTER TABLE likes 
    ADD CONSTRAINT likes_anuncio_usuario_unique UNIQUE(anuncio_id, usuario_id);

-- Atualizar índices
DROP INDEX IF EXISTS idx_likes_visitante;
CREATE INDEX IF NOT EXISTS idx_likes_usuario ON likes(usuario_id);

-- Atualizar política RLS
DROP POLICY IF EXISTS "Users can manage own likes" ON likes;
CREATE POLICY "Users can manage own likes" ON likes
    FOR ALL USING (auth.uid() = usuario_id);

-- =============================================
-- 6. ADICIONAR ÍNDICES PARA NOVOS CAMPOS
-- =============================================

-- Índices para anúncios
CREATE INDEX IF NOT EXISTS idx_anuncios_status ON anuncios(status);
CREATE INDEX IF NOT EXISTS idx_anuncios_destaque ON anuncios(em_destaque);
CREATE INDEX IF NOT EXISTS idx_anuncios_data_fim ON anuncios(data_fim_publicacao);
CREATE INDEX IF NOT EXISTS idx_anuncios_data_fim_destaque ON anuncios(data_fim_destaque);

-- =============================================
-- 7. FUNÇÃO PARA ATUALIZAR STATUS DE ANÚNCIOS EXPIRADOS
-- =============================================

CREATE OR REPLACE FUNCTION verificar_anuncios_expirados()
RETURNS void AS $$
BEGIN
    -- Atualizar anúncios cuja data de publicação expirou
    UPDATE anuncios
    SET status = 'expirado',
        ativo = false,
        atualizado_em = NOW()
    WHERE status = 'publicado'
      AND data_fim_publicacao IS NOT NULL
      AND data_fim_publicacao < NOW();
    
    -- Remover destaque de anúncios cujo período de destaque expirou
    UPDATE anuncios
    SET em_destaque = false,
        atualizado_em = NOW()
    WHERE em_destaque = true
      AND data_fim_destaque IS NOT NULL
      AND data_fim_destaque < NOW();
END;
$$ LANGUAGE plpgsql;

-- Criar job agendado (se o Supabase suportar) ou usar função para chamar periodicamente
-- NOTA: No Supabase, você pode usar pg_cron ou chamar esta função via Edge Functions

-- =============================================
-- 8. VIEW PARA ANÚNCIOS PÚBLICOS (APENAS PUBLICADOS E NÃO EXPIRADOS)
-- =============================================

CREATE OR REPLACE VIEW anuncios_publicos AS
SELECT 
    a.*,
    u.nome as anunciante_nome,
    u.email as anunciante_email,
    u.telefone as anunciante_telefone
FROM anuncios a
INNER JOIN users u ON a.usuario_id = u.id
WHERE a.status = 'publicado'
  AND (a.data_fim_publicacao IS NULL OR a.data_fim_publicacao > NOW())
ORDER BY 
    a.em_destaque DESC, -- Destaques primeiro
    a.criado_em DESC;

-- =============================================
-- 9. COMENTÁRIOS E NOTAS
-- =============================================

-- IMPORTANTE:
-- 1. As tabelas 'planos' e 'assinaturas' foram mantidas caso você queira usar no futuro
--    ou oferecer planos como opção adicional
-- 2. Todos os usuários agora são 'anunciante'
-- 3. O campo 'plano_ativo_id' em users não é mais obrigatório
-- 4. Novos campos em 'anuncios' controlam publicação e pagamento
-- 5. Tabela 'pagamentos_anuncio' armazena histórico de todos os pagamentos
-- 6. Execute a função 'verificar_anuncios_expirados()' periodicamente para manter status atualizado

COMMIT;

-- =============================================
-- VERIFICAÇÃO PÓS-MIGRAÇÃO
-- =============================================

-- Verificar se todos os usuários foram atualizados
SELECT 
    tipo_usuario,
    COUNT(*) as total
FROM users
GROUP BY tipo_usuario;

-- Verificar estrutura da tabela anuncios
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'anuncios'
ORDER BY ordinal_position;

-- Verificar se tabela pagamentos foi criada
SELECT COUNT(*) as total_pagamentos
FROM pagamentos_anuncio;

