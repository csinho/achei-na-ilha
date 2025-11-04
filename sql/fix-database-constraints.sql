-- =============================================
-- CORREÇÕES NO BANCO DE DADOS
-- Projeto: Achei na Ilha
-- =============================================

-- 1. Remover constraint NOT NULL da coluna senha_hash na tabela users
-- (Quando usamos Supabase Auth, não precisamos armazenar senha na nossa tabela)
ALTER TABLE users ALTER COLUMN senha_hash DROP NOT NULL;

-- 2. Verificar se a tabela users tem RLS habilitado
-- (Se não estiver, habilitar)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas RLS para a tabela users se não existirem
-- Política para usuários visualizarem apenas seu próprio perfil
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Política para usuários inserirem apenas seu próprio perfil
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 4. Verificar se outras tabelas importantes têm RLS
ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagens_anuncio ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos_anuncio ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE caracteristicas_imovel ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncio_caracteristicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- 5. Políticas básicas para outras tabelas
-- Planos: todos podem ler
CREATE POLICY IF NOT EXISTS "Planos are viewable by everyone" ON planos
    FOR SELECT USING (true);

-- Assinaturas: usuários podem ver apenas suas próprias
CREATE POLICY IF NOT EXISTS "Users can view own subscriptions" ON assinaturas
    FOR SELECT USING (auth.uid() = usuario_id);

-- Anúncios: todos podem ler, apenas donos podem modificar
CREATE POLICY IF NOT EXISTS "Anuncios are viewable by everyone" ON anuncios
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage own anuncios" ON anuncios
    FOR ALL USING (auth.uid() = anunciante_id);

-- Imagens e vídeos: seguem as mesmas regras dos anúncios
CREATE POLICY IF NOT EXISTS "Imagens are viewable by everyone" ON imagens_anuncio
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Videos are viewable by everyone" ON videos_anuncio
    FOR SELECT USING (true);

-- Comentários: todos podem ler, usuários podem criar seus próprios
CREATE POLICY IF NOT EXISTS "Comentarios are viewable by everyone" ON comentarios
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can create own comentarios" ON comentarios
    FOR INSERT WITH CHECK (auth.uid() = visitante_id);

-- Likes: usuários podem gerenciar seus próprios likes
CREATE POLICY IF NOT EXISTS "Users can manage own likes" ON likes
    FOR ALL USING (auth.uid() = visitante_id);

-- Características: todos podem ler
CREATE POLICY IF NOT EXISTS "Caracteristicas are viewable by everyone" ON caracteristicas_imovel
    FOR SELECT USING (true);

-- Anúncio características: todos podem ler
CREATE POLICY IF NOT EXISTS "Anuncio caracteristicas are viewable by everyone" ON anuncio_caracteristicas
    FOR SELECT USING (true);

-- Publicidades: todos podem ler
CREATE POLICY IF NOT EXISTS "Publicidades are viewable by everyone" ON publicidades
    FOR SELECT USING (true);

-- Admin: apenas admins podem acessar
CREATE POLICY IF NOT EXISTS "Only admins can access admin table" ON admin
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin 
            WHERE usuario_id = auth.uid()
        )
    );

-- 6. Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
