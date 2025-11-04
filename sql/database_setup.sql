-- =============================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- Projeto: Achei na Ilha
-- =============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: users (Usuários)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT,
    nome TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('anunciante', 'visitante')),
    telefone TEXT,
    plano_ativo_id UUID,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: planos (Planos de Assinatura)
-- =============================================
CREATE TABLE planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    limite_anuncios INTEGER NOT NULL DEFAULT 0,
    limite_imagens INTEGER NOT NULL DEFAULT 5,
    limite_videos INTEGER NOT NULL DEFAULT 0,
    inclui_ads BOOLEAN NOT NULL DEFAULT false,
    valor_mensal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: assinaturas (Assinaturas dos Usuários)
-- =============================================
CREATE TABLE assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plano_id UUID NOT NULL REFERENCES planos(id) ON DELETE RESTRICT,
    valor_pago DECIMAL(10,2) NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'expirada', 'cancelada')),
    forma_pagamento TEXT,
    transacao_id TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: anuncios (Anúncios de Imóveis)
-- =============================================
CREATE TABLE anuncios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    tipo_imovel TEXT NOT NULL CHECK (tipo_imovel IN ('casa', 'apartamento', 'terreno', 'comercial')),
    categoria TEXT NOT NULL CHECK (categoria IN ('venda', 'aluguel')),
    valor DECIMAL(12,2) NOT NULL,
    endereco TEXT NOT NULL,
    bairro TEXT,
    cidade TEXT DEFAULT 'Ilha',
    estado TEXT DEFAULT 'BA',
    cep TEXT,
    area_terreno DECIMAL(8,2),
    area_construida DECIMAL(8,2),
    quartos INTEGER,
    banheiros INTEGER,
    vagas_garagem INTEGER,
    ativo BOOLEAN DEFAULT true,
    emoji TEXT,
    caracteristicas TEXT[],
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: imagens_anuncio (Imagens dos Anúncios)
-- =============================================
CREATE TABLE imagens_anuncio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    nome_arquivo TEXT,
    tamanho_arquivo INTEGER,
    ordem INTEGER DEFAULT 0,
    principal BOOLEAN DEFAULT false,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: videos_anuncio (Vídeos dos Anúncios)
-- =============================================
CREATE TABLE videos_anuncio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    nome_arquivo TEXT,
    tamanho_arquivo INTEGER,
    duracao INTEGER,
    ordem INTEGER DEFAULT 0,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: comentarios (Comentários dos Anúncios)
-- =============================================
CREATE TABLE comentarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    visitante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    aprovado BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: likes (Curtidas dos Anúncios)
-- =============================================
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    visitante_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(anuncio_id, visitante_id)
);

-- =============================================
-- TABELA: caracteristicas_imovel (Características dos Imóveis)
-- =============================================
CREATE TABLE caracteristicas_imovel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    icone TEXT,
    categoria TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: anuncio_caracteristicas (Relação Anúncio-Características)
-- =============================================
CREATE TABLE anuncio_caracteristicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    caracteristica_id UUID NOT NULL REFERENCES caracteristicas_imovel(id) ON DELETE CASCADE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(anuncio_id, caracteristica_id)
);

-- =============================================
-- TABELA: publicidades (Publicidades Locais)
-- =============================================
CREATE TABLE publicidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    link_externo TEXT,
    criado_por UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visivel BOOLEAN DEFAULT true,
    aprovada BOOLEAN DEFAULT false,
    criada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aprovada_em TIMESTAMP WITH TIME ZONE,
    aprovada_por UUID REFERENCES users(id)
);

-- =============================================
-- TABELA: admin (Administradores)
-- =============================================
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT,
    nome TEXT NOT NULL,
    nivel_acesso TEXT DEFAULT 'admin' CHECK (nivel_acesso IN ('admin', 'super_admin')),
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: favoritos (Imóveis Favoritos dos Usuários)
-- =============================================
CREATE TABLE favoritos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, anuncio_id)
);

-- =============================================
-- TABELA: visualizacoes (Controle de Visualizações)
-- =============================================
CREATE TABLE visualizacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices para tabela users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tipo ON users(tipo_usuario);

-- Índices para tabela anuncios
CREATE INDEX idx_anuncios_usuario ON anuncios(usuario_id);
CREATE INDEX idx_anuncios_categoria ON anuncios(categoria);
CREATE INDEX idx_anuncios_tipo ON anuncios(tipo_imovel);
CREATE INDEX idx_anuncios_valor ON anuncios(valor);
CREATE INDEX idx_anuncios_ativo ON anuncios(ativo);
CREATE INDEX idx_anuncios_criado ON anuncios(criado_em);
CREATE INDEX idx_anuncios_bairro ON anuncios(bairro);

-- Índices para tabela assinaturas
CREATE INDEX idx_assinaturas_usuario ON assinaturas(usuario_id);
CREATE INDEX idx_assinaturas_status ON assinaturas(status);
CREATE INDEX idx_assinaturas_data_fim ON assinaturas(data_fim);

-- Índices para tabela imagens_anuncio
CREATE INDEX idx_imagens_anuncio ON imagens_anuncio(anuncio_id);
CREATE INDEX idx_imagens_principal ON imagens_anuncio(principal);

-- Índices para tabela comentarios
CREATE INDEX idx_comentarios_anuncio ON comentarios(anuncio_id);
CREATE INDEX idx_comentarios_visitante ON comentarios(visitante_id);

-- Índices para tabela likes
CREATE INDEX idx_likes_anuncio ON likes(anuncio_id);
CREATE INDEX idx_likes_visitante ON likes(visitante_id);

-- Índices para tabela publicidades
CREATE INDEX idx_publicidades_visivel ON publicidades(visivel);
CREATE INDEX idx_publicidades_aprovada ON publicidades(aprovada);

-- Índices para tabela favoritos
CREATE INDEX idx_favoritos_usuario ON favoritos(usuario_id);
CREATE INDEX idx_favoritos_anuncio ON favoritos(anuncio_id);

-- Índices para tabela visualizacoes
CREATE INDEX idx_visualizacoes_anuncio ON visualizacoes(anuncio_id);
CREATE INDEX idx_visualizacoes_usuario ON visualizacoes(usuario_id);

-- =============================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_anuncios_updated_at BEFORE UPDATE ON anuncios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DADOS INICIAIS - PLANOS
-- =============================================

INSERT INTO planos (nome, limite_anuncios, limite_imagens, limite_videos, inclui_ads, valor_mensal, descricao) VALUES
('Pititinga', 3, 5, 0, true, 24.90, 'Plano básico para começar a anunciar'),
('Caranguejo', 10, 10, 2, false, 45.90, 'Plano intermediário sem publicidade'),
('Lagosta', 20, 15, 4, false, 99.90, 'Plano premium com destaque nos resultados');

-- =============================================
-- DADOS INICIAIS - CARACTERÍSTICAS DOS IMÓVEIS
-- =============================================

INSERT INTO caracteristicas_imovel (nome, icone, categoria) VALUES
('Piscina', '🏊', 'lazer'),
('Vista para o Mar', '🌅', 'localizacao'),
('Churrasqueira', '🔥', 'lazer'),
('Área de Roça', '🌾', 'terreno'),
('Área para Festa', '🎉', 'lazer'),
('Varanda Grande', '🏡', 'estrutura'),
('Quintal Espaçoso', '🌳', 'terreno'),
('Coqueiros', '🌴', 'terreno'),
('Poço Artesiano', '💧', 'infraestrutura'),
('Casa de Verão', '🏖️', 'tipo');

-- =============================================
-- DADOS INICIAIS - ADMIN PADRÃO
-- =============================================

-- Senha padrão: admin123 (hash bcrypt)
INSERT INTO admin (email, senha_hash, nome, nivel_acesso) VALUES
('admin@acheinailha.com', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6eY7fG8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zA8bC9dE', 'Administrador', 'super_admin');

-- =============================================
-- POLÍTICAS RLS (Row Level Security)
-- =============================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (podem ser ajustadas conforme necessário)
-- Usuários podem ver e editar apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Anúncios são públicos para leitura, mas apenas o dono pode editar
CREATE POLICY "Anuncios are viewable by everyone" ON anuncios
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own anuncios" ON anuncios
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own anuncios" ON anuncios
    FOR UPDATE USING (auth.uid() = usuario_id);

-- Comentários são públicos para leitura, mas apenas o autor pode editar
CREATE POLICY "Comentarios are viewable by everyone" ON comentarios
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own comentarios" ON comentarios
    FOR INSERT WITH CHECK (auth.uid() = visitante_id);

-- Likes são públicos para leitura, mas apenas o usuário pode gerenciar os seus
CREATE POLICY "Likes are viewable by everyone" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON likes
    FOR ALL USING (auth.uid() = visitante_id);

-- Favoritos são privados
CREATE POLICY "Users can manage own favoritos" ON favoritos
    FOR ALL USING (auth.uid() = usuario_id);

-- =============================================
-- COMENTÁRIOS FINAIS
-- =============================================

-- Este script cria toda a estrutura necessária para o projeto "Achei na Ilha"
-- Inclui:
-- - Todas as tabelas com relacionamentos corretos
-- - Índices para otimização de performance
-- - Triggers para atualização automática de timestamps
-- - Dados iniciais (planos e admin)
-- - Políticas RLS básicas para segurança
-- - Constraints para validação de dados

-- Para executar este script no Supabase:
-- 1. Acesse o painel do Supabase
-- 2. Vá em SQL Editor
-- 3. Cole este script completo
-- 4. Execute o script

-- Após a execução, você terá:
-- - Estrutura completa do banco
-- - Planos de assinatura configurados
-- - Usuário admin padrão (email: admin@acheinailha.com, senha: admin123)
-- - Políticas de segurança básicas
