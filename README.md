<div align="center">

# 🏝️ Achei na Ilha

![Logo](assets/images/logo-achei-na-ilha.png)

**Plataforma completa para busca, anúncio e gestão de imóveis na Ilha**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Tecnologia](https://img.shields.io/badge/tech-html%2Fcss%2Fjs-blue.svg)]()
[![Banco de Dados](https://img.shields.io/badge/database-supabase-green.svg)]()

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
- **PushinPay PIX** - Gateway de pagamento
- **Cloudinary** - Upload e armazenamento de imagens
- **n8n** - Automação de workflows (webhooks)

---

## 📁 Estrutura do Projeto

```
achei-na-ilha/
├── 📄 index.html                    # Página inicial
├── 📁 assets/                       # Recursos estáticos
│   ├── 📁 css/
│   │   └── header.css              # Estilos do header
│   ├── 📁 js/
│   │   ├── supabase-config.js      # Configuração Supabase
│   │   ├── supabase-auth-service.js # Serviço de autenticação
│   │   └── header-auth.js          # Autenticação do header
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
│   ├── rls-policies.sql            # Políticas RLS
│   ├── migration-pagamento-por-anuncio.sql
│   ├── auto-pausar-anuncios-expirados.sql
│   └── ...
└── 📁 docs/                        # Documentação
    ├── INTEGRACAO-PUSHINPAY-PIX.md
    ├── ESPECIFICACOES_PUBLICIDADES.md
    ├── HEADER_USAGE.md
    └── ...
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
   - Configure suas credenciais do Supabase
   - Execute os scripts SQL em `sql/` no Supabase

3. **Configure as Integrações**
   - PushinPay: Configure API key em `pages/payment/pagamento.html`
   - Cloudinary: Configure em `pages/admin/admin.html`
   - n8n: Configure webhook URL

4. **Abra no navegador**
   - Abra `index.html` no navegador
   - Ou use um servidor local (Live Server, Python HTTP Server, etc.)

---

## 📚 Documentação

### **Documentação Técnica**
- [📖 Integração PushinPay PIX](docs/INTEGRACAO-PUSHINPAY-PIX.md) - Guia completo de pagamentos
- [📐 Especificações de Publicidades](docs/ESPECIFICACOES_PUBLICIDADES.md) - Tamanhos e formatos
- [🔧 Uso do Header](docs/HEADER_USAGE.md) - Componente header

### **Scripts SQL**
- [🗄️ Database Setup](sql/database_setup.sql) - Schema completo
- [🔐 RLS Policies](sql/rls-policies.sql) - Políticas de segurança
- [💰 Migração Pagamento](sql/migration-pagamento-por-anuncio.sql) - Sistema de pagamento

---

## 🎯 Principais Recursos

### **Sistema de Autenticação**
- Login e cadastro de usuários
- Tipos: Visitante e Anunciante
- Autenticação via Supabase Auth
- Header dinâmico baseado no status

### **Gestão de Imóveis**
- Busca avançada com filtros
- Criação de anúncios completos
- Upload de múltiplas imagens
- Sistema de destaque
- Controle de publicação e expiração

### **Sistema de Pagamento**
- Pagamento via PIX com QR Code
- Cálculo por dias de publicação
- Verificação automática
- Integração com webhooks

### **Publicidades**
- Banners principais (slider)
- Gestão administrativa
- Controle de aprovação
- Expiração automática

---

## 🔒 Segurança

- **Row Level Security (RLS)** no Supabase
- **Autenticação** via Supabase Auth
- **Validação** de dados no frontend e backend
- **Sanitização** de inputs para prevenir XSS

---

## 📱 Design Responsivo

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 **Mobile** (smartphones)
- 📱 **Tablet**
- 💻 **Desktop**

---

## 🧪 Testes

Para testar o sistema:
1. Abra `index.html` no navegador
2. Navegue pelas páginas
3. Teste criação de anúncios
4. Teste sistema de pagamento (sandbox)
5. Verifique funcionalidades administrativas

---

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Mantenha a estrutura de pastas
2. Siga os padrões de código
3. Documente alterações importantes
4. Teste antes de submeter

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
