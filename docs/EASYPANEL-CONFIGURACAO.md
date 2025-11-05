# 🚀 Configuração de URLs Curtas no Easypanel

Este guia explica como configurar URLs curtas/amigáveis para o projeto **Achei na Ilha** usando **Easypanel**.

## 📋 Pré-requisitos

- Projeto já configurado no Easypanel
- Acesso ao painel do Easypanel
- Domínio configurado (ex: `acheinailha.com.br`)

## 🔧 Método 1: Configuração Customizada no Easypanel (Recomendado)

### Passo 1: Acessar Configurações do Projeto

1. Acesse o painel do **Easypanel**
2. Selecione seu projeto **Achei na Ilha**
3. Vá em **Settings** (Configurações)
4. Procure por **"Custom Nginx Config"** ou **"Nginx Configuration"**

### Passo 2: Adicionar Configuração Customizada

1. Cole o conteúdo do arquivo `easypanel-nginx.conf` na área de configuração customizada
2. Clique em **Save** ou **Apply**

### Passo 3: Reiniciar o Serviço

1. Vá em **Deployments** ou **Services**
2. Clique em **Restart** ou **Redeploy**

## 🔧 Método 2: Arquivo de Configuração no Projeto

### Passo 1: Adicionar Arquivo ao Projeto

1. Adicione o arquivo `easypanel-nginx.conf` na raiz do seu projeto
2. Renomeie para `.nginx` (com o ponto no início)
3. Ou mantenha como `easypanel-nginx.conf` se o Easypanel suportar

### Passo 2: Verificar Configuração

O Easypanel geralmente detecta automaticamente arquivos de configuração Nginx customizados.

## 📝 URLs Mapeadas

Após a configuração, estas URLs estarão disponíveis:

| URL Curta | URL Completa |
|-----------|-------------|
| `/busca` | `/pages/property/busca.html` |
| `/detalhes` | `/pages/property/detalhes.html` |
| `/novo-anuncio` | `/pages/property/novo-anuncio.html` |
| `/login` | `/pages/auth/login.html` |
| `/cadastro` | `/pages/auth/cadastro.html` |
| `/confirmar-email` | `/pages/auth/confirmar-email.html` |
| `/meus-anuncios` | `/pages/user/meus-anuncios.html` |
| `/configuracoes` | `/pages/user/configuracoes.html` |
| `/escolha-plano` | `/pages/user/escolha-plano.html` |
| `/pagamento` | `/pages/payment/pagamento.html` |
| `/admin` | `/pages/admin/admin.html` |
| `/admin-login` | `/pages/admin/login.html` |

## ✅ Testar a Configuração

Após aplicar, teste acessando:

```bash
# Testar redirecionamento
curl -I https://acheinailha.com.br/busca

# Deve retornar:
# HTTP/1.1 301 Moved Permanently
# Location: /pages/property/busca.html
```

Ou acesse diretamente no navegador:
- `https://acheinailha.com.br/busca` ✅
- `https://acheinailha.com.br/login` ✅
- `https://acheinailha.com.br/admin` ✅

## 🔄 Redirecionamentos 301

As URLs antigas (`/pages/property/busca.html`) serão automaticamente redirecionadas para as novas (`/busca`) com código **301**, o que é importante para:
- **SEO**: Mantém o ranking das páginas
- **Compatibilidade**: Links antigos continuam funcionando
- **Limpeza**: URLs mais amigáveis

## 🐛 Troubleshooting

### URLs não funcionam

1. **Verifique se a configuração foi salva:**
   - Vá em Settings → Custom Nginx Config
   - Confirme que o conteúdo está lá

2. **Reinicie o serviço:**
   - Vá em Deployments → Restart

3. **Verifique os logs:**
   - Vá em Logs do projeto no Easypanel
   - Procure por erros do Nginx

### Erro 404

- Verifique se os caminhos dos arquivos estão corretos
- Confirme que os arquivos HTML existem no caminho especificado

### Redirecionamentos infinitos

- Verifique se não há conflito entre `rewrite` e `return`
- Certifique-se de que não há outras configurações conflitantes

## 📚 Alternativa: Configuração via Interface do Easypanel

Alguns Easypanel também permitem configurar rotas via interface:

1. Vá em **Routes** ou **Custom Routes**
2. Adicione cada rota:
   - **Path**: `/busca`
   - **Target**: `/pages/property/busca.html`
   - **Type**: `Rewrite` ou `Redirect`

Repita para todas as rotas listadas acima.

## 🔐 Notas Importantes

1. **Cache**: A configuração inclui cache para arquivos estáticos (CSS, JS, imagens)
2. **HTML sem cache**: Arquivos HTML não têm cache para garantir atualizações imediatas
3. **Segurança**: A configuração não inclui regras de segurança específicas - adicione conforme necessário

## 📞 Suporte

Se tiver problemas, verifique:
- Documentação do Easypanel: https://easypanel.io/docs
- Logs do Nginx no painel do Easypanel
- Status do serviço no Easypanel

