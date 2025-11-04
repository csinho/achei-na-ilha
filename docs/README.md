# 🏝️ Buscas da Ilha - Sistema de Imóveis

Sistema web para busca e anúncio de imóveis na ilha, desenvolvido com HTML, CSS e JavaScript.

## 📁 Estrutura do Projeto

```
busca-na-ilha/
├── 📄 index.html                    # Página inicial
├── 📁 assets/                       # Recursos estáticos
│   ├── 📁 css/                      # Estilos CSS
│   │   └── header.css              # Estilos do header centralizado
│   ├── 📁 js/                       # Scripts JavaScript
│   │   ├── header-auth.js          # Autenticação do header
│   │   └── auth.js                 # Autenticação geral
│   └── 📁 images/                   # Imagens e ícones
├── 📁 components/                   # Componentes reutilizáveis
│   └── header-component.html       # Componente do header
├── 📁 pages/                        # Páginas do sistema
│   ├── 📁 auth/                     # Autenticação
│   │   ├── login.html              # Página de login
│   │   └── cadastro.html           # Página de cadastro
│   ├── 📁 property/                 # Propriedades/Imóveis
│   │   ├── busca.html              # Página de busca
│   │   ├── novo-anuncio.html       # Criar anúncio
│   │   └── detalhes.html           # Detalhes do imóvel
│   ├── 📁 user/                     # Área do usuário
│   │   ├── meus-anuncios.html      # Meus anúncios
│   │   ├── configuracoes.html      # Configurações
│   │   └── escolha-plano.html      # Escolher plano
│   └── 📁 admin/                    # Área administrativa
│       └── admin.html              # Painel admin
├── 📁 docs/                         # Documentação
│   ├── README.md                   # Este arquivo
│   ├── HEADER_USAGE.md             # Guia do header
│   ├── prd.md                      # Product Requirements
│   ├── modelagem_banco_de_dados.md # Modelagem do banco
│   ├── planejamento_interfaces.md  # Planejamento das interfaces
│   ├── gerador_estilo.md           # Gerador de estilos
│   └── test-*.html                 # Arquivos de teste
└── 📄 update-paths.js              # Script de atualização de caminhos
```

## 🚀 Funcionalidades

### 🔐 **Sistema de Autenticação**
- **Login/Cadastro** de usuários
- **Tipos de usuário:** Visitante e Anunciante
- **Header dinâmico** baseado no status de login
- **Menu dropdown** com opções de conta e logout

### 🏠 **Gestão de Imóveis**
- **Busca avançada** com filtros
- **Criação de anúncios** para anunciantes
- **Visualização de detalhes** dos imóveis
- **Gestão de anúncios** próprios

### 👤 **Área do Usuário**
- **Meus anúncios** - gerenciar propriedades
- **Configurações** - dados pessoais
- **Escolha de planos** - para anunciantes

### ⚙️ **Administração**
- **Painel admin** - gestão do sistema
- **Estatísticas** e relatórios
- **Gestão de usuários** e anúncios

## 🎨 **Design System**

### **Header Centralizado**
- **Componente reutilizável** em todas as páginas
- **Autenticação automática** baseada em localStorage
- **Menu dropdown** no avatar do usuário
- **Botão flutuante** "Anunciar" para anunciantes

### **Layout Responsivo**
- **Mobile-first** design
- **Grid system** para propriedades
- **Sidebar** com filtros (página de busca)
- **Cards** para exibição de imóveis

### **Cores e Tipografia**
- **Azul principal:** #0077B6
- **Vermelho logout:** #dc3545
- **Cinza texto:** #333
- **Fonte:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

## 🛠️ **Tecnologias Utilizadas**

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e responsividade
- **JavaScript ES6+** - Funcionalidades dinâmicas
- **LocalStorage** - Persistência de dados
- **Fetch API** - Carregamento de componentes

## 📱 **Páginas do Sistema**

### **Públicas**
- **`index.html`** - Página inicial com busca
- **`pages/auth/login.html`** - Login de usuários
- **`pages/auth/cadastro.html`** - Cadastro de usuários

### **Propriedades**
- **`pages/property/busca.html`** - Busca de imóveis
- **`pages/property/novo-anuncio.html`** - Criar anúncio
- **`pages/property/detalhes.html`** - Detalhes do imóvel

### **Usuário**
- **`pages/user/meus-anuncios.html`** - Gerenciar anúncios
- **`pages/user/configuracoes.html`** - Configurações
- **`pages/user/escolha-plano.html`** - Escolher plano

### **Administração**
- **`pages/admin/admin.html`** - Painel administrativo

## 🔧 **Como Usar**

### **1. Estrutura de Arquivos**
- Todos os arquivos estão organizados em pastas por funcionalidade
- **Assets** (CSS, JS, imagens) na pasta `assets/`
- **Componentes** reutilizáveis na pasta `components/`
- **Páginas** organizadas por módulo em `pages/`

### **2. Header Centralizado**
- **CSS:** `assets/css/header.css`
- **Componente:** `components/header-component.html`
- **JavaScript:** `assets/js/header-auth.js`

### **3. Navegação**
- Todos os links foram atualizados para a nova estrutura
- **Script de atualização:** `update-paths.js`

## 🧪 **Testes**

### **Arquivos de Teste**
- **`docs/test-header.html`** - Teste do header
- **`docs/test-dropdown.html`** - Teste do dropdown
- **`docs/test-layout.html`** - Teste do layout
- **`docs/test-final.html`** - Teste completo

### **Como Testar**
1. Abra qualquer arquivo de teste no navegador
2. Verifique se o header carrega corretamente
3. Teste as funcionalidades de autenticação
4. Verifique o layout responsivo

## 📚 **Documentação**

- **`docs/HEADER_USAGE.md`** - Guia completo do header
- **`docs/prd.md`** - Requisitos do produto
- **`docs/modelagem_banco_de_dados.md`** - Modelagem do banco
- **`docs/planejamento_interfaces.md`** - Planejamento das interfaces

## 🎯 **Próximos Passos**

1. **Implementar backend** com banco de dados
2. **Adicionar upload** de imagens
3. **Sistema de pagamentos** para planos
4. **Notificações** em tempo real
5. **API REST** para integração

## 👥 **Contribuição**

Para contribuir com o projeto:
1. Mantenha a estrutura de pastas
2. Use o header centralizado
3. Siga os padrões de CSS e JavaScript
4. Teste as funcionalidades

---

**🏝️ Buscas da Ilha - Conectando você com o imóvel perfeito!**