-- =============================================
-- CORREÇÃO RLS: Permitir leitura de dados públicos de usuários
-- Projeto: Achei na Ilha
-- =============================================

-- IMPORTANTE: Este script permite que usuários logados vejam dados públicos
-- (nome, email, telefone) de outros usuários que têm anúncios publicados.
-- Isso é necessário para exibir informações de contato dos anunciantes.

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Users can view public advertiser data" ON users;
DROP POLICY IF EXISTS "Anyone logged in can view advertiser public data" ON users;

-- Opção 1: Política que permite ver dados de anunciantes que têm anúncios publicados
-- (MAIS SEGURA - apenas anunciantes com anúncios publicados)
CREATE POLICY "Users can view public advertiser data" ON users
    FOR SELECT USING (
        -- O usuário pode ver seu próprio perfil completo
        auth.uid() = id
        OR
        -- Ou pode ver dados públicos de usuários que têm anúncios publicados e ativos
        EXISTS (
            SELECT 1 FROM anuncios
            WHERE anuncios.usuario_id = users.id
            AND anuncios.ativo = true
            AND anuncios.status = 'publicado'
            AND (anuncios.data_fim_publicacao IS NULL OR anuncios.data_fim_publicacao > NOW())
        )
    );

-- Opção 2: Se a Opção 1 não funcionar, use esta (mais permissiva):
-- Permite que qualquer usuário logado veja dados públicos de outros usuários
-- Descomente as linhas abaixo e comente a Opção 1 se necessário:
/*
DROP POLICY IF EXISTS "Users can view public advertiser data" ON users;
CREATE POLICY "Anyone logged in can view advertiser public data" ON users
    FOR SELECT USING (
        auth.uid() IS NOT NULL  -- Qualquer usuário logado pode ver dados públicos
    );
*/

