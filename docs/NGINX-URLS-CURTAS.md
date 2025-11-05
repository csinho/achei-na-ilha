# 🔗 Configuração de URLs Curtas no Nginx

Este documento explica como configurar URLs curtas/amigáveis para o projeto **Achei na Ilha** usando Nginx.

## 📋 URLs Mapeadas

### Property (Propriedades)
- `/busca` → `/pages/property/busca.html`
- `/detalhes` → `/pages/property/detalhes.html`
- `/novo-anuncio` → `/pages/property/novo-anuncio.html`

### Auth (Autenticação)
- `/login` → `/pages/auth/login.html`
- `/cadastro` → `/pages/auth/cadastro.html`
- `/confirmar-email` → `/pages/auth/confirmar-email.html`

### User (Usuário)
- `/meus-anuncios` → `/pages/user/meus-anuncios.html`
- `/configuracoes` → `/pages/user/configuracoes.html`
- `/escolha-plano` → `/pages/user/escolha-plano.html`

### Payment (Pagamento)
- `/pagamento` → `/pages/payment/pagamento.html`

### Admin (Administração)
- `/admin` → `/pages/admin/admin.html`
- `/admin-login` → `/pages/admin/login.html`

## 🚀 Como Aplicar a Configuração

### Opção 1: Nginx Standalone

1. **Copiar o arquivo de configuração:**
   ```bash
   sudo cp nginx-config.conf /etc/nginx/sites-available/acheinailha
   ```

2. **Criar link simbólico:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/acheinailha /etc/nginx/sites-enabled/
   ```

3. **Ajustar o caminho raiz:**
   Edite `/etc/nginx/sites-available/acheinailha` e altere:
   ```nginx
   root /var/www/acheinailha;  # Ajuste para o caminho real do seu projeto
   ```

4. **Testar a configuração:**
   ```bash
   sudo nginx -t
   ```

5. **Recarregar o Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

### Opção 2: Docker (se usar Docker)

1. **Copiar o arquivo de configuração para o container:**
   ```bash
   docker cp nginx-config.conf container_name:/etc/nginx/conf.d/default.conf
   ```

2. **Recarregar Nginx no container:**
   ```bash
   docker exec container_name nginx -s reload
   ```

### Opção 3: Cloudflare Pages / Netlify / Vercel

Se você usar serviços de hospedagem estática, precisará configurar redirecionamentos no painel deles:

#### Cloudflare Pages
1. Vá em **Pages** → Seu projeto → **Settings** → **Functions**
2. Adicione redirecionamentos em `_redirects` ou `vercel.json`

#### Netlify
Crie um arquivo `_redirects` na raiz do projeto:
```
/busca /pages/property/busca.html 200
/detalhes /pages/property/detalhes.html 200
/login /pages/auth/login.html 200
# ... (adicionar todas as rotas)
```

#### Vercel
Crie um arquivo `vercel.json` na raiz do projeto:
```json
{
  "rewrites": [
    { "source": "/busca", "destination": "/pages/property/busca.html" },
    { "source": "/detalhes", "destination": "/pages/property/detalhes.html" },
    { "source": "/login", "destination": "/pages/auth/login.html" }
    // ... (adicionar todas as rotas)
  ]
}
```

## 🔄 Redirecionamentos 301 (SEO)

O arquivo de configuração inclui redirecionamentos 301 das URLs antigas para as novas, o que é importante para:
- **SEO**: Mantém o ranking das páginas
- **Compatibilidade**: Links antigos continuam funcionando
- **Limpeza**: Redireciona para URLs mais limpas

## 📝 Notas Importantes

1. **SSL/HTTPS**: A configuração inclui SSL, mas você precisa:
   - Gerar certificados (Let's Encrypt recomendado)
   - Descomentar as linhas de SSL no arquivo

2. **Caminho Raiz**: Ajuste o `root` para o caminho real onde seus arquivos estão hospedados

3. **Cache**: Arquivos estáticos (CSS, JS, imagens) têm cache de 1 ano, enquanto HTML não tem cache

4. **Logs**: Logs são salvos em `/var/log/nginx/`

## 🧪 Testar as URLs

Após aplicar a configuração, teste:

```bash
# Testar redirecionamento
curl -I https://acheinailha.com.br/busca

# Deve retornar:
# HTTP/1.1 301 Moved Permanently
# Location: /pages/property/busca.html
```

## 🐛 Troubleshooting

### Erro 502 Bad Gateway
- Verifique se o caminho `root` está correto
- Verifique permissões dos arquivos

### URLs não funcionam
- Verifique se o Nginx foi recarregado: `sudo systemctl reload nginx`
- Verifique os logs: `sudo tail -f /var/log/nginx/acheinailha-error.log`

### Redirecionamentos infinitos
- Verifique se não há conflito entre rewrite e return
- Teste a configuração: `sudo nginx -t`

## 📚 Referências

- [Documentação Nginx](https://nginx.org/en/docs/)
- [Nginx Rewrite Module](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html)

