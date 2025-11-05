-- ============================================
-- Tabela de Configurações do Sistema
-- ============================================
-- Esta tabela armazena todas as configurações do sistema
-- para evitar valores hardcoded no código frontend
-- ============================================

-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave VARCHAR(255) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'string', -- string, number, boolean, json
    descricao TEXT,
    categoria VARCHAR(100) NOT NULL, -- supabase, cloudinary, pushinpay, n8n, pricing, limits
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca rápida por chave e categoria
CREATE INDEX IF NOT EXISTS idx_configuracoes_chave ON configuracoes(chave);
CREATE INDEX IF NOT EXISTS idx_configuracoes_categoria ON configuracoes(categoria);
CREATE INDEX IF NOT EXISTS idx_configuracoes_ativo ON configuracoes(ativo);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_configuracoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_configuracoes_updated_at ON configuracoes;
CREATE TRIGGER trigger_update_configuracoes_updated_at
    BEFORE UPDATE ON configuracoes
    FOR EACH ROW
    EXECUTE FUNCTION update_configuracoes_updated_at();

-- ============================================
-- Inserir configurações iniciais
-- ============================================

-- Configurações Supabase
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('supabase_url', 'https://svgmuxdxxrapepbodbgv.supabase.co', 'string', 'URL do projeto Supabase', 'supabase'),
('supabase_anon_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Z211eGR4eHJhcGVwYm9kYmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTU2MTQsImV4cCI6MjA3Njk5MTYxNH0.U0rQ8-EXC6b0dkcCQBoE-VuNjNgNQREvcs3fWfZ1UGM', 'string', 'Chave anônima do Supabase', 'supabase')
ON CONFLICT (chave) DO NOTHING;

-- Configurações Cloudinary
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('cloudinary_cloud_name', 'demv63uh4', 'string', 'Nome da cloud no Cloudinary', 'cloudinary'),
('cloudinary_upload_preset', 'produtos', 'string', 'Upload preset do Cloudinary', 'cloudinary')
ON CONFLICT (chave) DO NOTHING;

-- Configurações PushinPay
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('pushinpay_api_key_prod', '53083|94CNbHuMZhZMY1vbeyBzJ2GwBwuONhllGIbcXPFE674011cc', 'string', 'API Key de produção do PushinPay', 'pushinpay'),
('pushinpay_api_key_sandbox', '206|7mBYM3BZzBhSUJPQ2RYj1sYgu5Xdlc2vljjKgJTQ4df9cb3d', 'string', 'API Key de sandbox do PushinPay', 'pushinpay'),
('pushinpay_production', 'true', 'boolean', 'Usar ambiente de produção (true) ou sandbox (false) do PushinPay', 'pushinpay')
ON CONFLICT (chave) DO NOTHING;

-- Configurações N8N
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('n8n_pix_create_url', 'https://hooks.upcaodigital.com.br/webhook/criar-pix', 'string', 'URL do webhook n8n para criar PIX', 'n8n'),
('n8n_pix_check_url', 'https://hooks.upcaodigital.com.br/webhook/verificar-pix', 'string', 'URL do webhook n8n para verificar PIX', 'n8n'),
('n8n_webhook_url', 'https://hooks.upcaodigital.com.br/webhook/acheinailha', 'string', 'URL principal do webhook n8n', 'n8n')
ON CONFLICT (chave) DO NOTHING;

-- Configurações de Preços (Anúncios)
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('pricing_daily_price', '5.00', 'number', 'Preço diário para anúncios (R$)', 'pricing'),
('pricing_highlight_price', '8.90', 'number', 'Preço do destaque (R$)', 'pricing'),
('pricing_min_days', '3', 'number', 'Número mínimo de dias para publicação', 'pricing'),
('pricing_max_days', '30', 'number', 'Número máximo de dias para publicação', 'pricing'),
('pricing_max_price', '150.00', 'number', 'Preço máximo total (R$)', 'pricing'),
('pricing_recommended_days', '7', 'number', 'Número recomendado de dias', 'pricing')
ON CONFLICT (chave) DO NOTHING;

-- Configurações de Preços (Publicidades)
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('publicidade_plano_7_dias', '35.00', 'number', 'Preço do plano de 7 dias para publicidades (R$)', 'pricing'),
('publicidade_plano_15_dias', '75.00', 'number', 'Preço do plano de 15 dias para publicidades (R$)', 'pricing'),
('publicidade_plano_30_dias', '150.00', 'number', 'Preço do plano de 30 dias para publicidades (R$)', 'pricing'),
('publicidade_dias_min', '7', 'number', 'Número mínimo de dias para publicidades', 'pricing'),
('publicidade_dias_max', '30', 'number', 'Número máximo de dias para publicidades', 'pricing')
ON CONFLICT (chave) DO NOTHING;

-- Configurações de Limites
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('limits_max_images_per_ad', '10', 'number', 'Número máximo de imagens por anúncio', 'limits'),
('limits_max_banner_size_mb', '10', 'number', 'Tamanho máximo de banner em MB', 'limits'),
('limits_allowed_image_types', '["image/jpeg","image/jpg","image/png","image/gif","image/webp"]', 'json', 'Tipos de imagem permitidos', 'limits')
ON CONFLICT (chave) DO NOTHING;

-- ============================================
-- Políticas RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Política: Permitir leitura pública (apenas configurações ativas)
CREATE POLICY "Permitir leitura de configurações ativas"
ON configuracoes
FOR SELECT
USING (ativo = true);

-- Política: Apenas admins podem inserir/atualizar/deletar
CREATE POLICY "Apenas admins podem gerenciar configurações"
ON configuracoes
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM admin
        WHERE admin.id = auth.uid()
        AND admin.ativo = true
    )
);

-- ============================================
-- Função auxiliar para buscar configuração
-- ============================================

CREATE OR REPLACE FUNCTION get_config(chave_config VARCHAR)
RETURNS TEXT AS $$
DECLARE
    valor_config TEXT;
BEGIN
    SELECT valor INTO valor_config
    FROM configuracoes
    WHERE chave = chave_config
    AND ativo = true;
    
    RETURN valor_config;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Comentários
-- ============================================

COMMENT ON TABLE configuracoes IS 'Armazena todas as configurações do sistema para evitar valores hardcoded no código';
COMMENT ON COLUMN configuracoes.chave IS 'Chave única da configuração (ex: supabase_url)';
COMMENT ON COLUMN configuracoes.valor IS 'Valor da configuração (pode ser string, número, boolean ou JSON)';
COMMENT ON COLUMN configuracoes.tipo IS 'Tipo do valor: string, number, boolean, json';
COMMENT ON COLUMN configuracoes.categoria IS 'Categoria da configuração: supabase, cloudinary, pushinpay, n8n, pricing, limits';
COMMENT ON FUNCTION get_config IS 'Função auxiliar para buscar o valor de uma configuração por chave';

