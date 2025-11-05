-- =============================================
-- CORREÇÃO: Políticas RLS para imagens_anuncio
-- Problema: Imagens não aparecem na listagem/detalhes
-- =============================================

-- Remover políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Advertisers can view own media" ON imagens_anuncio;
DROP POLICY IF EXISTS "Advertisers can create media" ON imagens_anuncio;
DROP POLICY IF EXISTS "Advertisers can update own media" ON imagens_anuncio;
DROP POLICY IF EXISTS "Advertisers can delete own media" ON imagens_anuncio;

-- =============================================
-- NOVA POLÍTICA: Qualquer pessoa pode ver imagens de anúncios públicos
-- =============================================
CREATE POLICY "Anyone can view images of active ads" ON imagens_anuncio
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.ativo = true
            AND anuncios.status = 'publicado'
        )
    );

-- =============================================
-- POLÍTICA: Anunciantes podem ver imagens de seus próprios anúncios
-- (mesmo que não estejam publicados)
-- =============================================
CREATE POLICY "Advertisers can view own ad images" ON imagens_anuncio
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.usuario_id = auth.uid()
        )
    );

-- =============================================
-- POLÍTICA: Anunciantes podem criar imagens para seus anúncios
-- =============================================
CREATE POLICY "Advertisers can create images for own ads" ON imagens_anuncio
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.usuario_id = auth.uid()
        )
    );

-- =============================================
-- POLÍTICA: Anunciantes podem atualizar imagens de seus anúncios
-- =============================================
CREATE POLICY "Advertisers can update own ad images" ON imagens_anuncio
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.usuario_id = auth.uid()
        )
    );

-- =============================================
-- POLÍTICA: Anunciantes podem deletar imagens de seus anúncios
-- =============================================
CREATE POLICY "Advertisers can delete own ad images" ON imagens_anuncio
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM anuncios 
            WHERE anuncios.id = imagens_anuncio.anuncio_id 
            AND anuncios.usuario_id = auth.uid()
        )
    );

