-- =============================================
-- POLÍTICAS RLS (Row Level Security) PARA SUPABASE
-- Projeto: Achei na Ilha
-- =============================================

-- Habilitar RLS em todas as tabelas principais
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualizacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagens_anuncio ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos_anuncio ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncio_caracteristicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicidades ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS PARA TABELA USERS
-- =============================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Permitir inserção de novos usuários (para cadastro)
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- POLÍTICAS PARA TABELA ANUNCIOS
-- =============================================

-- Qualquer pessoa pode ver anúncios ativos
CREATE POLICY "Anyone can view active ads" ON anuncios
    FOR SELECT USING (ativo = true);

-- Anunciantes podem ver seus próprios anúncios (mesmo inativos)
CREATE POLICY "Advertisers can view own ads" ON anuncios
    FOR SELECT USING (auth.uid() = anunciante_id);

-- Anunciantes podem criar anúncios
CREATE POLICY "Advertisers can create ads" ON anuncios
    FOR INSERT WITH CHECK (auth.uid() = anunciante_id);

-- Anunciantes podem atualizar seus próprios anúncios
CREATE POLICY "Advertisers can update own ads" ON anuncios
    FOR UPDATE USING (auth.uid() = anunciante_id);

-- Anunciantes podem deletar seus próprios anúncios
CREATE POLICY "Advertisers can delete own ads" ON anuncios
    FOR DELETE USING (auth.uid() = anunciante_id);

-- =============================================
-- POLÍTICAS PARA TABELA ASSINATURAS
-- =============================================

-- Usuários podem ver suas próprias assinaturas
CREATE POLICY "Users can view own subscriptions" ON assinaturas
    FOR SELECT USING (auth.uid() = usuario_id);

-- Usuários podem criar suas próprias assinaturas
CREATE POLICY "Users can create own subscriptions" ON assinaturas
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- =============================================
-- POLÍTICAS PARA TABELA COMENTARIOS
-- =============================================

-- Qualquer pessoa pode ver comentários aprovados
CREATE POLICY "Anyone can view approved comments" ON comentarios
    FOR SELECT USING (aprovado = true);

-- Usuários podem ver seus próprios comentários
CREATE POLICY "Users can view own comments" ON comentarios
    FOR SELECT USING (auth.uid() = usuario_id);

-- Usuários podem criar comentários
CREATE POLICY "Users can create comments" ON comentarios
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Usuários podem atualizar seus próprios comentários
CREATE POLICY "Users can update own comments" ON comentarios
    FOR UPDATE USING (auth.uid() = usuario_id);

-- =============================================
-- POLÍTICAS PARA TABELA LIKES
-- =============================================

-- Usuários podem ver seus próprios likes
CREATE POLICY "Users can view own likes" ON likes
    FOR SELECT USING (auth.uid() = visitante_id);

-- Usuários podem criar likes
CREATE POLICY "Users can create likes" ON likes
    FOR INSERT WITH CHECK (auth.uid() = visitante_id);

-- Usuários podem deletar seus próprios likes
CREATE POLICY "Users can delete own likes" ON likes
    FOR DELETE USING (auth.uid() = visitante_id);

-- =============================================
-- POLÍTICAS PARA TABELA FAVORITOS
-- =============================================

-- Usuários podem ver seus próprios favoritos
CREATE POLICY "Users can view own favorites" ON favoritos
    FOR SELECT USING (auth.uid() = usuario_id);

-- Usuários podem criar favoritos
CREATE POLICY "Users can create favorites" ON favoritos
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Usuários podem deletar seus próprios favoritos
CREATE POLICY "Users can delete own favorites" ON favoritos
    FOR DELETE USING (auth.uid() = usuario_id);

-- =============================================
-- POLÍTICAS PARA TABELA VISUALIZACOES
-- =============================================

-- Usuários podem ver suas próprias visualizações
CREATE POLICY "Users can view own views" ON visualizacoes
    FOR SELECT USING (auth.uid() = usuario_id);

-- Usuários podem criar visualizações
CREATE POLICY "Users can create views" ON visualizacoes
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- =============================================
-- POLÍTICAS PARA TABELAS DE MÍDIA
-- =============================================

-- Anunciantes podem ver mídia de seus próprios anúncios
CREATE POLICY "Advertisers can view own media" ON imagens_anuncio
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

-- Anunciantes podem criar mídia para seus anúncios
CREATE POLICY "Advertisers can create media" ON imagens_anuncio
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

-- Anunciantes podem atualizar mídia de seus anúncios
CREATE POLICY "Advertisers can update own media" ON imagens_anuncio
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

-- Anunciantes podem deletar mídia de seus anúncios
CREATE POLICY "Advertisers can delete own media" ON imagens_anuncio
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

-- Mesmas políticas para vídeos
CREATE POLICY "Advertisers can view own videos" ON videos_anuncio
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = videos_anuncio.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

CREATE POLICY "Advertisers can create videos" ON videos_anuncio
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = videos_anuncio.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

CREATE POLICY "Advertisers can update own videos" ON videos_anuncio
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = videos_anuncio.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

CREATE POLICY "Advertisers can delete own videos" ON videos_anuncio
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = videos_anuncio.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

-- =============================================
-- POLÍTICAS PARA TABELA ANUNCIO_CARACTERISTICAS
-- =============================================

-- Anunciantes podem gerenciar características de seus anúncios
CREATE POLICY "Advertisers can manage ad characteristics" ON anuncio_caracteristicas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = anuncio_caracteristicas.anuncio_id 
            AND anuncios.anunciante_id = auth.uid()
        )
    );

-- =============================================
-- POLÍTICAS PARA TABELA PUBLICIDADES
-- =============================================

-- Qualquer pessoa pode ver publicidades aprovadas
CREATE POLICY "Anyone can view approved ads" ON publicidades
    FOR SELECT USING (aprovada = true AND visivel = true);

-- Usuários podem ver suas próprias publicidades
CREATE POLICY "Users can view own ads" ON publicidades
    FOR SELECT USING (auth.uid() = criado_por);

-- Usuários podem criar publicidades
CREATE POLICY "Users can create ads" ON publicidades
    FOR INSERT WITH CHECK (auth.uid() = criado_por);

-- Usuários podem atualizar suas próprias publicidades
CREATE POLICY "Users can update own ads" ON publicidades
    FOR UPDATE USING (auth.uid() = criado_por);

-- =============================================
-- POLÍTICAS PARA TABELAS DE CONFIGURAÇÃO
-- =============================================

-- Qualquer pessoa pode ver planos
CREATE POLICY "Anyone can view plans" ON planos
    FOR SELECT USING (true);

-- Qualquer pessoa pode ver características
CREATE POLICY "Anyone can view characteristics" ON caracteristicas_imovel
    FOR SELECT USING (ativo = true);

-- =============================================
-- POLÍTICAS PARA TABELA ADMIN
-- =============================================

-- Apenas admins podem ver dados de admin
CREATE POLICY "Only admins can view admin data" ON admin
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin 
            WHERE admin.usuario_id = auth.uid()
        )
    );

-- =============================================
-- VERIFICAÇÃO DAS POLÍTICAS
-- =============================================

-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'anuncios', 'assinaturas', 'comentarios', 'likes', 'favoritos', 'visualizacoes');

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
