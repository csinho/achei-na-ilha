-- =============================================
-- CORREÇÃO RLS: Permitir visualização de comentários e likes públicos
-- Projeto: Achei na Ilha
-- =============================================

-- IMPORTANTE: Este script corrige as políticas RLS para permitir que qualquer usuário
-- logado possa ver comentários e likes de anúncios publicados, não apenas os próprios.

-- =============================================
-- CORREÇÃO PARA TABELA COMENTARIOS
-- =============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Anyone can view approved comments" ON comentarios;
DROP POLICY IF EXISTS "Users can view own comments" ON comentarios;
DROP POLICY IF EXISTS "Anyone can view comments on published ads" ON comentarios;

-- Política 1: Qualquer pessoa pode ver comentários de anúncios publicados
-- (independente de aprovação, para simplificar)
CREATE POLICY "Anyone can view comments on published ads" ON comentarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM anuncios
            WHERE anuncios.id = comentarios.anuncio_id
            AND anuncios.ativo = true
            AND anuncios.status = 'publicado'
        )
    );

-- Política 2: Usuários podem ver seus próprios comentários (mesmo em anúncios não publicados)
-- Nota: A migration renomeou visitante_id para usuario_id na tabela comentarios
CREATE POLICY "Users can view own comments" ON comentarios
    FOR SELECT USING (
        auth.uid() = usuario_id
    );

-- =============================================
-- CORREÇÃO PARA TABELA LIKES
-- =============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own likes" ON likes;
DROP POLICY IF EXISTS "Anyone can view likes on published ads" ON likes;

-- Política 1: Qualquer pessoa pode ver likes de anúncios publicados
CREATE POLICY "Anyone can view likes on published ads" ON likes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM anuncios
            WHERE anuncios.id = likes.anuncio_id
            AND anuncios.ativo = true
            AND anuncios.status = 'publicado'
        )
    );

-- Política 2: Usuários podem ver seus próprios likes (mesmo em anúncios não publicados)
-- Nota: A migration renomeou visitante_id para usuario_id na tabela likes
CREATE POLICY "Users can view own likes" ON likes
    FOR SELECT USING (
        auth.uid() = usuario_id
    );

-- =============================================
-- VERIFICAÇÃO
-- =============================================

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('comentarios', 'likes')
ORDER BY tablename, policyname;

