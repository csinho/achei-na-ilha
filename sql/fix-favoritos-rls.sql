-- =============================================
-- CORREÇÃO: Políticas RLS para favoritos
-- Problema: Política "public" permitindo tudo e erro 406
-- =============================================

-- Remover política problemática "public" se existir
DROP POLICY IF EXISTS "public" ON favoritos;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own favorites" ON favoritos;
DROP POLICY IF EXISTS "Users can create favorites" ON favoritos;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favoritos;
DROP POLICY IF EXISTS "Users can manage own favoritos" ON favoritos;

-- =============================================
-- NOVAS POLÍTICAS CORRETAS
-- =============================================

-- Usuários podem ver seus próprios favoritos
CREATE POLICY "Users can view own favorites" ON favoritos
    FOR SELECT 
    USING (auth.uid() = usuario_id);

-- Usuários podem criar favoritos
CREATE POLICY "Users can create favorites" ON favoritos
    FOR INSERT 
    WITH CHECK (auth.uid() = usuario_id);

-- Usuários podem deletar seus próprios favoritos
CREATE POLICY "Users can delete own favorites" ON favoritos
    FOR DELETE 
    USING (auth.uid() = usuario_id);

-- =============================================
-- VERIFICAÇÃO
-- =============================================
-- Execute este comando para verificar as políticas:
-- SELECT * FROM pg_policies WHERE tablename = 'favoritos';

