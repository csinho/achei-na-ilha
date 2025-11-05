<div align="center">

# 🏝️ Achei na Ilha

![Logo](assets/images/logo-achei-na-ilha.png)

**Plataforma completa para busca, anúncio e gestão de imóveis na Ilha**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Tecnologia](https://img.shields.io/badge/tech-html%2Fcss%2Fjs-blue.svg)]()
[![Banco de Dados](https://img.shields.io/badge/database-supabase-green.svg)]()
[![Deploy](https://img.shields.io/badge/deploy-easypanel-orange.svg)]()

</div>

---

## 📖 Sobre o Projeto

**Achei na Ilha** é uma plataforma web moderna desenvolvida para conectar moradores e visitantes da ilha com oportunidades de compra ou aluguel de imóveis. O sistema oferece uma solução completa para:

- 🏠 **Buscar imóveis** com filtros avançados
- 📝 **Anunciar propriedades** de forma simples e rápida
- 💰 **Sistema de pagamento** via PIX integrado
- 📢 **Publicidades locais** para comércios da região
- 👥 **Gestão completa** de usuários e anúncios

---

## ✨ Funcionalidades Principais

### 🔍 **Busca de Imóveis**
- Busca avançada com múltiplos filtros
- Filtros por tipo, categoria, localização, preço e características
- Visualização em cards e listagem detalhada
- Integração com publicidades no meio dos resultados

### 📝 **Gestão de Anúncios**
- Criação de anúncios com múltiplas imagens
- Destaque de anúncios para maior visibilidade
- Controle de publicação e expiração
- Sistema de rascunhos

### 💳 **Sistema de Pagamento**
- Pagamento via **PIX** com QR Code
- Cálculo dinâmico por dias de publicação
- Verificação automática de pagamento
- Integração com **PushinPay** e **n8n**

### 📢 **Sistema de Publicidades**
- Banners principais (slider central)
- Gestão completa de publicidades
- Controle de aprovação e visibilidade
- Expiração automática

### 👤 **Área do Usuário**
- Painel de controle pessoal
- Gestão de anúncios próprios
- Configurações de perfil
- Histórico de pagamentos

### ⚙️ **Painel Administrativo**
- Gestão completa de publicidades
- Estatísticas do sistema
- Aprovação de publicidades
- Controle de pagamentos
- **Gestão de configurações do sistema** (preços, limites, integrações)
- **Configuração de ambiente** (produção/sandbox)

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilos modernos e responsivos
- **JavaScript ES6+** - Funcionalidades dinâmicas
- **QRCode.js** - Geração de QR Codes para PIX

### **Backend & Banco de Dados**
- **Supabase** - Backend as a Service
  - PostgreSQL como banco de dados
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Autenticação integrada

### **Integrações**
- **PushinPay PIX** - Gateway de pagamento (produção/sandbox)
- **Cloudinary** - Upload e armazenamento de imagens
- **n8n** - Automação de workflows (webhooks)

### **Infraestrutura & Deploy**
- **Easypanel** - Plataforma de deploy e gerenciamento
- **Nginx** - Servidor web com URLs curtas/amigáveis
- **Configurações centralizadas** - Banco de dados (sem valores hardcoded)

---

## 📁 Estrutura do Projeto

```
achei-na-ilha/
├── 📄 index.html                    # Página inicial
├── 📁 assets/                       # Recursos estáticos
│   ├── 📁 css/
│   │   └── header.css              # Estilos do header
│   ├── 📁 js/
│   │   ├── supabase-config.js      # Configuração Supabase (únicos tokens hardcoded)
│   │   ├── supabase-auth-service.js # Serviço de autenticação
│   │   ├── config-service.js       # Serviço de configurações centralizadas
│   │   ├── header-auth.js          # Autenticação do header
│   │   └── toast.js                # Sistema de notificações
│   └── 📁 images/
│       └── logo-achei-na-ilha.png  # Logo do sistema
├── 📁 components/                   # Componentes reutilizáveis
│   └── header-component.html       # Componente do header
├── 📁 pages/                        # Páginas do sistema
│   ├── 📁 auth/                    # Autenticação
│   │   ├── login.html
│   │   └── cadastro.html
│   ├── 📁 property/                # Propriedades/Imóveis
│   │   ├── busca.html              # Busca de imóveis
│   │   ├── novo-anuncio.html       # Criar anúncio
│   │   └── detalhes.html           # Detalhes do imóvel
│   ├── 📁 user/                    # Área do usuário
│   │   ├── meus-anuncios.html
│   │   ├── configuracoes.html
│   │   ├── escolha-plano.html
│   │   └── ...
│   ├── 📁 admin/                   # Administração
│   │   ├── admin.html              # Painel admin
│   │   └── login.html              # Login admin
│   └── 📁 payment/                 # Pagamentos
│       └── pagamento.html          # Página de pagamento PIX
├── 📁 sql/                         # Scripts SQL
│   ├── database_setup.sql          # Schema principal
│   ├── create-configuracoes-table.sql # Tabela de configurações centralizadas
│   ├── rls-policies.sql            # Políticas RLS
│   ├── migration-pagamento-por-anuncio.sql
│   ├── auto-pausar-anuncios-expirados.sql
│   └── ...
├── 📁 docs/                        # Documentação
│   ├── INTEGRACAO-PUSHINPAY-PIX.md
│   ├── ESPECIFICACOES_PUBLICIDADES.md
│   ├── HEADER_USAGE.md
│   ├── EASYPANEL-CONFIGURACAO.md   # Configuração Easypanel
│   ├── NGINX-URLS-CURTAS.md        # URLs curtas/amigáveis
│   └── ...
├── 📄 .nginx                       # Configuração Nginx para Easypanel
├── 📄 _redirects                   # Redirecionamentos (Netlify)
└── 📄 vercel.json                  # Configuração Vercel
```

---

## 🚀 Como Começar

### **Pré-requisitos**
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conta no Supabase
- Conta no PushinPay (para pagamentos)
- Conta no Cloudinary (para upload de imagens)

### **Instalação**

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd achei-na-ilha
   ```

2. **Configure o Supabase**
   - Acesse o arquivo `assets/js/supabase-config.js`
   - Configure suas credenciais do Supabase (URL e anonKey)
   - Execute os scripts SQL em `sql/` no Supabase
   - **Importante**: Execute `create-configuracoes-table.sql` para configurar o sistema

3. **Configure as Integrações no Banco de Dados**
   - Acesse o painel administrativo (`/admin`)
   - Vá em "Configurações do Sistema"
   - Configure todas as integrações:
     - PushinPay (API keys de produção e sandbox)
     - URLs do n8n (webhooks)
     - Cloudinary (cloud name e upload preset)
     - Preços e limites do sistema
   - **Nota**: Todas as configurações são salvas no banco de dados, não há valores hardcoded

4. **Configure URLs Curtas (Opcional - Easypanel)**
   - O arquivo `.nginx` já está configurado
   - O Easypanel detecta automaticamente ao fazer deploy
   - URLs disponíveis: `/busca`, `/login`, `/admin`, etc.

5. **Abra no navegador**
   - Abra `index.html` no navegador
   - Ou use um servidor local (Live Server, Python HTTP Server, etc.)
   - Para produção: Faça deploy no Easypanel

---

## 📚 Documentação

### **Documentação Técnica**
- [📖 Integração PushinPay PIX](docs/INTEGRACAO-PUSHINPAY-PIX.md) - Guia completo de pagamentos
- [📐 Especificações de Publicidades](docs/ESPECIFICACOES_PUBLICIDADES.md) - Tamanhos e formatos
- [🔧 Uso do Header](docs/HEADER_USAGE.md) - Componente header
- [🚀 Configuração Easypanel](docs/EASYPANEL-CONFIGURACAO.md) - Deploy e configuração
- [🔗 URLs Curtas/Amigáveis](docs/NGINX-URLS-CURTAS.md) - Configuração de rotas

### **Scripts SQL**
- [🗄️ Database Setup](sql/database_setup.sql) - Schema completo
- [⚙️ Configurações Centralizadas](sql/create-configuracoes-table.sql) - Sistema de configurações
- [🔐 RLS Policies](sql/rls-policies.sql) - Políticas de segurança
- [💰 Migração Pagamento](sql/migration-pagamento-por-anuncio.sql) - Sistema de pagamento

---

## 🎯 Principais Recursos

### **Sistema de Autenticação**
- Login e cadastro de usuários
- Tipos: Visitante e Anunciante
- Autenticação via Supabase Auth
- Header dinâmico baseado no status
- Real-time updates

### **Gestão de Imóveis**
- Busca avançada com filtros
- Criação de anúncios completos
- Upload de múltiplas imagens (Cloudinary)
- Sistema de destaque
- Controle de publicação e expiração
- Comentários e likes em tempo real
- Auto-pausa de anúncios expirados

### **Sistema de Pagamento**
- Pagamento via PIX com QR Code
- Cálculo por dias de publicação
- Verificação automática de pagamento
- Integração com PushinPay e n8n
- Suporte a produção e sandbox
- Planos fixos: 7, 15 ou 30 dias

### **Publicidades**
- Banners principais (slider)
- Gestão administrativa completa
- Controle de aprovação
- Expiração automática
- Múltiplos banners por publicidade

### **Sistema de Configurações Centralizadas** 🆕
- **Todas as configurações no banco de dados**
- Gestão via painel administrativo
- Sem valores hardcoded (apenas tokens Supabase)
- Configurações incluem:
  - Preços e limites
  - API keys (PushinPay)
  - URLs de webhooks (n8n)
  - Configurações Cloudinary
  - Ambiente (produção/sandbox)
- Atualizações em tempo real via Supabase Realtime

### **URLs Curtas/Amigáveis** 🆕
- URLs limpas: `/busca`, `/login`, `/admin`
- Redirecionamentos 301 (SEO-friendly)
- Configuração automática via Easypanel
- Suporte a múltiplas plataformas (Nginx, Vercel, Netlify)

---

## 🔒 Segurança

- **Row Level Security (RLS)** no Supabase
- **Autenticação** via Supabase Auth
- **Validação** de dados no frontend e backend
- **Sanitização** de inputs para prevenir XSS
- **Configurações centralizadas** - Sem valores sensíveis no código
- **Tokens apenas em arquivo dedicado** - `supabase-config.js`
- **Ambiente separado** - Produção e sandbox configuráveis

---

## 📱 Design Responsivo

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 **Mobile** (smartphones)
- 📱 **Tablet**
- 💻 **Desktop**

## ⚡ Recursos Avançados

### **Real-time Updates**
- Atualizações automáticas de anúncios
- Comentários e likes em tempo real
- Sincronização de publicidades
- Atualização de configurações sem reload

### **Performance**
- Cache de configurações
- Lazy loading de imagens
- Otimização de queries
- Compressão de assets

### **SEO & URLs**
- URLs amigáveis e curtas
- Redirecionamentos 301
- Meta tags otimizadas
- Sitemap dinâmico

---

## 🧪 Testes

Para testar o sistema:
1. Abra `index.html` no navegador
2. Navegue pelas páginas
3. Teste criação de anúncios
4. Teste sistema de pagamento (sandbox)
5. Verifique funcionalidades administrativas
6. Teste URLs curtas: `/busca`, `/login`, `/admin`
7. Verifique atualizações em tempo real

## 🚀 Deploy

### **Easypanel (Recomendado)**

1. **Configure o projeto no Easypanel**
2. **Faça deploy do código**
3. **O arquivo `.nginx` será detectado automaticamente**
4. **Configure o domínio no Easypanel**
5. **Acesse as URLs curtas**: `https://seu-dominio.com.br/busca`

### **Outras Plataformas**

- **Vercel**: Use `vercel.json`
- **Netlify**: Use `_redirects`
- **Nginx standalone**: Use `nginx-config.conf`

Veja a documentação completa em `docs/EASYPANEL-CONFIGURACAO.md`

---

## ⚠️ Importante

### **Configurações do Sistema**

**TODAS as configurações devem ser feitas no banco de dados via painel administrativo**, não editando arquivos JavaScript.

- ✅ **Correto**: Configurar via `/admin` → "Configurações do Sistema"
- ❌ **Incorreto**: Editar valores em arquivos `.html` ou `.js`

**Único arquivo com valores hardcoded permitidos:**
- `assets/js/supabase-config.js` - Apenas tokens do Supabase (necessário para conectar ao banco)

### **Estrutura de Configurações**

Todas as configurações são armazenadas na tabela `configuracoes`:
- Preços e limites
- API keys (PushinPay, Cloudinary)
- URLs de webhooks (n8n)
- Flags de ambiente (produção/sandbox)

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Mantenha a estrutura de pastas
2. Siga os padrões de código
3. **Nunca adicione valores hardcoded** - use o sistema de configurações
4. Documente alterações importantes
5. Teste antes de submeter
6. Verifique atualizações em tempo real

---

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte a documentação em `docs/`
- Verifique os scripts SQL em `sql/`
- Revise a documentação de integrações

---

## 📄 Licença

Este projeto é proprietário e confidencial.

---

<div align="center">

**Desenvolvido com ❤️ para a Ilha**

🏝️ **Achei na Ilha** - Conectando você com o imóvel perfeito!

</div>
